(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.MAX_MESSAGES_PER_SEND = exports.createContext = void 0),
  (exports.isContextSession = isContextSession));
let _5_MINUTES = 3e5;
class CallbacksMap extends Map {
  set(e, t, s = _5_MINUTES) {
    return (
      setTimeout(() => {
        this.delete(e);
      }, s),
      super.set(e, t)
    );
  }
}
let createContext = (e = 30, t = 658) => ({
  API_TYPE: e,
  API_VERSION: t,
  uploadCallbacks: new CallbacksMap(),
  options: {
    selfListen: !1,
    checkUpdate: !0,
    logging: !0,
    polyfill: global.fetch,
  },
  secretKey: null,
});
function isContextSession(e) {
  return !!e.secretKey;
}
((exports.createContext = createContext), (exports.MAX_MESSAGES_PER_SEND = 50));
