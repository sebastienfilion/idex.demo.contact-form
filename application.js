'use strict';

const SERVER_URL = 'http://127.0.0.1:9090';
const MAIN_STATE_NAME = 'ContactForm';
const PAGE_HASH_BY_STATE_NAME = {
  ContactForm: '',
  ContactFormSuccess: '#contact-form-success',
  Test: '#test'
};
const STATE_NAME_BY_PAGE_HASH = {
  '#contact-form-success': 'ContactFormSuccess',
  '#test': 'Test'
};
const REDIRECT_PAGE_HASH_LIST = ['#contact-form-success'];

/**
 * Handles a form submission.
 *
 * @argument $$event {Event}
 */
function handleFormOnSubmit ($$event) {
  const { target: $$formElement } = $$event;

  $$event.preventDefault();

  if (!$$formElement.checkValidity()) return;

  // $$formElement == $$formElement.children == [HTMLElement,...]
  // data = { fullName: "", email: "", message: "" }
  const data = Array.from($$formElement)
    .reduce((accumulator, $$element) => {
      if ($$element instanceof HTMLButtonElement || $$element.type == 'button') return accumulator;

      accumulator[$$element.name] = $$element.value;

      return accumulator;
    }, {});

  return fetch(`${SERVER_URL}/form`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

/**
 * Initializes the application base on the current hash.
 */
function initializeApplication () {
  const { hash } = new URL(window.location.href);
  const stateName = (hash == '') ? MAIN_STATE_NAME :
    (hash && REDIRECT_PAGE_HASH_LIST.includes(hash)) ?
      MAIN_STATE_NAME :
      STATE_NAME_BY_PAGE_HASH[hash];

  console.debug(`Initializing from "${stateName}".`, { hash });

  if (stateName === MAIN_STATE_NAME && hash !== '') window.history.pushState(null, null, window.location.pathname);

  initializeApplicationState(stateName);
}

/**
 * Initializes the application state given its name.
 *
 * @argument stateName {String}
 */
function initializeApplicationState (stateName, state = {}) {
  const $$containerElement = document.querySelector('#dm-container');

  removeAllChildrenOfElement($$containerElement);

  switch (stateName) {
    case 'ContactForm':
      initializeContactFormPage($$containerElement, state);
      break;
    case 'ContactFormSuccess':
      initializeContactFormSuccessPage($$containerElement, state);
      break;
    default:
      initializeErrorPage($$containerElement);
  }
}

/**
 * Initializes the contact form page.
 *
 * @argument $$containerElement {HTMLElement}
 */
function initializeContactFormPage ($$containerElement) {
  const $$templateElement = document.querySelector('#contact-form-page-template');
  const $$pageContentElement = document.importNode($$templateElement.content, true);

  $$containerElement.appendChild($$pageContentElement);

  const $$formElement = $$containerElement.querySelector('#dm-contact-form');
  const $$inputElementList = $$containerElement.querySelectorAll('.dm-form__input');

  $$formElement.addEventListener('submit', ($$event) => {
    handleFormOnSubmit($$event)
      .then(response => {
        const fullName = $$event.target[0].value;

        return response.json()
          .then(data => {
            if (response.status >= 300) throw new Error(data.error);
            else updateApplicationState('ContactFormSuccess', { fullName })
          });
      })
      .catch(($$error) => {
        console.error("Error occurred", $$error);
        showAlert(undefined, $$error.message);
      });
  });

  Array.from($$inputElementList)
    .forEach($$inputElement =>
      $$inputElement.addEventListener('change', ($$event) => {
        if (!$$inputElement.checkValidity()) $$inputElement.classList.add('--input-invalid');
        else $$inputElement.classList.remove('--input-invalid');
        $$inputElement.classList.add('--input-dirty');
      })
    );
}

/**
 * Initializes the contact form success page.
 *
 * @argument $$containerElement {HTMLElement}
 */
function initializeContactFormSuccessPage ($$containerElement, state = {}) {
  const $$templateElement = document.querySelector('#contact-form-success-page-template');
  const $$pageContentElement = document.importNode($$templateElement.content, true);

  $$containerElement.appendChild($$pageContentElement);

  const { fullName } = state;
  const [ firstName ] = fullName.split(' ');

  const $$firstNameSpanElement = document.querySelector('#dm-contact-form-success__text__firstName');

  $$firstNameSpanElement.textContent = firstName;

  const $$backButtonElement = $$containerElement.querySelector('#dm-contact-form-success__back-button');

  $$backButtonElement.addEventListener('click', ($$event) => window.history.back());
}

/**
 * Initializes the error page.
 *
 * @argument $$containerElement {HTMLElement}
 */
function initializeErrorPage ($$containerElement) {
  const $$templateElement = document.querySelector('#error-page-template');
  const $$pageContentElement = document.importNode($$templateElement.content, true);

  $$containerElement.appendChild($$pageContentElement);
}

function initializeTestPage ($$containerElement) {
  const $$templateElement = document.querySelector('#test-page-template');
  const $$pageContentElement = document.importNode($$templateElement.content, true);

  $$containerElement.appendChild($$pageContentElement);
}

/**
 * Removes all of the children of a given element.
 * @argument $$element {HTMLElement}
 */
function removeAllChildrenOfElement ($$element) {
  while ($$element.firstChild) {
    $$element.removeChild($$element.firstChild);
  }
}

/**
 * Attempts to show a given message using the custom alert component.
 * If the custom alert component can't be found, the message will be shown using `alert(message)`.
 *
 * @arguments message {String}
 */
function showAlert (message = "An error occurred. Try again.", errorMessage) {
  const $$demoAlertComponent = document.querySelector('dm-alert');

  if (!$$demoAlertComponent) window.alert(message);

  if (!!errorMessage) console.error(errorMessage);

  $$demoAlertComponent.showWithNewMessage(message);
}

/**
 * Updates the application state given its name.
 *
 * @argument stateName {String}
 */
function updateApplicationState (stateName, state = {}) {
  const pageHash = PAGE_HASH_BY_STATE_NAME[stateName];

  if (pageHash !== '') window.history.pushState(state, null, pageHash);
  else window.history.pushState(state, null, null);
  initializeApplicationState(stateName, state);
}

window.addEventListener('load', initializeApplication);

window.addEventListener('hashchange', initializeApplication);