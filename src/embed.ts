/** Только высота содержимого; ответы и реквизиты родительской странице не передаются. */
export function initEmbed(root: HTMLElement): void {
  if (window.parent === window) return;
  document.documentElement.dataset.embedded = 'true';
  let lastHeight = 0;
  let frame = 0;
  const measure = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const style = getComputedStyle(document.body);
      const height = Math.ceil(root.getBoundingClientRect().height + parseFloat(style.paddingBottom));
      if (height > 0 && height !== lastHeight) {
        lastHeight = height;
        window.parent.postMessage({ type: 'checku:resize', version: 1, height }, '*');
      }
    });
  };
  new ResizeObserver(measure).observe(root);
  window.addEventListener('resize', measure);
  document.fonts.ready.then(measure);
  measure();
}
