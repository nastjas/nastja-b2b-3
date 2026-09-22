# Hero Carousel

Full-bleed hero slider for the homepage. Each slide is an **image** or a **video**
(MP4 or YouTube) with a readable text panel (eyebrow / headline / copy / CTA) —
same look as the single `hero welcome` block.

## Authoring (one slide per row)

Add a **Hero Carousel** block; each row is a slide:

- **Media:** an image (becomes the full-bleed background). For a video slide, add
  a link whose URL ends in `.mp4`/`.webm` or points to YouTube — the image then
  acts as the video poster.
- **Text:** an eyebrow paragraph, a heading (`h2`), a copy paragraph, and a CTA
  link — rendered in the dark overlay panel.

Example row cell:
```
<picture><img src="…/banner.jpg"></picture>
<a href="…/clip.mp4">Video</a>        ← optional → makes it a video slide
Welcome to Motorservice               ← eyebrow (first paragraph)
## Your Expert for Engine Components  ← headline
Premium components …                  ← copy
[Discover products](/thermal-management)  ← CTA
```

## Behaviour

- Image slides auto-advance after `ROTATE_MS` (6 s).
- A video slide plays once (muted, inline) and advances on `ended` (fallback
  `VIDEO_MAX_MS`, 20 s).
- Prev/next arrows + dots; auto-rotation pauses on hover.

## Notes

- Dependency-free vanilla JS.
- Cross-origin MP4 URLs work directly via the `<video>` element.
