/* ============================================================================
   Geosustara Enviro Services LLP — site behaviour
   Every block guards for the elements it needs, so one bundle serves every page.
   ========================================================================== */
(function () {
  'use strict';

  // `?motion=1` forces animation on for people who browse with reduced motion
  // but want to preview the site as designed. Affects only that visitor's URL.
  var reduce =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !/[?&]motion=1/.test(location.search);
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------- sticky header ----- */
  var hdr = $('header.site');
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle('stuck', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------- mobile drawer ----- */
  var burger = $('.burger'), drawer = $('.mnav');
  if (burger && drawer) {
    var setOpen = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('data-open', String(open));
      document.body.classList.toggle('locked', open);
      if (open) {
        var first = drawer.querySelector('a,button');
        if (first) first.focus({ preventScroll: true });
      }
    };
    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        burger.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && burger.getAttribute('aria-expanded') === 'true') setOpen(false);
    }, { passive: true });
  }

  /* ------------------------------------------- generative: hero mesh ------ */
  var mesh = $('#mesh'), meshLines = [];
  if (mesh) {
    for (var y = 0; y <= 10; y++) {
      var d = '', yy = 120 + y * 80;
      for (var x = 0; x <= 48; x++) {
        var px = x * 30, amp = (10 - y) * 3.6;
        var py = yy + Math.sin(x * 0.34 + y * 0.72) * amp + Math.sin(x * 0.13 + y * 0.3) * amp * 0.62;
        d += (x ? 'L' : 'M') + px + ' ' + py.toFixed(1);
      }
      var mp = document.createElementNS(NS, 'path');
      mp.setAttribute('d', d);
      mp.setAttribute('fill', 'none');
      mp.setAttribute('stroke', '#35C3AC');
      mp.setAttribute('stroke-width', '.7');
      mp.setAttribute('opacity', (0.05 + y * 0.021).toFixed(3));
      mesh.appendChild(mp);
      meshLines.push(mp);
    }
  }

  /* ------------------------------------------ generative: topo bands ------ */
  $$('[data-topo-band]').forEach(function (g, gi) {
    for (var i = 0; i < 7; i++) {
      var dd = '', base = 24 + i * 22;
      for (var x2 = 0; x2 <= 36; x2++) {
        var X = x2 * 40, Y = base + Math.sin(x2 * 0.42 + i * 0.85 + gi) * 13 + Math.sin(x2 * 0.17) * 8;
        dd += (x2 ? 'L' : 'M') + X + ' ' + Y.toFixed(1);
      }
      var q = document.createElementNS(NS, 'path');
      q.setAttribute('d', dd);
      q.setAttribute('opacity', (0.5 - i * 0.055).toFixed(2));
      g.appendChild(q);
    }
  });

  /* ------------------------------------- generative: per-card texture ----- */
  $$('[data-topo]').forEach(function (el, ci) {
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 400 300');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('style', 'width:100%;height:100%;display:block');
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('fill', 'none');
    g.setAttribute('stroke', '#35C3AC');
    g.setAttribute('stroke-width', '.8');
    for (var i = 0; i < 9; i++) {
      var d = '', b = -10 + i * 38;
      for (var x = 0; x <= 20; x++) {
        var X = x * 20, Y = b + Math.sin(x * 0.5 + i * 0.7 + ci) * 11 + Math.sin(x * 0.21 + ci) * 7;
        d += (x ? 'L' : 'M') + X + ' ' + Y.toFixed(1);
      }
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('opacity', (0.12 - i * 0.008).toFixed(3));
      g.appendChild(p);
    }
    svg.appendChild(g);
    el.appendChild(svg);
  });

  /* -------------------------------------- generative: lifecycle grid ------ */
  var lcg = $('#lcg');
  if (lcg) {
    for (var g2 = 1; g2 < 8; g2++) {
      ['M' + g2 * 50 + ' 0V400', 'M0 ' + g2 * 50 + 'H400'].forEach(function (dd2) {
        var l = document.createElementNS(NS, 'path');
        l.setAttribute('d', dd2);
        l.setAttribute('stroke', '#35C3AC');
        l.setAttribute('stroke-width', '.5');
        l.setAttribute('opacity', '.18');
        lcg.appendChild(l);
      });
    }
  }

  /* ------------------------------------------------- lazy-load Leaflet ---- */
  (function () {
    var el = $('#map');
    if (!el || !('IntersectionObserver' in window)) return;
    var started = false;
    var load = function () {
      if (started) return;
      started = true;
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = '/assets/vendor/leaflet.css';
      document.head.appendChild(css);
      var s = document.createElement('script');
      s.src = '/assets/vendor/leaflet.js';
      s.onload = function () {
        try {
          var lat = parseFloat(el.dataset.lat), lng = parseFloat(el.dataset.lng);
          var zoom = parseInt(el.dataset.zoom, 10) || 13;
          var map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], zoom);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            maxZoom: 19
          }).addTo(map);
          L.circleMarker([lat, lng], {
            radius: 9, color: '#35C3AC', weight: 2, fillColor: '#35C3AC', fillOpacity: 0.35
          }).addTo(map).bindPopup(el.dataset.popup || '');
        } catch (e) { /* map is decorative; the address is in the DOM regardless */ }
      };
      document.body.appendChild(s);
    };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { load(); io.disconnect(); } });
    }, { rootMargin: '600px' });
    io.observe(el);
  })();

  /* ------------------------ "on this page" vertical progress timeline ------ */
  // Plain scroll listener, not ScrollTrigger: this must keep working on the reduced-motion
  // path where GSAP is never loaded.
  (function () {
    var toc = $('#toc');
    if (!toc) return;
    var list = $('#toc-list', toc);
    var fill = $('#toc-fill', toc);

    // Article pages build their own list from the headings in the body.
    var autoSel = toc.dataset.autotoc;
    if (autoSel) {
      var heads = $$(autoSel).filter(function (h) { return h.textContent.trim(); });
      if (heads.length < 2) { toc.remove(); return; }
      heads.forEach(function (h, i) {
        if (!h.id) {
          h.id = h.textContent.trim().toLowerCase()
            .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 48) || ('section-' + i);
        }
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent.trim();
        li.appendChild(a);
        list.appendChild(li);
      });
    }

    var links = $$('a', list);
    if (!links.length) { toc.remove(); return; }

    var targets = links.map(function (a) {
      return document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    });
    if (targets.every(function (t) { return !t; })) { toc.remove(); return; }

    var DOT_OFFSET = 13 + 4;  // dot top + half its height, matching the CSS

    var setActive = function (i) {
      links.forEach(function (a, j) {
        if (j === i) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
        a.classList.toggle('is-past', j < i);
      });
      // Grow the lit line from the first dot down to the active one.
      if (fill && links[i]) {
        var top = list.getBoundingClientRect().top;
        var dot = links[i].getBoundingClientRect().top - top + DOT_OFFSET;
        fill.style.height = Math.max(0, dot - 12) + 'px';
      }
    };

    // A heading becomes active once it reaches the vertical middle of the viewport, and the
    // green fill follows the same index — so the dot and the line always advance together.
    // Intersection-based tracking fails here: several anchors are bare <h2>s only ~30px
    // tall, so between them nothing intersects and nothing would be highlighted.
    var ACTIVATE_AT = 0.5;
    var current = -1;
    var update = function () {
      var line = window.innerHeight * ACTIVATE_AT;
      var found = -1;
      for (var i = 0; i < targets.length; i++) {
        if (targets[i] && targets[i].getBoundingClientRect().top <= line) found = i;
      }
      if (found < 0) found = 0;
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        found = targets.length - 1;
      }
      if (found !== current) { current = found; setActive(found); }
    };
    // Synchronous rather than requestAnimationFrame: browsers already coalesce scroll events
    // to one per frame, this reads layout then writes once, and rAF stalls in background tabs.
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  /* ------------------------------------------------------ enquiry form ---- */
  (function () {
    var form = $('#enquiry');
    if (!form) return;
    var status = $('#form-status', form);
    var btn = form.querySelector('button[type=submit]');

    var say = function (msg, tone) {
      status.textContent = msg;
      status.style.color = tone === 'bad' ? '#FF9B7A' : (tone === 'good' ? '#5FE0C8' : '');
    };

    // Prefill the service dropdown from ?service=<slug> so service-page CTAs carry context.
    var wanted = new URLSearchParams(location.search).get('service');
    if (wanted) {
      var sel = $('#f-service', form);
      if (sel && sel.querySelector('option[value="' + CSS.escape(wanted) + '"]')) sel.value = wanted;
    }

    form.addEventListener('submit', function (e) {
      var endpoint = form.dataset.endpoint;

      // Native validation first, so required fields and email format are enforced.
      if (!form.checkValidity()) {
        e.preventDefault();
        var bad = form.querySelector(':invalid');
        if (bad) bad.focus();
        say('Please complete the required fields above.', 'bad');
        return;
      }
      if (!endpoint) {
        e.preventDefault();
        say('The enquiry form is not connected yet — please call ' +
            document.querySelector('[href^="tel:"]').textContent.trim() +
            ' or email us directly. Sorry for the detour.', 'bad');
        return;
      }
      e.preventDefault();
      btn.disabled = true;
      say('Sending…');
      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        say('Thank you — your enquiry has been sent. We will reply shortly.', 'good');
      }).catch(function () {
        say('That did not go through. Please email or call us instead.', 'bad');
      }).finally(function () { btn.disabled = false; });
    });
  })();

  /* ------------------------------------------- shared by both branches ---- */
  var counters = $$('[data-count]');
  var lcSteps = $$('.lc-step');
  var stageEl = $('#lcStage');
  var dot = $('#lcdot'), ring = $('#lcring'), trail = $('#lctrail');
  var PTS = [[200, 200], [128, 146], [268, 238], [176, 292]];

  /* ---------------------------------------------------- REDUCED MOTION ---- */
  if (reduce) {
    counters.forEach(function (el) {
      el.textContent = String(+el.dataset.count).padStart(2, '0');
    });
    $$('.metric').forEach(function (m) { m.classList.add('lit'); });
    lcSteps.forEach(function (s) { s.classList.add('on'); });
    return; // no Lenis, no GSAP — but every element is already in its final state
  }

  if (typeof gsap === 'undefined') return;

  /* ------------------------------------------------------ smooth scroll --- */
  var lenis = new Lenis({ duration: 1.08, smoothWheel: true });
  (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);

  $$('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href.length < 2) return;
    a.addEventListener('click', function (e) {
      var t = document.querySelector(href);
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -90 }); }
    });
  });

  /* ------------------------------------------------------ scroll progress - */
  if ($('#prog')) {
    gsap.to('#prog', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    });
  }

  /* -------------------------------------------------------- hero entrance - */
  if ($('.hero .hh')) {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-bg img', { scale: 1.16, duration: 2.3, ease: 'power2.out' }, 0)
      .from('.aurora i', { opacity: 0, scale: 0.7, duration: 1.8, stagger: 0.16 }, 0)
      .from('.eyebrow .rule', { scaleX: 0, duration: 0.8 }, 0.2)
      .from('.eyebrow .label', { opacity: 0, x: -12, duration: 0.7 }, 0.34)
      .from('.hh .ln>span', { yPercent: 112, duration: 1.15, stagger: 0.09 }, 0.3)
      .from('.hero-p,.hero-cta,.metrics', { y: 24, opacity: 0, duration: 0.85, stagger: 0.1 }, '-=.6')
      .from('.scrollcue', { opacity: 0, duration: 0.6 }, '-=.2');
  } else if ($('.phero h1')) {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.phero .crumbs,.phero h1,.phero .lede,.phero .hero-cta',
            { y: 22, opacity: 0, duration: 0.8, stagger: 0.08 });
  }

  meshLines.forEach(function (p, i) {
    gsap.to(p, {
      y: (i % 2 ? -1 : 1) * (7 + i * 1.6), duration: 7 + i * 0.42,
      ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.13
    });
  });

  /* ------------------------------------------------------------ reveals --- */
  gsap.utils.toArray('.rv').forEach(function (el) {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ----------------------------------------------------------- counters --- */
  counters.forEach(function (el) {
    var end = +el.dataset.count, o = { v: 0 }, row = el.closest('.metric');
    ScrollTrigger.create({
      trigger: el, start: 'top 94%', once: true,
      onEnter: function () {
        if (row) row.classList.add('lit');
        gsap.to(o, {
          v: end, duration: 1.2, ease: 'power2.out',
          onUpdate: function () { el.textContent = String(Math.round(o.v)).padStart(2, '0'); }
        });
      }
    });
  });

  /* ---------------------------------------------------------- parallax ---- */
  if ($('.hero-bg img')) {
    gsap.to('.hero-bg img', {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
    });
  }
  if ($('.aurora .a1')) {
    var scope = $('.hero') ? '.hero' : '.phero';
    gsap.to('.aurora .a1', { yPercent: 26, xPercent: -8, ease: 'none',
      scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.aurora .a2', { yPercent: -20, ease: 'none',
      scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom top', scrub: 1 } });
  }

  /* Note: the primary nav marks the current *page* via aria-current in the template.
     Section tracking is handled by the "on this page" bar above, not here. */

  /* --------------------------------------------------- lifecycle stepper -- */
  if (lcSteps.length && stageEl) {
    lcSteps.forEach(function (st, i) {
      ScrollTrigger.create({
        trigger: st, start: 'top 62%', end: 'bottom 62%',
        onToggle: function (self) {
          if (!self.isActive) return;
          lcSteps.forEach(function (s) { s.classList.remove('on'); });
          st.classList.add('on');
          stageEl.textContent = st.dataset.stage || '';
          if (trail) {
            var d = 'M' + PTS[0][0] + ' ' + PTS[0][1];
            for (var k = 1; k <= i; k++) d += 'L' + PTS[k][0] + ' ' + PTS[k][1];
            trail.setAttribute('d', d);
          }
          if (dot && ring) {
            gsap.to([dot, ring], { attr: { cx: PTS[i][0], cy: PTS[i][1] }, duration: 0.9, ease: 'power3.inOut' });
            gsap.fromTo(ring, { attr: { r: 10 }, opacity: 0.95 },
                              { attr: { r: 34 }, opacity: 0.7, duration: 0.9, ease: 'power2.out' });
          }
        }
      });
    });
  }

  /* ------------------------------------------- pointer-only enhancements -- */
  if (!finePointer) return;

  $$('.bx').forEach(function (card) {
    var queued = false, mx = 0, my = 0;
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 100;
      my = ((e.clientY - r.top) / r.height) * 100;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        card.style.setProperty('--mx', mx.toFixed(1) + '%');
        card.style.setProperty('--my', my.toFixed(1) + '%');
        queued = false;
      });
    }, { passive: true });

    var ico = card.querySelector('[data-draw]');
    if (!ico) return;
    var segs = ico.querySelectorAll('path,rect,circle,polyline');
    card.addEventListener('pointerenter', function () {
      segs.forEach(function (s, si) {
        var len;
        try { len = s.getTotalLength ? s.getTotalLength() : 140; } catch (e) { len = 140; }
        if (!len) len = 140;
        gsap.fromTo(s,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 0.75, ease: 'power2.out', delay: si * 0.07,
            onComplete: function () { s.style.strokeDasharray = 'none'; } });
      });
    });
  });

  $$('.mag').forEach(function (btn) {
    var qx = gsap.quickTo(btn, 'x', { duration: 0.45, ease: 'power3.out' });
    var qy = gsap.quickTo(btn, 'y', { duration: 0.45, ease: 'power3.out' });
    btn.addEventListener('pointermove', function (e) {
      var r = btn.getBoundingClientRect();
      qx((e.clientX - (r.left + r.width / 2)) * 0.28);
      qy((e.clientY - (r.top + r.height / 2)) * 0.4);
    }, { passive: true });
    btn.addEventListener('pointerleave', function () { qx(0); qy(0); });
  });

  var brand = $('.brand');
  if (brand) {
    var l1 = $('#lg1'), l2 = $('#lg2'), l3 = $('#lg3');
    if (l1 && l2 && l3) {
      brand.addEventListener('pointerenter', function () {
        gsap.to(l1, { y: -2.5, duration: 0.5, ease: 'power3.out' });
        gsap.to(l3, { y: 2.5, duration: 0.5, ease: 'power3.out' });
      });
      brand.addEventListener('pointerleave', function () {
        gsap.to([l1, l2, l3], { y: 0, duration: 0.5, ease: 'power3.out' });
      });
    }
  }
})();
