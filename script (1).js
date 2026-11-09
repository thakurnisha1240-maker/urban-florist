/* Urban Bloom Florist - Assignment 2b final JavaScript
   Each feature is its own function and only runs if its elements exist on the page.
   Features:
   1. Mobile navigation menu            (all pages)
   2. Flower filter, sort and count      (flowers.html)
   3. Enquiry form validation + prefill  (contact.html)
   4. FAQ accordion                      (services.html)
   5. Delivery suburb checker            (services.html)
   6. Open now / Closed badge            (index.html, contact.html)
   No external libraries or frameworks are used. */
'use strict';

// Tells the CSS that JavaScript is running (menu is only collapsed when JS works).
document.documentElement.classList.add('js');

/* ---------- 1. Mobile navigation ---------- */
function initNavToggle() {
  const button = document.querySelector('.nav-toggle');
  const menu = document.getElementById('site-nav');
  if (!button || !menu) return;

  function setOpen(isOpen) {
    menu.classList.toggle('open', isOpen);
    button.setAttribute('aria-expanded', String(isOpen));
  }
  button.addEventListener('click', function () {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });
  // Keyboard users can press Escape to close the menu.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
}

/* ---------- 2. Flower filter + sort ---------- */
function initFlowerFilter() {
  const grid = document.getElementById('products');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.product'));
  const buttons = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort');
  const countText = document.getElementById('resultCount');
  const emptyText = document.getElementById('noResults');
  let currentCategory = 'All';

  function sortCards(list, method) {
    return list.slice().sort(function (a, b) {
      if (method === 'low') return Number(a.dataset.price) - Number(b.dataset.price);
      if (method === 'high') return Number(b.dataset.price) - Number(a.dataset.price);
      if (method === 'name') return a.dataset.name.localeCompare(b.dataset.name);
      return Number(a.dataset.order) - Number(b.dataset.order); // featured
    });
  }

  function update() {
    let shown = 0;
    sortCards(cards, sortSelect.value).forEach(function (card) {
      grid.appendChild(card); // re-appending moves the card into sorted position
      const matches = currentCategory === 'All' || card.dataset.category === currentCategory;
      card.hidden = !matches;
      if (matches) shown++;
    });
    countText.textContent = 'Showing ' + shown + ' of ' + cards.length + ' flowers';
    emptyText.hidden = shown !== 0;
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      currentCategory = button.dataset.category;
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === button));
      });
      update();
    });
  });
  sortSelect.addEventListener('change', update);
}

/* ---------- 3. Enquiry form: validation, prefill, summary ---------- */
function initContactForm() {
  const form = document.getElementById('enquiry');
  if (!form) return;

  // One rule per required field. Each returns an error message, or '' if the value is fine.
  const rules = {
    name: function (value) {
      return value.trim().length < 2 ? 'Please enter your name (at least 2 characters).' : '';
    },
    email: function (value) {
      const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
      return looksValid ? '' : 'Please enter a valid email address, e.g. name@example.com.';
    },
    message: function (value) {
      return value.trim().length < 10 ? 'Please write at least 10 characters so we can help you.' : '';
    }
  };

  function validateField(field) {
    const error = rules[field.name](field.value);
    document.getElementById(field.id + '-error').textContent = error;
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    return error === '';
  }

  const fields = Object.keys(rules).map(function (name) { return form.elements[name]; });

  // Validate a field when the user leaves it, and clear its error once it is fixed.
  fields.forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  // Live character counter for the message box.
  const message = form.elements.message;
  const counter = document.getElementById('messageCount');
  message.addEventListener('input', function () {
    counter.textContent = message.value.length + ' / ' + message.maxLength;
  });

  // Prefill from links such as contact.html?bouquet=Soft+Blush
  // Only values that already exist in the dropdown are accepted (safe against bad input).
  const params = new URLSearchParams(window.location.search);
  ['bouquet', 'occasion'].forEach(function (key) {
    const wanted = params.get(key);
    const select = form.elements[key];
    if (wanted && select) {
      Array.from(select.options).forEach(function (option) {
        if (option.value === wanted) select.value = wanted;
      });
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const status = document.getElementById('formMessage');
    status.textContent = '';

    const results = fields.map(validateField);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus(); // move focus to the first problem
      return;
    }

    // Build the confirmation with textContent (not innerHTML) so typed text cannot inject HTML.
    const thanks = document.createElement('p');
    thanks.textContent = 'Thank you, ' + form.elements.name.value.trim() +
      '! Your details are valid. This demo does not send an email.';
    const summary = document.createElement('p');
    summary.className = 'form-summary';
    summary.textContent = 'Enquiry summary: ' + form.elements.occasion.value +
      ' | Bouquet: ' + form.elements.bouquet.value;
    status.replaceChildren(thanks, summary);

    form.reset();
    counter.textContent = '0 / ' + message.maxLength;
  });
}

/* ---------- 4. FAQ accordion ---------- */
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(function (button) {
    button.addEventListener('click', function () {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(willOpen));
      panel.hidden = !willOpen;
    });
  });
}

/* ---------- 5. Delivery suburb checker ---------- */
function initDeliveryChecker() {
  const form = document.getElementById('deliveryForm');
  if (!form) return;

  const suburbs = ['central auckland', 'auckland cbd', 'ponsonby', 'grey lynn',
    'parnell', 'newmarket', 'mount eden', 'epsom', 'remuera'];

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const input = document.getElementById('suburb');
    const result = document.getElementById('deliveryResult');
    const entered = input.value.trim().toLowerCase().replace(/\bmt\b/, 'mount');

    if (entered === '') {
      result.textContent = 'Please type a suburb name.';
    } else if (suburbs.includes(entered)) {
      result.textContent = 'Good news – we deliver to ' + input.value.trim() +
        '. Delivery cost depends on location, so please enquire.';
    } else {
      result.textContent = 'Sorry, we do not list ' + input.value.trim() +
        ' as a delivery area. Please contact us and we will see what we can do.';
    }
  });
}

/* ---------- 6. Open now / Closed badge (uses Auckland time) ---------- */
function initOpenStatus() {
  const badges = document.querySelectorAll('[data-open-status]');
  if (badges.length === 0) return;

  // Opening hours in minutes after midnight: [open, close]. Sunday is closed (null).
  const weekdayHours = [510, 1050];           // 8:30am - 5:30pm
  const hours = { Mon: weekdayHours, Tue: weekdayHours, Wed: weekdayHours, Thu: weekdayHours,
    Fri: weekdayHours, Sat: [540, 900], Sun: null };   // Saturday 9am - 3pm

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Pacific/Auckland', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
  }).formatToParts(new Date());
  function part(type) { return parts.find(function (p) { return p.type === type; }).value; }

  const today = hours[part('weekday')];
  const minutes = Number(part('hour')) * 60 + Number(part('minute'));
  const isOpen = Boolean(today) && minutes >= today[0] && minutes < today[1];

  badges.forEach(function (badge) {
    badge.textContent = isOpen ? '● Open now' : '● Closed right now';
    badge.classList.add(isOpen ? 'open' : 'closed');
  });
}

/* ---------- Start everything ---------- */
initNavToggle();
initFlowerFilter();
initContactForm();
initFaq();
initDeliveryChecker();
initOpenStatus();
