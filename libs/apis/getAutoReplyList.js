(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getAutoReplyListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getAutoReplyListFactory = (0, utils_js_1.apiFactory)()((r, e, t) => {
  let o = t.makeURL(r.zpwServiceMap.auto_reply[0] + "/api/autoreply/list");
  return async function () {
    var r = { version: 0, cliLang: e.language },
      r = t.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await t.request(t.makeURL(o, { params: r }), { method: "GET" })),
        t.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
