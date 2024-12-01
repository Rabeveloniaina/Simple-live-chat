import { createEl } from './dom.js';

/**
 * Permet de créer un window
 * @param {boolean} render
 * @returns
 */
export const createWindow = (render = true) => {
  const win = createEl('div', {
    class: 'window',
  });

  if (render) document.body.appendChild(win);
  return {
    window: win,
    createScreen: () => createScreen(win),
  };
};

/**
 * Permet de créer un écran dans un window
 * @param {HTMLElement} window
 */
const createScreen = (window) => {
  const srn = createEl('div', { class: 'screen' });
  window.appendChild(srn);

  /**
   * @param {HTMLElement} page
   */
  const setPage = (page) => {
    srn.innerHTML = '';
    srn.appendChild(page);
  };

  return {
    screen: srn,
    setPage,
  };
};
