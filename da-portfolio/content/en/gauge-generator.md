## Why revisit a tool from 2019?

I wrote the first Gauge Generator in C# as a desktop tool for designing gauge faces. I wanted to bring it to the browser: no installation, a more convenient interface and more flexibility when working with files. It was also an opportunity to use the AI-assisted workflow I had developed across three commercial projects.

## Small stages with a clear definition of done

The migration involved more than asking AI to rewrite an application. I read the original code and used it to write detailed feature specifications. I divided the plan into small stages, each with its own definition of done, so I could check features incrementally without overloading the AI context window.

Between stages, I reviewed the code myself. I checked the architecture and whether the implementation matched my intentions, then fed what I learned into the next specifications. AI took part throughout development; direction, planning and reviewing the solution remained my responsibility.

## An editor built around designing a gauge face

A React interface replaced the ageing desktop UI. I added interactive elements and undo/redo. Layers and a live preview make it possible to work on the composition and immediately see the effect of changes.

[media:1]

## The result: a browser and an open format

The application runs without installation and uses an open data format. The first version exported only PNG; the new one also exports SVG and PDF. Both the working editor and its documentation are publicly available.

For me, the key change was bringing an existing tool of my own to an environment where it is easier to run and develop further. AI helped do the work, while detailed specifications and my own code reviews kept me in control of the result.
