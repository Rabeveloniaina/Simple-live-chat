import { createEl } from './dom.js';
import { chatStore } from './storage.js';

export class Messenger {
  writingElement = null;
  #form = null;
  #title = '';
  constructor(id, title = 'Anonymous') {
    this.id = id;
    this.#title = title;
    this.element = createEl('div', {
      class: 'messenger',
    });
    this.#writeSelf();
    this.container = this.element.querySelector('.messages_container');
    this.#form = this.element.querySelector('form');
    this.reload();
  }

  #writeSelf() {
    this.element.innerHTML = `
      <div class="chat_header">
        <img
          src="./src/img/oli.png"
          alt="profile pictures"
          class="profile-pic" />
        <h3>${this.#title}</h3>
      </div>
      <div class="messages_container"></div>
      <form class="message_form">
        <input
          type="text"
          name="msg"
          placeholder="Ecrivez votre message..." />
        <button type="submit">Envoyer</button>
      </form>`;
  }

  onFormSubmit(callback) {
    this.#form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = new FormData(this.#form).get('msg').toString();
      if (msg) {
        this.lastMsg = msg;
        this.#form.reset();
      }
      callback();
    });
  }

  onWriting(callback) {
    const field = this.#form.querySelector('input');
    field.addEventListener('keyup', (e) => {
      if (e.key !== 'Enter') callback();
      else {
        field.blur();
        field.focus();
      }
    });

    field.addEventListener('blur', (e) => {
      this.removeWritingEl();
    });

    field.addEventListener('focus', (e) => callback());
  }

  removeWritingEl() {
    const els = Array.from(document.querySelectorAll('.writingGuest'));
    if (els.length > 0) els.forEach((el) => el.remove());
    this.writingElement = null;
  }

  /**
   * Permet d'envoyer un message
   * @param {Messenger} to
   * @param {string} text
   */
  send(to) {
    // S'il n'y as pas le 'lastMsg' on return
    if (!this.lastMsg) return;
    if (to.writingElement) to.writingElement = null;
    // Envoyer le message
    if (chatStore.sendMessage(this.id, this.lastMsg)) {
      this.reload();
      to.reload();
    }
    to.removeWritingEl();
    this.lastMsg = '';
    to.lastMsg = '';
  }

  /**
   * Envoyer un status entrain d'écrire...
   */
  write() {
    if (this.writingElement) {
      if (document.querySelector('.writingGuest')) return;
    }

    this.writingElement = createEl('div', {
      class: 'message guest writingGuest',
    });

    this.writingElement.innerHTML = `<img
      src="./src/img/oli.png"
      alt="profile pictures"
      class="profile-pic" />
    <div class="message_text"><span></span><span></span><span></span></div>`;

    // On place le writingElement dans le dom
    this.container.childElementCount > 0
      ? this.container.children.item(0).before(this.writingElement)
      : this.container.appendChild(this.writingElement);
  }

  reload() {
    const data = chatStore.getData();
    this.container.innerHTML = '';
    data.forEach((message, k) => {
      if (
        data[k - 1] &&
        (data[k - 1].time - message.time) / 60 < 3000 &&
        data[k - 1].m_id === message.m_id
      ) {
        const lastContainer = this.container
          .querySelector('.message:last-child')
          .querySelector('.container');
        this.#createMessage(message.text, lastContainer);
      } else {
        const el = this.#createMessageContainer();
        this.#createMessage(message.text, el.container);
        message.m_id === this.id
          ? el.message.classList.add('user')
          : el.message.classList.add('guest');
        this.container.appendChild(el.message);
        if (el.message.classList.contains('guest')) {
          el.container.before(
            createEl('img', {
              class: 'profile-pic',
              src: './src/img/oli.png',
            })
          );
        }
      }
    });
  }

  #createMessageContainer() {
    const message_container = createEl('div', {
      class: 'container',
    });
    const messageEl = createEl('div', {
      class: 'message',
      children: [message_container],
    });
    return {
      message: messageEl,
      container: message_container,
    };
  }
  /**
   *
   * @param {string} value
   * @param {HTMLElement |null} parent
   * @returns
   */
  #createMessage = (value, parent = null) => {
    const txt = createEl('p', { class: 'message_text', text: value });
    if (parent) {
      parent.childNodes.length === 0
        ? parent.appendChild(txt)
        : parent.childNodes[0].before(txt);
    }
    return txt;
  };
}
