(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.removeQuickMessageFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.removeQuickMessageFactory = (0, utils_js_1.apiFactory)()((e, r, s) => {
  let a = s.makeURL(
    e.zpwServiceMap.quick_message[0] + "/api/quickmessage/delete",
  );
  return async function (e) {
    var e = Array.isArray(e) ? e : [e],
      e = s.encodeAES(JSON.stringify({ itemIds: e }));
    if (e)
      return (
        (e = await s.request(s.makeURL(a, { params: e }), { method: "GET" })),
        s.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
