# Smart Home · Anatomy Figure

## Concept and sources

The user requested a data-flow graph with six physical devices: phone, wall tablet, custom backend, Home Assistant host, USB Zigbee coordinator and smart socket. This explicit layout overrides Anatomy guidance against graph arrows and labels. Backend and HA enclosures illustrate software roles; they do not imply two physical servers. Timing is narrative.

The wall tablet and its side lights follow `public/projects/smart-home-tablet.jpg` and the project article. The notification illustrates confirmation of the command. The coordinator is illustrative USB-A hardware, not an exact product model.

The Home Assistant outline is embedded directly in `art.tsx`, with sage ink and the host's projection. Its source is `home-assistant-logomark-monochrome-on-light.svg` from the official [logo archive](https://github.com/home-assistant/assets/blob/master/logo/home-assistant-logo.zip), checked against the [brand guidance](https://contributors.home-assistant.io/brand/name-and-logo/) on 2026-10-17. The mark identifies the dependency in this independent case study. No duplicate public SVG is needed.

## Geometry

The 800×560 viewBox places the main columns at x110, x400 and x690. Phone and tablet shells have 2.5-unit depth; other shells use nine units. Chassis fronts and trim have square corners. Functional parts such as sockets, LEDs and toggles remain round.

Tablet LED strips sit on the side edges and cast light behind the enclosure. HA body, fascia and logo share one affine projection. USB is on the right of the dongle, antenna on the left; retention holes are stacked vertically. Radio follows one quadratic curve.

Phone and tablet toggle dimensions are shared between art and animation in `layout.ts`. Packets use 48×26 boxes, 12px text and a vector checkmark.

## Sequence and rendering

Eight manual stops: overview, phone command, backend processing, HA routing, USB/radio, socket enabled, returning confirmation, synchronized dashboards. The `connected` LED stays on; `enabled` lights before the clients switch to ON. The tablet notification and side LEDs activate after confirmation reaches both clients.

`layout.ts` defines forward paths, exact reverse paths and packet routes. At return, all five connections reverse and the socket emits radio waves. The outgoing command paths are removed from painting with `display:none`, not merely hidden with dash offsets. One separate arrowhead sits at each reversed path's endpoint, aligned to its tangent; feedback paths have no duplicate markers. Packets stop clear of the arrowheads.

Static device art is server-rendered. The client changes SVG attributes through refs. The shared progress hook handles keyboard controls, eased transitions, reduced motion and offscreen suspension. There are no extra captions beneath the figure.

## Verification and limits

`tests/new-anatomy-stories.spec.ts` covers sequencing, endpoint positions, absence of outgoing arrows during normal-motion ACK, toggle/packet containment, mobile layout and reverse navigation. Desktop/mobile scenes and enlarged device details were inspected during development.

A full Anatomy collision and line-end audit is not implemented. These connectors describe data flow rather than physical wiring.
