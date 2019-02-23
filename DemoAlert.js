'use strict';

const $$templateElement = document.createElement('template');
$$templateElement.innerHTML = `
<style>
    .dm-alert__overlay {
        align-items: center;
        background-color: rgba(71, 95, 123, 0.1);
        bottom: 0;
        display: flex;
        left: 0;
        justify-content: center;
        position: absolute;
        right: 0;
        top: 0;
    }

    .dm-alert__container {
        align-items: center;
        background-color: #FFFFFF;
        border-radius: 4px;
        display: flex;
        height: 64px;
        min-width: 321px;
        overflow: hidden;
        width: auto;
    }

    .dm-alert__accent {
        align-items: center;
        background-color: #FF4A7A;
        display: flex;
        height: 100%;
        justify-content: center;
        width: 54px;
    }

    .dm-alert__message,
    .dm-alert__close-button {
        margin: 0 24px;
    }

    .dm-alert__message {
        flex-grow: 1;
    }

    .dm-alert__close-button {
        align-items: center;
        background-color: #FAFBFB;
        border-radius: 12px;
        border-style: none;
        cursor: pointer;
        display: flex;
        font-size: 0.9375em;
        height: 24px;
        justify-content: center;
        padding: 0;
        outline: none;
        width: 24px;
    }
</style>
<div class="dm-alert__overlay">
    <div class="dm-alert__container">
        <div class="dm-alert__accent">
            <svg class="dm-alert__accent__icon" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" width="22">
                <title>Warning</title>
                <path d="M9,11.5v-7a2,2,0,0,1,4,0v7a2,2,0,0,1-4,0Zm0,6H9a2,2,0,1,1,2,2A2,2,0,0,1,9,17.5Z" fill="#FFFFFF" fill-rule="evenodd"/>
            </svg>
        </div>
        <div class="dm-alert__message" id="dm-alert-message"></div>
        <button class="dm-alert__close-button" id="dm-alert-close-button">
            <svg height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" width="16">
                <title>Close</title>
                <path d="M17.34,6.08a1,1,0,0,0-1.42-1.42L11,9.59,6.08,4.66A1,1,0,0,0,4.66,6.08L9.59,11,4.66,15.92a1,1,0,0,0,1.42,1.42L11,12.41l4.92,4.93a1,1,0,0,0,1.42-1.42L12.41,11Z" fill="#40607e" fill-rule="evenodd"/>
            </svg>
        </button>
    </div>
</div>
`

class DemoAlert extends HTMLElement {

  constructor () {
    super();

    this.attachShadow({ mode: 'open' });

    const $$alertContentElement = document.importNode($$templateElement.content, true);

    this.shadowRoot.appendChild($$alertContentElement);

    this.hide = this.hide.bind(this);
  }

  connectedCallback () {
    const $$closeButtonElement = this.shadowRoot.querySelector('#dm-alert-close-button');

    this.style.display = 'none';

    $$closeButtonElement.addEventListener('click', this.hide);
  }

  disconnectedCallback () {
    const $$closeButtonElement = this.shadowRoot.querySelector('#dm-alert-close-button');

    $$closeButtonElement.removeEventListener('click', this.hide);
  }

  /**
   * Hides the component.
   */
  hide () {
    this.style.display = 'none';
    this.value = null;
  }

  /**
   * Shows the component.
   */
  show () {
    this.style.display = 'block';
  }

  /**
   * Shows the component and update the message.
   *
   * @argument {String} message
   */
  showWithNewMessage (message) {
    this.value = message;

    this.show();
  }

  set value (value) {
    const $$messageElement = this.shadowRoot.querySelector('#dm-alert-message');

    $$messageElement.textContent = value;
  }

}

window.customElements.define('dm-alert', DemoAlert);
