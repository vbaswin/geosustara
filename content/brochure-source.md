# Geosustara Enviro Services LLP — Brochure Source

> Verbatim extraction from the company brochure PDF
> (`Geosustara Enviro Services LLP (2).pdf`, supplied 2026-09-19).
> Together with `company-source.md` this is the **single source of truth** for site copy.
> Where the two disagree, the brochure wins — it is the later document.
>
> The logo artwork supplied alongside it is kept at `.tooling/brand/logo-original.png`
> (untouched) and `.tooling/brand/logo-master.png` (trimmed, background keyed out). Every
> icon, favicon and header mark on the site is generated from the master by
> `npm run brand`.

---

## Straplines

- **Strategies for a Sustainable Tomorrow** (brochure headline)
- Expertise You Can Trust. Engineering Backed by Evidence.
- From understanding the environment to designing sustainable solutions.
- Understand better. Decide smarter. Sustain responsibly.
- Bridging environmental responsibility with practical implementation.

## Vision (brochure)

> "To be a premier catalyst for sustainable development, harmonizing industrial progress
> with environmental integrity."

This **supersedes** the vision statement in `company-source.md`, which is retained there for
history but is no longer used on the site.

## Why us

Environmental challenges are often complex — limited site data, fragmented information,
regulatory requirements and impractical solutions can make environmental decision-making
difficult.

We bridge this gap through field investigation, scientific analysis, GIS & remote sensing,
and practical engineering solutions to deliver clear insights and sustainable outcomes.

## Our Expertise

- Environmental Engineering
- GIS, Remote Sensing & Mapping
- Environmental Impact Assessment (EIA)
- Environmental Clearance (EC) Support
- Water Quality Assessment & Reporting
- Wastewater Treatment & Reactor Design
- Environmental Site Investigation
- CADD & Technical Design

## Our Core Services (brochure numbering)

1. **Environmental Compliance & Consulting** — regulatory approvals and compliance support;
   audits, reporting, and baseline monitoring
2. **GIS & Geospatial Services** — thematic mapping and spatial modelling; LULC, watershed,
   and sensitivity analysis
3. **Pollution Control & Management** — pollution control and system maintenance; water,
   wastewater and solid waste management
4. **Sustainability & Eco Solutions** — sustainability planning for projects
5. **Training & Research Support** — industry training and capacity-building; academic
   research and project guidance

## Practice areas (the brochure's second framing)

**EIA & Compliance**
- Preparation of comprehensive Environmental Impact Assessment (EIA) reports
- Site investigation reports for EIA and Environmental Clearance (EC) related works

**Water, Wastewater and Solid Waste Management**
- Design and implementation of sewage treatment plants
- Solid waste treatment facilities
- Water treatment systems for swimming pools and related recreational water bodies

**Environmental Analysis & Spatial Solutions**
- Water quality analysis and testing
- GIS-related mapping, spatial analysis, and consultancy works

**Academic & Research Support**
- Professional academic coaching for GIS applications and software
- Comprehensive guidance and assistance for academic projects

## Who We Serve

| Sector | What they come to us for |
| --- | --- |
| Industries & Manufacturing | Environmental assessments, compliance and management solutions |
| Hotels & Commercial Establishments | Water, wastewater and environmental solutions |
| Quarries & Mineral-Based Industries | Site assessment, mapping and environmental studies |
| Government Agencies & Local Bodies | Environmental studies, mapping and technical support |
| Students & Academic Institutions | Environmental analysis, GIS, mapping and technical assistance |

`company-source.md` additionally names **residential communities** and **research
organizations**; both are kept, giving seven sectors on the site.

## Contact (brochure)

- **+91 6282462332**
- **+91 8086851442**
- www.geosustara.com
- geosustara@gmail.com

> ⚠️ The site previously listed **+91 94469 93196**, which appears nowhere in the brochure.
> It has been removed in favour of the two numbers above. If it is still a valid line,
> add it back to `contact.phones` in `src/_data/site.json`.

---

## How the brochure maps onto the site's six service pages

| Site service | Sourced from |
| --- | --- |
| Environmental Compliance & Consulting | Core service 1 |
| Environmental Impact Assessment & Clearance | Practice area "EIA & Compliance" + expertise (EIA, EC support, site investigation) |
| GIS, Remote Sensing & Mapping | Core service 2 + "Environmental Analysis & Spatial Solutions" (spatial half) + expertise |
| Water, Wastewater & Solid Waste Management | Core service 3 + "Water, Wastewater and Solid Waste Management" + expertise (reactor design, water quality, CADD) |
| Sustainability & Eco Solutions | Core service 4 |
| Training, Research & Academic Support | Core service 5 + "Academic & Research Support" |

## Still NOT supplied, and still not to be invented

- Year founded, team size, team member names or bios
- Client names, logos, testimonials, case studies
- Certifications, accreditations, LLPIN / GSTIN
- Project counts, statistics, awards
- Pricing
- Social media handles (no `sameAs` is published in the structured data because of this)
- Exact office coordinates — the contact map is pinned at neighbourhood level and is
  flagged as approximate
