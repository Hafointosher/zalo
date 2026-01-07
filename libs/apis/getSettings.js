(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getSettingsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getSettingsFactory = (0, utils_js_1.apiFactory)()((r, e, t) => {
  let o = t.makeURL("https://wpa.chat.zalo.me/api/setting/me");
  return async function () {
    var r = t.encodeAES(JSON.stringify({}));
    if (r)
      return (
        (r = await t.request(t.makeURL(o, { params: r }), { method: "GET" })),
        t.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
