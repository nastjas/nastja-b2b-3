/**
 * Hero block.
 *
 * For the MS "welcome" variant the authored image sits inside the same cell as
 * the text. To use it as a full-bleed background behind a readable text panel,
 * move the picture out to be a direct child of the block (so a positioned text
 * panel doesn't become the picture's containing block and shrink it).
 *
 * @param {Element} block
 */
export default function decorate(block) {
  if (!block.classList.contains('welcome')) return;

  const picture = block.querySelector('picture');
  if (!picture) return;

  const wrappingP = picture.closest('p');
  block.prepend(picture);
  if (wrappingP && !wrappingP.textContent.trim() && !wrappingP.querySelector('img, picture')) {
    wrappingP.remove();
  }
}
