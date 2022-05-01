const safeURL = (url) => {
  try {
    return new URL(url);
  } catch (_) {
    return {};
  }
};

export { safeURL };
