import { Messenger } from './messenger.js';
import { createWindow } from './utils.js';

const screen1 = createWindow().createScreen();
const screen2 = createWindow().createScreen();
const m1 = new Messenger(1);
const m2 = new Messenger(2);
screen1.setPage(m1.element);
screen2.setPage(m2.element);

m1.onFormSubmit(() => m1.send(m2));
m2.onFormSubmit(() => m2.send(m1));

m1.onWriting(() => m2.write());
m2.onWriting(() => m1.write());
