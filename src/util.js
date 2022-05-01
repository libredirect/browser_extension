const safeURL = (url) => {
  try {
    return new URL(url);
  } catch (_) {
    return {};
  }
};

const toString = (target) => Object.prototype.toString.call(target);

const isURL = (url) => toString(url) === "[object URL]";

export {
  safeURL,
  isURL,
};
