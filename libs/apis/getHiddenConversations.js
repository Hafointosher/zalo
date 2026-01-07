(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getHiddenConversationsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getHiddenConversationsFactory = (0, utils_js_1.apiFactory)()(
  (e, r, o) => {
    let i = o.makeURL(
      e.zpwServiceMap.conversation[0] + "/api/hiddenconvers/get-all",
    );
    return async function () {
      var e = { imei: r.imei },
        e = o.encodeAES(JSON.stringify(e));
      if (e)
        return (
          (e = await o.request(o.makeURL(i, { params: e }), { method: "GET" })),
          o.resolve(e)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
