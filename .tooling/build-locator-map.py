"""Render src/assets/img/locator-map.svg — the static map on the contact page.

    python .tooling/build-locator-map.py

Why this exists
---------------
The contact page used a Leaflet map against CARTO's free dark basemap. In September 2026
CARTO began requiring an API key and started serving tiles with "API KEY REQUIRED" printed
across them, so the page silently broke. Every free tile service can do that, and the map
was decorative anyway: locality-level, deliberately kept out of the structured data.

So the map is now drawn once, here, and committed as a plain SVG. The site ships it as an
<img> and makes no map request at runtime — no tile service, no API key, no JavaScript,
nothing to expire. It also costs about 13 KB over the wire, less than a single tile.

Data
----
OpenStreetMap via the Overpass API, used under the ODbL. The required attribution is drawn
into the artwork itself and repeated in the figure caption, so it cannot be lost by cropping.

Only Python's standard library is needed. Re-run it if the office moves or the extent needs
changing; it takes about a minute, most of which is Overpass.
"""
import json
import math
import io
import os
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "assets", "img", "locator-map.svg")

# --- what to draw -----------------------------------------------------------
# The extent is chosen so the frame carries what actually identifies the place: the
# Arabian Sea coast, the city centre, and the office. Aspect is ~1.5 to match the panel.
LAT1, LAT0 = 8.5245, 8.4316          # north, south
LON0, LON1 = 76.885, 77.025          # west, east
W, H = 920, 613

OFFICE = (8.4703, 76.9818)           # Pappanamcode locality centroid, from OSM

LABELS = [
    ("Thiruvananthapuram", 8.4882, 76.9476, "city"),
    ("Karamana",           8.4817, 76.9663, "sub"),
    ("Poojappura",         8.4898, 76.9736, "sub"),
    ("Nemom",              8.4591, 76.9986, "sub"),
    ("Valiyathura",        8.4645, 76.9269, "sub"),
    ("Vellayani",          8.4457, 76.9922, "sub"),
]

# Palette from src/assets/css/site.css. Water is a dark teal rather than a green so it
# separates from land without leaving the brand palette.
C = {
    "land":  "#0A1F14",   # --bg-2
    "water": "#0A262B",
    "road1": "rgba(198,219,206,.34)",
    "road2": "rgba(198,219,206,.15)",
    "rail":  "rgba(198,219,206,.22)",
    "coast": "rgba(22,194,100,.30)",
    "ink":   "#8CA497",   # --muted
    "ink2":  "#64786C",   # --muted-2
    "brand": "#16C264",
}

FONT = "Inter, Segoe UI, Helvetica, Arial, sans-serif"

QUERY = """[out:json][timeout:120];
(
  way["highway"~"^(motorway|trunk|primary|secondary)$"](%f,%f,%f,%f);
  way["railway"="rail"]["service"!~"."](%f,%f,%f,%f);
  way["natural"="coastline"](%f,%f,%f,%f);
  way["natural"="water"](%f,%f,%f,%f);
  way["waterway"="river"](%f,%f,%f,%f);
);
out geom;"""

# Fetch a little beyond the frame so lines do not stop short at the edge.
PAD = 0.03
BOX = (LAT0 - PAD, LON0 - PAD, LAT1 + PAD, LON1 + PAD)


def fetch():
    q = QUERY % (BOX * 5)
    req = urllib.request.Request(
        "https://overpass-api.de/api/interpreter",
        data=urllib.parse.urlencode({"data": q}).encode(),
        headers={"User-Agent": "geosustara-site-build/1.0 (geosustara.com; "
                               "one-off static locator map; geosustara@gmail.com)"},
    )
    print("querying Overpass…")
    with urllib.request.urlopen(req, timeout=180) as r:
        return json.loads(r.read().decode("utf-8"))["elements"]


# --- projection -------------------------------------------------------------
def merc(lat):
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


MY0, MY1 = merc(LAT0), merc(LAT1)


def proj(lat, lon):
    return ((lon - LON0) / (LON1 - LON0) * W,
            (MY1 - merc(lat)) / (MY1 - MY0) * H)


