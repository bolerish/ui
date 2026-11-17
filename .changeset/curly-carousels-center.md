---
"@bolerish/ui": major
---

CarouselContent now creates its viewport internally. Remove CarouselViewport wrappers and imports; place CarouselItem children directly inside CarouselContent. CarouselContent props and styles continue to target the moving slide track. CarouselViewport is no longer exported. Move any custom viewport styling to an app-owned wrapper as appropriate.

Carousel controls now center using their rendered dimensions in horizontal and vertical layouts.
