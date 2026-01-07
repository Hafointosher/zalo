(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.resetHiddenConversPinFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.resetHiddenConversPinFactory = (0, utils_js_1.apiFactory)()(
  (r, e, o) => {
    let s = o.makeURL(
      r.zpwServiceMap.conversation[0] + "/api/hiddenconvers/reset",
    );
    return async function () {
      var r = o.encodeAES(JSON.stringify({}));
      if (r)
        return (
          (r = await o.request(o.makeURL(s, { params: r }), { method: "GET" })),
          o.resolve(r)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