def _dp(pts, tol):
    """Ramer-Douglas-Peucker, in screen units, so the tolerance means pixels."""
    if len(pts) < 3:
        return pts
    stack, keep = [(0, len(pts) - 1)], [False] * len(pts)
    keep[0] = keep[-1] = True
    while stack:
        i, j = stack.pop()
        ax, ay = pts[i]
        bx, by = pts[j]
        dx, dy = bx - ax, by - ay
        n = math.hypot(dx, dy)
        best, bi = -1.0, -1
        for k in range(i + 1, j):
            px, py = pts[k]
            d = (abs(dy * px - dx * py + bx * ay - by * ax) / n) if n \
                else math.hypot(px - ax, py - ay)
            if d > best:
                best, bi = d, k
        if best > tol:
            keep[bi] = True
            stack.append((i, bi))
            stack.append((bi, j))
    return [p for p, k in zip(pts, keep) if k]


def path(points, close=False, tol=0.9):
    """Compact path data. Integer units and relative segments: the frame is 920 wide and
    displays at roughly half that, so finer precision is invisible and triples the size."""
    scr, last = [], None
    for lat, lon in points:
        x, y = proj(lat, lon)
        p = (round(x), round(y))
        if p != last:
            scr.append(p)
            last = p
    scr = _dp(scr, tol)
    if len(scr) < 2:
        return None
    out = ["M%d %d" % scr[0]]
    px, py = scr[0]
    for x, y in scr[1:]:
        out.append("l%d %d" % (x - px, y - py))
        px, py = x, y
    return "".join(out) + ("Z" if close else "")


def screen_area(points):
    scr = [proj(la, lo) for la, lo in points]
    a = 0.0
    for i in range(len(scr)):
        x0, y0 = scr[i]
        x1, y1 = scr[(i + 1) % len(scr)]
        a += x0 * y1 - x1 * y0
    return abs(a) / 2


def in_frame(points, pad=0.02):
    return any(LAT0 - pad <= la <= LAT1 + pad and LON0 - pad <= lo <= LON1 + pad
               for la, lo in points)


def chain(ways):
    """Join coastline ways end to end, longest chain first."""
    ways = [list(w) for w in ways]
    chains = []
    while ways:
        cur = ways.pop(0)
        moved = True
        while moved:
            moved = False
            for i, w in enumerate(ways):
                if abs(cur[-1][0] - w[0][0]) < 1e-7 and abs(cur[-1][1] - w[0][1]) < 1e-7:
                    cur += w[1:]
                    ways.pop(i)
                    moved = True
                    break
                if abs(cur[0][0] - w[-1][0]) < 1e-7 and abs(cur[0][1] - w[-1][1]) < 1e-7:
                    cur = w[:-1] + cur
                    ways.pop(i)
                    moved = True
                    break
        chains.append(cur)
    return sorted(chains, key=len, reverse=True)


