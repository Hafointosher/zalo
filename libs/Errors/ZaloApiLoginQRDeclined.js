(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.ZaloApiLoginQRDeclined = void 0));
let ZaloApiError_js_1 = require("./ZaloApiError.js");
class ZaloApiLoginQRDeclined extends ZaloApiError_js_1.ZaloApiError {
  constructor(e = "Login QR request declined") {
    (super(e), (this.name = "ZaloApiLoginQRDeclined"));
  }
}
exports.ZaloApiLoginQRDeclined = ZaloApiLoginQRDeclined;
