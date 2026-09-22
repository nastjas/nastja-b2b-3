/**
 * Hero Carousel
 *
 * A full-bleed hero slider for the homepage. Each slide can be an **image** or a
 * **video** (MP4 or YouTube), with a readable text panel (eyebrow / headline /
 * copy / CTA) — same visual language as the single `hero welcome` block.
 *
 * ── Authored structure (one slide per row) ──────────────────────────────────
 *   <div class="hero-carousel">
 *     <div>                          ← slide
 *       <div>
 *         <picture><img …></picture> ← background media (image, or poster for video)
 *         <a href="…mp4 | youtube">Video</a>  ← OPTIONAL: makes it a video slide
 *         <p>Eyebrow</p>
 *         <h2>Headline</h2>
 *         <p>Copy…</p>
 *         <p><a href="/…">Call to action</a></p>
 *       </div>
 *     </div>
 *     … more slides …
 *   </div>
 *
 * Image slides auto-advance after ROTATE_MS. A video slide plays once, then
 * advances when the video ends (fallback after VIDEO_MAX_MS).
 *
 * @param {Element} block
 */

const ROTATE_MS = 6000;
const VIDEO_MAX_MS = 20000;

function isVideoHref(href) {
  return /\.(mp4|webm)(\?|$)/i.test(href) || /youtube\.com|youtu\.be/i.test(href);
}

function youTubeId(href) {
  const m = href.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/i);
  return m ? m[1] : null;
}

function buildMedia(slideEl) {
  const media = document.createElement('div');
  media.className = 'hero-carousel__media';

  const picture = slideEl.querySelector('picture');
  const img = slideEl.querySelector('img');
  const videoLink = [...slideEl.querySelectorAll('a')].find((a) => isVideoHref(a.getAttribute('href') || ''));

  if (videoLink) {
    const href = videoLink.getAttribute('href');
    const ytId = youTubeId(href);
    if (ytId) {
      const iframe = document.createElement('iframe');
      iframe.className = 'hero-carousel__video';
      iframe.title = 'Video';
      iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      iframe.setAttribute('frameborder', '0');
      iframe.dataset.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&modestbranding=1&rel=0&playsinline=1`;
      media.appendChild(iframe);
      media.dataset.video = 'youtube';
    } else {
      const video = document.createElement('video');
      video.className = 'hero-carousel__video';
      video.muted = true;
      video.setAttribute('muted', '');
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.preload = 'none';
      if (img?.src) video.poster = img.src;
      video.dataset.src = href;
      media.appendChild(video);
      media.dataset.video = 'file';
    }
    videoLink.remove();
    if (picture) picture.remove();
  } else if (picture) {
    media.appendChild(picture);
  } else if (img) {
    media.appendChild(img);
  }
  return media;
}

function buildPanel(slideEl) {
  const panel = document.createElement('div');
  panel.className = 'hero-carousel__panel';
  // Remaining children (text + CTAs) become the overlay content, in order.
  // Skip empty paragraphs left behind after the media/video was extracted.
  [...slideEl.querySelectorAll('p, h1, h2, h3, h4, h5, h6')].forEach((el) => {
    if (el.textContent.trim() === '' && !el.querySelector('a, img, picture')) return;
    panel.appendChild(el);
  });
  return panel;
}

export default function decorate(block) {
  const slidesSource = [...block.children];
  block.textContent = '';
  block.classList.add('hero-carousel');

  const track = document.createElement('div');
  track.className = 'hero-carousel__track';

  const slides = slidesSource.map((row, i) => {
    const cell = row.querySelector(':scope > div') || row;
    const slide = document.createElement('div');
    slide.className = 'hero-carousel__slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    if (i === 0) slide.classList.add('is-active');
    slide.appendChild(buildMedia(cell));
    const inner = document.createElement('div');
    inner.className = 'hero-carousel__inner';
    inner.appendChild(buildPanel(cell));
    slide.appendChild(inner);
    track.appendChild(slide);
    return slide;
  });

  block.appendChild(track);

  if (slides.length <= 1) return;

  /* Controls */
  const controls = document.createElement('div');
  controls.className = 'hero-carousel__controls';
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-carousel__dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    controls.appendChild(dot);
    return dot;
  });
  block.appendChild(controls);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'hero-carousel__arrow hero-carousel__arrow--prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'hero-carousel__arrow hero-carousel__arrow--next';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
  block.append(prev, next);

  let current = 0;
  let timer = null;

  const currentDelay = () => {
    const media = slides[current].querySelector('.hero-carousel__media');
    return media?.dataset.video ? VIDEO_MAX_MS : ROTATE_MS;
  };

  const stopVideos = () => {
    block.querySelectorAll('video.hero-carousel__video').forEach((v) => {
      try { v.pause(); v.currentTime = 0; } catch { /* noop */ }
    });
    block.querySelectorAll('iframe.hero-carousel__video').forEach((f) => {
      if (f.src) f.src = '';
    });
  };

  const schedule = (ms) => {
    clearTimeout(timer);
    timer = setTimeout(() => goTo(current + 1), ms);
  };

  function goTo(index) {
    const nextIndex = (index + slides.length) % slides.length;
    stopVideos();
    slides.forEach((s, i) => s.classList.toggle('is-active', i === nextIndex));
    dots.forEach((d, i) => d.setAttribute('aria-current', i === nextIndex ? 'true' : 'false'));
    current = nextIndex;

    const media = slides[current].querySelector('.hero-carousel__media');
    const kind = media?.dataset.video;
    if (kind === 'file') {
      const v = media.querySelector('video');
      if (v && !v.src && v.dataset.src) v.src = v.dataset.src;
      const advance = () => goTo(current + 1);
      v?.play?.().catch(() => {});
      v?.addEventListener('ended', advance, { once: true });
      schedule(VIDEO_MAX_MS);
    } else if (kind === 'youtube') {
      const f = media.querySelector('iframe');
      if (f && !f.src && f.dataset.src) f.src = f.dataset.src;
      schedule(VIDEO_MAX_MS);
    } else {
      schedule(ROTATE_MS);
    }
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  block.addEventListener('mouseenter', () => clearTimeout(timer));
  block.addEventListener('mouseleave', () => schedule(currentDelay()));

  /* Kick off */
  goTo(0);
}
