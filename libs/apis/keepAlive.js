(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.keepAliveFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.keepAliveFactory = (0, utils_js_1.apiFactory)()((e, r, i) => {
  let o = i.makeURL(e.zpwServiceMap.chat[0] + "/keepalive");
  return async function () {
    var e = { imei: r.imei },
      e = i.encodeAES(JSON.stringify(e));
    if (e)
      return (
        (e = await i.request(i.makeURL(o, { params: e }), { method: "GET" })),
        i.resolve(e, void 0, !1)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
