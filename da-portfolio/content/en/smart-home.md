## An interface for the home I use

I designed my own home-management system. The React frontend runs on a tablet in Fully Kiosk mode. A Node.js backend handles data flow and logic, while Home Assistant communicates with physical devices.

I wanted a system I could use every day: stable and easy to operate on a touchscreen. That meant thinking about the whole solution, from the interface to integrations.

## When automations stop being simple

I initially used Node-RED. As the automations became too complex, I moved the logic into my own backend. I kept Home Assistant mainly as the device-communication layer.

This gives each part a clear responsibility: the interface is for operating the home, the backend holds my logic, and Home Assistant connects it to the hardware.

[architecture]

## Everyday use and maintenance

I designed the interface for a tablet and Fully Kiosk. It is part of a system I return to every day.

Tests, logs stored on a volume, and monitoring of backups and Zigbee network health support reliable operation. Maintenance is part of the project because automation issues directly affect using the home.

[media:1]

## The result: a system in active use and development

The system is actively used and I continue to develop it. The frontend and backend repositories are public. This is my main example of building a complete solution, from a React interface through data flow and logic to device integration.
