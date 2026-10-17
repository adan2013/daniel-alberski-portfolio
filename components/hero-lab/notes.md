# Hero animation comparison

Three concepts on a separate /hero-lab route. The first two are physical
instruments with 60+ purposeful parts; the third reconstructs a portrait.
Existing home and case studies stay as-is.

A — Prototype bench. A monitor, keyboard and an open controller share a test
backplane. Scroll seats a PCB, slides a control fascia into its mounting slots,
then sends a command along a printed conductor; the controller acknowledges it
and both screens agree. This is a conceptual bench, not a reconstruction of a
specific project. Motion and readouts derive from one reversible progress value.

Parts before geometry:

- Base: plinth, top insert, four feet, edge groove, four corner fasteners,
  service plaque, backplane, two printed signal traces and four terminal pads.
- Computer: base, stem, rear enclosure, front bezel, inset glass, lower bezel,
  power button, status LED, eight vents, four corner fasteners.
- Keyboard: lower enclosure, top deck, four rows of ten keys, space bar.
- Controller: bedplate, rear wall, two side walls, four mounting blocks,
  circuit board, processor, eight chip pins, two connector banks, six contacts
  per connector, three resistors, four corner fasteners, fascia, glass window,
  status lamp, two pushbuttons and four fascia fasteners.

B — Interface plotter. A real XY gantry carries a square pen holder over a
clamped sheet. Scroll moves its two axes and draws the exact polyline under the
pen. The pen lifts between separate strokes, then parks. No decorative motion.

Parts before geometry:

- Base: plinth, four feet, machined bed, recessed insert, two alignment rulers,
  major/minor ticks, four corner fasteners and identification plate.
- Workholding: paper sheet, four mounting blocks, four clamping fingers,
  four clamping screws.
- Y axis: two extrusion rails, two belt channels, two belt strips, four end
  stops, four end caps, two carriage shoes, two risers and eight fasteners.
- X axis: bridge, upper and lower tracks, toothed belt, two end blocks,
  motor enclosure, motor cover, six cooling slots and four fasteners.
- Tool: carriage plate, four sliding pads, holder bracket, square pen body,
  collar, nib, two mounting screws and status indicator.
- Control: enclosure, inset display, three keys, status lamp and four screws.

All volume is extruded rounded rectangular plans; screws are face engravings.
Signals are printed traces on a common PCB, not unsupported physical cables.
No pipes, curved turned bodies, WebGL or rotating 3D assemblies. The pen's
trajectory and rendered stroke lengths share one model, including pen-up travel.

Verification: browser review at start/middle/end, reverse scroll, phone,
reduced motion, DOM bounds and console; TypeScript and lint.

C — Portrait reconstruction. The supplied 1024 × 1024 portrait is divided into
25 square crops. Thirteen pair exchanges run in seven batches, mixing horizontal
and vertical movement. Two independent pairs move together in each batch; the
last dependent pair moves on its own. The scroll section is shortened to 220svh.
The last two swaps resolve a three-tile cycle so all 25 tiles start displaced.
Gaps and tile scale stay fixed until the final 6% of progress. Navy, red, slate,
paper and sage duotones, displaced scan bands and
scanlines fade as the correct portrait emerges. No time-driven flashing. The
final complete-image layer avoids subpixel seams between adjacent SVG clips.
The original supplied file is served as JPEG, matching its actual encoding.

Portrait validation: all 25 crops are unique, all final transforms are correct,
all effects disappear, reverse seeking restores the same shuffle, and the
browser console is clean. Reviewed at 1280 px and 390 px, including reduced
motion, which defaults to the complete portrait. All three figures use scroll
alone; the stage buttons, progress bar and bottom control footer are removed.

Validation completed:

- TypeScript (`pnpm typecheck`), targeted ESLint and Prettier checks pass.
- Start, intermediate and final poses, reverse seeking and native scroll checked.
  Final plot can return to a completely blank sheet.
- Line-end check: 0 floating ends in all eight poses after correcting the
  rounded placeholder's diagonal endpoints; 68 ends on the initial bench and
  274 ends on the plotter. Printed chip text uses the kit's free-end convention.
- Desktop 1280 px, mobile 390 px, reduced-motion stills and 4x detail captures
  reviewed. No horizontal overflow or browser console warnings/errors.
- Reduced motion defaults all three scenes to their complete pose.
