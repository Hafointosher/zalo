(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.ZaloApiLoginQRAborted = void 0));
let ZaloApiError_js_1 = require("./ZaloApiError.js");
class ZaloApiLoginQRAborted extends ZaloApiError_js_1.ZaloApiError {
  constructor(o = "Operation aborted") {
    (super(o), (this.name = "ZaloApiLoginQRAborted"));
  }
}
exports.ZaloApiLoginQRAborted = ZaloApiLoginQRAborted;
