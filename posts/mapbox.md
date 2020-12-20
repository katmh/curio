---
title: Mapbox in (not much) depth
summary: "Understanding the concepts behind Mapbox and its JavaScript library specifically"
date: 2020-12-20
---

Last winter, I developed a website for the [Senseable City Lab](http://senseable.mit.edu/cityscanner/) that visualized spatial air quality data on a map and through graphs. My coworker and I explored a few different tools, including [CARTO](https://carto.com/) and Uber's [deck.gl](https://deck.gl), but ultimately settled on [Mapbox](https://www.mapbox.com/).

I wasn't aware at the time, but a ton of organizations use Mapbox, including tech companies, newsrooms, and [off-road navigation endurance races](https://www.youtube.com/watch?v=Ul49ZfYuhBs). I'm glad I learned it, but the process wasn't smooth. My vanilla JavaScript knowledge was lacking, so I filled in foundational gaps with [Javascript.info](https://javascript.info/).  [D3 in Depth](https://www.d3indepth.com/) clarified concepts like joins and scales in a way that made more sense to me than D3's official documentation.

These two resources were rather enlightening for me. It was like stumbling across a well-written book, with context and organization, after years of only being able to skim out-of-order excerpts. Everyone has their own preferred learning methods. I found these to be helpful for me, and I wished there had been something like them for Mapbox.

Well, this has been the equivalent of those cooking blogs telling a winding tale before sharing the recipe, so now I'll go into my brief attempt to recall and explain some Mapbox concepts that took a bit for me to get comfortable with.