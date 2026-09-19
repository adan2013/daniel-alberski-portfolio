## An alarm for everyday use

I wanted to build a private alarm controller based on a Raspberry Pi. Its job is straightforward: read sensor states and send SMS alerts through a USB GSM modem. Reliable operation over long periods mattered more to me than the number of features.

This was my first large electronics project with a 3D-printed enclosure. I had to bring electronics, modem communication and software together into a device that would run without constant attention.

## The modem: AT commands and sparse documentation

Working with the modem involved AT commands and unlocking Huawei modems. Documentation was sparse. I used AI to help implement modem support, configure Linux and build an HTML control panel.

I wrote the main software in Node.js, with some Python. AI assistance left me more time for the electronics and enclosure. As with Gauge Generator, it was a substantial part of the project rather than an isolated experiment.

[media:1]

## Configuration without opening the enclosure

The web panel is available through the Raspberry Pi hotspot. It lets me configure phone numbers and check sensor states, among other things. Logs are collected in memory and accessible through the same interface, so I can see what the device is doing without opening it.

[media:2]

## The result: dozens of days without interruption

The alarm is still running and sending alerts, operating for dozens of days without interruption. That is the most important result for me: combining several different areas into a system that does its job every day. The code is public.
