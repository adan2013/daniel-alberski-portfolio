# DIY Arduino Dashboard · Anatomy Figure

## Concept and evidence

An already removed Volkswagen Golf IV instrument cluster loses its pointers, then its original faces. The same four mechanisms remain on a continuous donor instrument PCB. Custom truck scales seat before the pointers are fitted. Arduino and the expander descend behind the instrument PCB, onto standoffs fixed to the lower plywood base. The front and plain lid close, then the numeric scales brighten and the physical gauges follow simulated ETS2 telemetry.

Read: content/pl/arduino-dashboard.md and content/en/arduino-dashboard.md. Inspected: public/projects/arduino-dashboard.jpg, arduino-dashboard-lcd-screens.jpg, arduino-dashboard-wiring-diagram.jpg and arduino-dashboard-telemetry-interpreter.jpg. The illuminated original-article photo, from https://redark.pl/static/1f300bcf3b67b0a453d1af6d61c569db/e1897/IMG_20210618_231410_redark.jpg, is the reference for seven indicator symbols around each pointer's upper/side arc and two separate arrows beside the small gauges.

The donor PCB is illustrative geometry, not a trace of the actual circuit. It does not claim the whole DIY project had a dedicated custom PCB: the case study explicitly says it used hand wiring. Arduino and the expander remain separate modules. The animation is an explanatory assembly, not measured teardown footage. Telemetry is synthetic.

## Parts and geometry

Figure scope: more than sixty purposeful components. Original assembly: molded shell, rear wall, two curved lobes, center rise, instrument PCB, copper tracks, terminal pads, chip package, connector, resistors and mounting screws. Four motor bodies, mounting tabs, hubs and shafts. Four old faces, four custom faces, separate old/new pointers. Fourteen warning symbols and two direction arrows. Plywood base, rear, side panels, front fascia with gauge/LCD openings, solid lid, feet and fasteners. Eight six-unit standoffs. Arduino PCB, MCU, USB socket, power connector, pin headers and reset button; expander board, IC and solder pads; terminated harness. LCD glass/bezel, monitor stand, shell and simulated game display.

Shared sage/olive palette and four-tone kit solids; low oblique camera. Geometry is server-rendered with stable keys. Client animation changes attributes through refs; the shared scene hook provides reduced motion and offscreen suspension. Static art is usable without WebGL.

World contacts: base top z7; standoffs span z7–13; Arduino and expander board bottoms finish at z13. There is no upper shelf. The boards descend 215 units behind the instrument PCB; the connecting harness stays at y−8, behind the donor PCB's back plane y−2. Final harness height is below the donor PCB's lower edge. The front panel has actual apertures; the LCD aperture is inset two units behind its rounded bezel.

## Sequencing and hooks

Seven stops remain [0, .19, .40, .57, .75, .88, 1]. Old pointers are removed by .19. Old faces leave by .40. Replacement faces seat by .52; new pointers install only during .535–.57. The enclosure opens during .59–.65. Electronics descend during .66–.75 and reach the lower mounting points before the front/lid close in .77–.88. Power and scale brightness follow `running` in .94–1.

- `data-ad-indicator="speed"` / `"rpm"`: seven each; `"turn-left"` / `"turn-right"`: one each.
- `data-ad-scale="speed"` / `"rpm"` contain `.ad-scale-number`; computed fill interpolates from rgb(110 125 100) to rgb(237 244 220).
- `new-faces[data-seated][data-backlight]`, separate `old-needles` and `new-needles`.
- `electronics[data-seated][data-bottom-z][data-mount="lower-base"]`.
- `lower-base[data-top-z="7"]`; `floor-mounts[data-mount-base-z="7"][data-mount-top-z="13"]`.
- `lid[data-closed]`; individual `motor-speed/rpm/fuel/air`.

## Lighting and layout

`arduinoNeedleInk` supplies the initial SVG and live fill/stroke for all four pointers. Both donor and replacement pointers start with body rgb(96 66 58), edge rgb(74 54 48), and highlight rgb(110 78 68). The replacement pointers brighten with `running`; powered body ink is rgb(239 96 77). There are no competing CSS overrides for needle colors.

Brake warning pulses red at 1 Hz (opacity .3–1, reduced motion .8); battery stays red and high beam stays blue. Lamp opacity is multiplied by `running`. Each large dial carries seven different warning symbols; the two turn arrows bring the total to sixteen.

The complete instrument assembly, LCD and matching fascia apertures share a 20-unit downward offset. Upper small-face clearance is 23 units and lower large-face clearance is 18. The PCB lower edge at z29.8 clears the floor electronics at z26. The monitor is scaled by 1.22 with an eight-unit stand.

## Verification and limits

Regression coverage is in `tests/new-anatomy-stories.spec.ts`: assembly order, floor seating before closure, all four pointer colors, sixteen indicators, warning colors/pulsing, keyboard navigation, mobile layout and reduced motion. Desktop/mobile scenes and mechanism close-ups were inspected during development.

A full Anatomy collision and line-end audit is not implemented. The donor traces and component placement are illustrative and should not be used as a wiring diagram.
