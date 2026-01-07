(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getQuickMessageListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getQuickMessageListFactory = (0, utils_js_1.apiFactory)()((e, r, i) => {
  let s = i.makeURL(
    e.zpwServiceMap.quick_message[0] + "/api/quickmessage/list",
  );
  return async function () {
    var e = { version: 0, lang: 0, imei: r.imei },
      e = i.encodeAES(JSON.stringify(e));
    if (e)
      return (
        (e = await i.request(i.makeURL(s, { params: e }), { method: "GET" })),
        i.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
