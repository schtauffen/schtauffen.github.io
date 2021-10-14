(function () {
  const IS_DARKMODE_KEY = "@@grawlix/is_darkmode";
  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const email = document.querySelector('#f_7990c819');
  const message = document.querySelector('#f_83850abb');

  window.addEventListener('load', () => {
    updateNavMenu();
    updateDarkMode();
    document.querySelector('.no-script').classList.remove('no-script');
    document.querySelector('#contactForm').onsubmit = onSubmitContactform;
    email.onkeyup = validateContactFormEmail;
    message.onkeyup = validateContactFormMessage;
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

  function validateContactFormEmail() {
    if (email.value) {
      email.classList.add('dirty')
    } else {
      email.classList.remove('dirty');
    }

    if (!EMAIL_REGEX.test(email.value)) {
      email.classList.add('invalid');
      return false
    } else {
      email.classList.remove('invalid');
      return true;
    }
  }

  function validateContactFormMessage() {
    if (message.value) {
      message.classList.add('dirty')
    } else {
      message.classList.remove('dirty');
    }

    if (message.value.trim().length < 5) {
      message.classList.add('invalid');
      return false;
    } else {
      message.classList.remove('invalid');
      return true;
    }
  }

  function validateContactForm() {
    let valid = true;

    const honeypot = document.querySelector('#email');
    const verification = document.querySelector('#f_139a63f4');

    if (honeypot.value || verification.value !== 'manymoonsofhappiness') {
      valid = false;
    }

    valid = validateContactFormEmail() && valid;
    valid = validateContactFormMessage() && valid;

    return valid;
  }

  function onSubmitContactform(_evt) {
    if (!validateContactForm()) {
      return false;
    }

    // validateAction('contactform', token => {
      // POST to submit endpoint
      // THEN if successful:
      email.value = '';
      email.classList.remove('dirty');
      message.value = '';
      message.classList.remove('dirty');
      // display "your message was submitted message"
      // after 8s, delete message
      // ELSE error message for 8s
    // });

    return false;
  }

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
