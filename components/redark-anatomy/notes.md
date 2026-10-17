# Redark conveyor — revised Figure

The user requested a physical migration conveyor: a WordPress computer prints
an article, a scanner identifies and corrects broken links and media, the article
becomes structured MDX, and the belt feeds it into a Next.js computer. The paper
itself changes without an additional caption beneath the figure.

Truth: the case study describes the production WordPress → Gatsby migration in
2020 and a later Next.js prototype in 2025. The requested Next.js destination is
therefore a conceptual illustration; the project article explains the history.
Around 80 articles, preservation of URLs, relative internal links, broken-media
and link checks, metadata and MDX remain grounded in the case study.

Figure scope; low isometric camera, sage/olive, 8 manual scenes, time eased
transforms, reduced-motion still poses and shared offscreen pause. No shaders.

Parts before geometry:

- Base: plinth, four feet, top plate, service plaque, four fasteners.
- WordPress source: computer lower enclosure, print slot, two slot lips, paper
  tray, monitor neck, monitor foot, display enclosure, bezel, glass, power lamp,
  power key, side vents, screen article preview, WordPress logo.
- Conveyor: two structural rails, four legs, four bearing blocks, two drums,
  belt upper run, belt lower return, tread marks, front inspection cover,
  three support rollers, rail fasteners, entry/exit guide lips.
- Scanner: two columns, two feet, upper bridge, scanning bar, optical window,
  inspection carriage, two rail guides, error indicator and success indicator.
- Article: sheet, old mixed markup, broken-image placeholder, broken chain,
  corrected image, repaired chain, metadata block, MDX code blocks, check stamp.
- Next.js destination: input tray, two tray lips, receiving enclosure, input
  opening, monitor foot, neck, housing, bezel, glass, logo badge, screen logo,
  import code display, rendered page, preserved URL strip, switch, lamp, vents.

At each stop the whole paper has one readable state with no ghost opacity:
1 source screen, 2 printed raw article, 3 visible red error marks, 4 repaired
image and link, 5 structured MDX, 6 transport to destination, 7 import view,
8 final site. The same paper travels on the belt and is occluded by the source
and receiving computer cases. Narrative timing does not imply real throughput.

Verification: full TypeScript and scoped ESLint pass. Inspected all 8 scenes in
the parent's contact sheet, plus dedicated 4× captures of the error state,
corrected image/link and physical entry into the destination computer at
progress .792 and .86. The paper is occluded by the receiving case, rather than
faded during its journey. Dedicated Chrome capture had a clean console.
Formal Anatomy geometry/line-end audits have not been run for this custom React
figure; these visual checks do not constitute that proof.
