/**
 * Request Form — guest inquiry form (RFP F-17).
 *
 * A simple contact/inquiry form for non-logged-in visitors: a message text area
 * and contact details. On submit it validates and shows a confirmation (demo
 * only — no backend submission is wired up).
 *
 * Optional authored content: the first cell is used as the page heading.
 * @param {Element} block
 */

function field({
  tag, name, label, type, placeholder, required,
}) {
  const wrap = document.createElement('div');
  wrap.className = 'request-form__field';

  const lbl = document.createElement('label');
  lbl.setAttribute('for', `rf-${name}`);
  lbl.innerHTML = `${label}${required ? ' <span class="request-form__req" aria-hidden="true">*</span>' : ''}`;

  let input;
  if (tag === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 5;
  } else {
    input = document.createElement('input');
    input.type = type || 'text';
  }
  input.id = `rf-${name}`;
  input.name = name;
  if (placeholder) input.placeholder = placeholder;
  if (required) input.required = true;

  wrap.append(lbl, input);
  return wrap;
}

export default function decorate(block) {
  const heading = block.textContent.trim();
  block.textContent = '';
  block.classList.add('request-form');

  const h1 = document.createElement('h1');
  h1.className = 'request-form__title';
  h1.textContent = heading || 'Request Form';
  block.append(h1);

  const intro = document.createElement('p');
  intro.className = 'request-form__intro';
  intro.textContent = 'Tell us what you need — describe your request and leave your contact details. Our team will get back to you.';
  block.append(intro);

  const form = document.createElement('form');
  form.className = 'request-form__form';
  form.noValidate = true;

  const message = field({
    tag: 'textarea', name: 'message', label: 'Your request', placeholder: 'Describe the products, quantities, application, and part numbers …', required: true,
  });
  message.classList.add('request-form__field--full');

  const name = field({
    tag: 'input', name: 'name', label: 'Name', required: true,
  });
  const company = field({
    tag: 'input', name: 'company', label: 'Company',
  });
  const email = field({
    tag: 'input', name: 'email', type: 'email', label: 'Email', required: true,
  });
  const phone = field({
    tag: 'input', name: 'phone', type: 'tel', label: 'Phone',
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'request-form__submit';
  submit.textContent = 'Send request';

  const status = document.createElement('p');
  status.className = 'request-form__status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  form.append(message, name, company, email, phone, submit, status);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const emailValue = (data.get('email') || '').toString().trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    const valid = form.checkValidity() && validEmail
      && (data.get('message') || '').toString().trim();

    if (!valid) {
      status.textContent = 'Please fill in the required fields (request, name, valid email).';
      status.className = 'request-form__status request-form__status--error';
      form.reportValidity();
      return;
    }

    // Demo only — no backend submission. In the live solution this posts a guest
    // inquiry (logged & routed per company; bot/DDoS-protected — RFP F-17-02).
    form.querySelectorAll('input, textarea, button').forEach((el) => { el.disabled = true; });
    status.textContent = 'Thank you! Your request has been received. Our team will contact you shortly.';
    status.className = 'request-form__status request-form__status--ok';
  });

  block.append(form);
}
