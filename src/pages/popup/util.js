const setEventListener = (target, type, listener) =>
  target.addEventListener(type, listener);

const setHandler = (event) => {
  const { id, type, listener } = event;
  const element = document.getElementById(id);
  if (element) setEventListener(element, type, listener);
  return element;
};

const EMPTY = "";
const CHARS = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

const isUpperChar = (c) => CHARS.has(c);

const toLowerKebab = (s) => isUpperChar(s) ? `-${s}`.toLowerCase() : s;

const toKebabCase = (s) => {
  const chars = s.split(EMPTY);
  return chars.map(toLowerKebab).join(EMPTY);
};

export {
  setHandler,
  toKebabCase,
};
