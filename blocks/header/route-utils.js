export function matchesPath(href, targetPath) {
  try {
    const getSegments = (value) => new URL(value, window.location.origin)
      .pathname.split('/').filter(Boolean);
    const hrefSegments = getSegments(href);
    const targetSegments = getSegments(targetPath);

    return targetSegments.length > 0
      && hrefSegments.slice(-targetSegments.length).every(
        (segment, index) => segment === targetSegments[index],
      );
  } catch {
    return false;
  }
}
