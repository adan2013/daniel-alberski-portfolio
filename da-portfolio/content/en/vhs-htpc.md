## A second life for our family VCR

I wanted to fit a media PC inside our family VCR. I used an old laptop as the starting point. The project required both a new mechanical arrangement and a way to connect computer control with a physical display and remote.

## The first problem: making everything fit

The hardest part was arranging the laptop components inside the small enclosure. I placed them in three layers. 3D-printed parts helped me adapt the structure to the available space.

This project went well beyond writing an application: component placement mattered just as much as whether the code worked correctly.

[media:1]

## The second problem: a display driver and menu

I soldered my first segment-display controller. I added a remote-controlled menu so the device would be convenient to use while watching videos.

The ESP8266 circuit communicates with a C# application running on Windows. Together they handle the remote and display, bringing the computer, electronics and physical controls into one system.

[media:2]

## The result and documentation

The device is still working. I published the code, circuit diagram and build documentation with photos. The project shows two complementary sides of my work: solving physical constraints and writing software for specific hardware.
