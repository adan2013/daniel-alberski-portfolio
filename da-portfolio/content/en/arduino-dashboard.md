## Physical gauges for a simulator

I wanted to build a set of physical vehicle gauges for Euro Truck Simulator 2 and American Truck Simulator. These were my first steps in electronics. Before starting the build, I spent months researching and learning independently, without AI assistance.

This is my most refined hardware project. I created the electronics and handmade gauge faces, a telemetry interpreter and gauge-face generator in C#/WPF, and Arduino firmware in C++.

## Arduino and SPI constraints

Displaying data meant working within the limited throughput of the Arduino and the display’s SPI bus. Drawing an interface was only part of the task: the refresh strategy affected how the whole device performed.

I optimised the display by updating the image in segments. I built the interface from basic primitives instead of a large GUI library. Those decisions followed from the capabilities of the hardware the software had to run on.

[media:1]

## Built by hand, from gauge faces to code

The entire project used DIY methods, without 3D printing or other advanced manufacturing techniques. Making the gauge faces by hand was part of the same work as electronics and programming. I had to get game data, my software and physical gauges working together.

[video]

## The result and supporting materials

The result is a complete gauge assembly for the simulators. The video shows the device in action, and the Redark documentation explains the build. I also published the repository. It records my experience of learning electronics by building a substantial, practical device.
