!function() {
  window.addEventListener('load', () => {
    document.body.style.opacity = 1;
  });

  const progress = document.querySelector('#progress');
  const main = document.querySelector('main');

  main.addEventListener('scroll', updateProgress)
  main.dispatchEvent(new Event('scroll'));

  function updateProgress(evt) {
    const { target } = evt;
    const { scrollTop, clientHeight, scrollHeight } = target;
    const position = (clientHeight + scrollTop) / scrollHeight; 
    const width = 100 * bound(0, 1, position);
    progress.style.width = `${width}%`;
  }

  function bound(min, max, value) {
    return Math.max(min, Math.min(max, value));
  }
}();
