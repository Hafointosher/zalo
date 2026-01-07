(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.ZaloApiError = void 0));
class ZaloApiError extends Error {
  constructor(r, o) {
    (super(r), (this.name = "ZcaApiError"), (this.code = o || null));
  }
}
exports.ZaloApiError = ZaloApiError;