# --- build ------------------------------------------------------------------
def main():
    els = fetch()
    roads1, roads2, rails, rivers, waters, coast = [], [], [], [], [], []
    for e in els:
        if e["type"] != "way" or "geometry" not in e:
            continue
        pts = [(g["lat"], g["lon"]) for g in e["geometry"]]
        if not in_frame(pts):
            continue
        t = e.get("tags", {})
        hw = t.get("highway")
        if hw in ("motorway", "trunk", "primary"):
            roads1.append(pts)
        elif hw == "secondary":
            roads2.append(pts)
        elif t.get("railway") == "rail":
            rails.append(pts)
        elif t.get("natural") == "coastline":
            coast.append(pts)
        elif t.get("natural") == "water":
            waters.append(pts)
        elif t.get("waterway") == "river":
            rivers.append(pts)

    s = io.StringIO()
    s.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" role="img" '
            'aria-label="Locator map of Thiruvananthapuram, Kerala, showing the Geosustara '
            'office at Pappanamcode, the city centre and the Arabian Sea coast.">' % (W, H))
    s.write('<title>Geosustara Enviro Services LLP — Pappanamcode, '
            'Thiruvananthapuram</title>')
    s.write('<rect width="%d" height="%d" fill="%s"/>' % (W, H, C["land"]))

    # Sea. OSM coastline ways run with land on the left, so the water is west of the
    # chain: run off the western edge at both ends and close the polygon.
    chains = chain(coast)
    coast_d = []
    if chains:
        d = path(chains[0])
        if d:
            coast_d.append(d)
            _, y0 = proj(*chains[0][0])
            _, y1 = proj(*chains[0][-1])
            s.write('<path d="%s L-8 %g L-8 %g Z" fill="%s"/>' % (d, y1, y0, C["water"]))
    for c in chains[1:]:
        d = path(c)
        if d:
            coast_d.append(d)

    kept = 0
    for pts in waters:
        if screen_area(pts) < 18:        # a few pixels: invisible, pure file weight
            continue
        d = path(pts, close=True, tol=0.7)
        if d:
            kept += 1
            s.write('<path d="%s" fill="%s"/>' % (d, C["water"]))

    s.write('<g fill="none" stroke-linecap="round" stroke-linejoin="round">')
    for pts in rivers:
        d = path(pts)
        if d:
            s.write('<path d="%s" stroke="%s" stroke-width="1.4"/>' % (d, C["water"]))
    for d in coast_d:
        s.write('<path d="%s" stroke="%s" stroke-width="1.2"/>' % (d, C["coast"]))
    for pts in roads2:
        d = path(pts)
        if d:
            s.write('<path d="%s" stroke="%s" stroke-width="1.1"/>' % (d, C["road2"]))
    for pts in roads1:
        d = path(pts)
        if d:
            s.write('<path d="%s" stroke="%s" stroke-width="1.9"/>' % (d, C["road1"]))
    for pts in rails:
        d = path(pts)
        if d:
            s.write('<path d="%s" stroke="%s" stroke-width="1" stroke-dasharray="5 4"/>'
                    % (d, C["rail"]))
    s.write('</g>')

    s.write('<g font-family="%s" fill="%s">' % (FONT, C["ink"]))
    sx, sy = proj(8.4455, 76.9005)
    s.write('<text x="%g" y="%g" font-size="18" letter-spacing="3.4" fill="%s" opacity=".8" '
            'text-anchor="middle" transform="rotate(-38 %g %g)">ARABIAN SEA</text>'
            % (sx, sy, C["ink"], sx, sy))
    for name, la, lo, kind in LABELS:
        x, y = proj(la, lo)
        big = kind == "city"
        s.write('<circle cx="%g" cy="%g" r="%g" fill="%s" opacity="%s"/>'
                % (x, y, 3.2 if big else 2.2, C["ink"], ".8" if big else ".5"))
        s.write('<text x="%g" y="%g" font-size="%d" letter-spacing="%s" opacity="%s"%s>'
                '%s</text>'
                % (x + 8, y + 4, 17 if big else 13, "1.2" if big else ".4",
                   ".95" if big else ".7", ' font-weight="600"' if big else '', name))
    s.write('</g>')

    ox, oy = proj(*OFFICE)
    s.write('<g><circle cx="%g" cy="%g" r="26" fill="%s" opacity=".16"/>'
            % (ox, oy, C["brand"]))
    s.write('<circle cx="%g" cy="%g" r="13" fill="none" stroke="%s" stroke-width="1.6" '
            'opacity=".7"/>' % (ox, oy, C["brand"]))
    s.write('<circle cx="%g" cy="%g" r="5.5" fill="%s"/>' % (ox, oy, C["brand"]))
    s.write('<text x="%g" y="%g" font-family="%s" font-size="16" font-weight="600" '
            'letter-spacing=".6" fill="#E8F2EB">Geosustara</text>' % (ox + 22, oy - 4, FONT))
    s.write('<text x="%g" y="%g" font-family="%s" font-size="13" letter-spacing=".3" '
            'fill="%s">Pappanamcode</text></g>' % (ox + 22, oy + 14, FONT, C["ink"]))

    # ODbL attribution, drawn into the artwork so it survives any crop or reuse.
    s.write('<text x="%d" y="%d" text-anchor="end" font-family="%s" font-size="12" '
            'fill="%s" opacity=".85">© OpenStreetMap contributors</text>'
            % (W - 10, H - 10, FONT, C["ink2"]))
    s.write('</svg>')

    with open(OUT, "w", encoding="utf-8") as f:
        f.write(s.getvalue())
    print("wrote %s  %.1f KB" % (os.path.relpath(OUT, ROOT), os.path.getsize(OUT) / 1024))
    print("roads %d + %d | rail %d | water %d of %d | rivers %d"
          % (len(roads1), len(roads2), len(rails), kept, len(waters), len(rivers)))


if __name__ == "__main__":
    main()
