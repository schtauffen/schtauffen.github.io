(function () {
  const IS_DARKMODE_KEY = "@@grawlix/is_darkmode";

  window.addEventListener('load', () => {
    updateNavMenu();
    updateDarkMode();
    document.body.style.opacity = 1
  })

  const progress = document.querySelector('#progress')
  const main = document.querySelector('main')
  main.addEventListener('scroll', updateProgress)
  main.dispatchEvent(new Event('scroll'))

  const navMenu = document.querySelector('#site-nav');
  navMenu.addEventListener('click', updateNavMenu);

  const darkModeToggle = document.querySelector('#dark-mode');
  darkModeToggle.addEventListener('click', toggleDarkMode);


  function updateProgress (evt) {
    const { target } = evt
    const { scrollTop, clientHeight, scrollHeight } = target
    const position = (clientHeight + scrollTop) / scrollHeight
    const width = 100 * bound(0, 1, position)
    progress.style.width = `${width}%`
  }

  function updateNavMenu () {
    requestAnimationFrame(() => {
      navMenu.querySelectorAll('a').forEach(link => {
        if (link.hash === location.hash) {
          link.classList.add('active');
        } else if (link.hash === '#about' && !location.hash) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    });
  }

  function bound (min, max, value) {
    return Math.max(min, Math.min(max, value))
  }

  function getLocalStorageValue(name, def) {
    let result;
    try {
      result = JSON.parse(localStorage.getItem(name));
      if (result == null) {
        result = def;
      }
    } catch {
      result = def;
    }
    return result;
  }

  function setLocalStorageValue(name, value) {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch {
    }
  }

  function toggleDarkMode() {
    const isDarkMode = getLocalStorageValue(IS_DARKMODE_KEY, getDefaultDarkMode);
    setLocalStorageValue(IS_DARKMODE_KEY, !isDarkMode);
    updateDarkMode();
  }

  function getDefaultDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? true
      : false;
  }

  function updateDarkMode() {
    const html = document.querySelector('html');
    const isDarkmode = getLocalStorageValue(IS_DARKMODE_KEY, getDefaultDarkMode);
    if (isDarkmode) {
      html.classList.add('dark');
      darkModeToggle.checked = true;
    } else {
      html.classList.remove('dark');
      darkModeToggle.checked = false;
    }
  }
}())
