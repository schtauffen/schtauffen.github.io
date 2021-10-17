(function () {
  const IS_DARKMODE_KEY = "@@grawlix/is_darkmode";
  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const WORKER_URL = "http://127.0.0.1:8787";

  const form = document.querySelector('#contactForm');
  const email = document.querySelector('#f_7990c819');
  const message = document.querySelector('#f_83850abb');
  const submit = document.querySelector('.form__submit');

  window.addEventListener('load', () => {
    updateNavMenu();
    updateDarkMode();
    document.querySelector('.no-script').classList.remove('no-script');
    form.onsubmit = onSubmitContactform;
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

  const submitBar = document.querySelector('.form__submitBar');
  const submitMessageTemplate = document.createElement('template');
  submitMessageTemplate.innerHTML = '<div class="form__submitMessage fade"></div>';

  function displayMessage(message, isError = false) {
    const el = submitMessageTemplate.content.querySelector('.form__submitMessage').cloneNode();
    if (isError) {
      el.classList.add('error');
    }
    el.textContent = message;
    submitBar.appendChild(el);
    requestAnimationFrame(() => { el.classList.remove('fade'); });
    setTimeout(() => { el.classList.add('fade'); }, 4000);
    setTimeout(() => { submitBar.removeChild(el); }, 4200);
  }

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

    const formData = new FormData(form);
    // validateAction('contactform', token => {
    submit.disabled = true;
    email.disabled = true;
    message.disabled = true;

    fetch(`${WORKER_URL}/inquiry`, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    }).then(response => new Promise(resolve => setTimeout(() => resolve(response), 2000))).then(response => {
      if (response.ok) {
        email.value = '';
        email.classList.remove('dirty');
        message.value = '';
        message.classList.remove('dirty');
        displayMessage('Form submitted.');
      } else {
        displayMessage('Failed to submit form.', true);
      }
    }).catch(() => {
      displayMessage('Network failure. Try again soon.', true);
    }).finally(() => {
      submit.disabled = false;
      email.disabled = false;
      message.disabled = false;
    });
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
