(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.ZaloApiMissingImageMetadataGetter = void 0));
let ZaloApiError_js_1 = require("./ZaloApiError.js");
class ZaloApiMissingImageMetadataGetter extends ZaloApiError_js_1.ZaloApiError {
  constructor() {
    (super(
      "Missing `imageMetadataGetter`. Please provide it in the Zalo object options.",
    ),
      (this.name = "ZaloApiMissingImageMetadataGetter"));
  }
}
exports.ZaloApiMissingImageMetadataGetter = ZaloApiMissingImageMetadataGetter;
