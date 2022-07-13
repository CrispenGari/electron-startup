const Store = require("electron-store");

const store = new Store();

const getWindowSize = () => {
  if (store.has("size")) {
    return store.get("size");
  }
  store.set("size", [800, 600]);
  return [800, 600];
};
const setWindowSize = (size) => {
  store.set("size", size);
};

const getWindowPosition = () => {
  if (store.has("position")) {
    return store.get("position");
  }
  return undefined;
};
const setWindowPosition = (pos) => {
  return store.set("position", pos);
};

module.exports = {
  getWindowSize,
  setWindowSize,
  setWindowPosition,
  getWindowPosition,
};
