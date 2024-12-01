/**
 * Permet de créer un élément html
 * @param {keyof HTMLElementTagNameMap} tag
 * @param {object} options
 *
 */
export const createEl = (tag, options = {}) => {
  const el = document.createElement(tag);

  for (const key in options) {
    if (key !== 'children' && key !== 'text') {
      el.setAttribute(key, options[key]);
    }
    if (key === 'children') {
      options[key].forEach((child) => el.appendChild(child));
    }
    if (key === 'text') {
      el.innerText = options[key];
    }
  }

  return el;
};
