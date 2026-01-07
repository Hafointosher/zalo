(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getAutoDeleteChatFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getAutoDeleteChatFactory = (0, utils_js_1.apiFactory)()((e, r, t) => {
  let o = t.makeURL(
    e.zpwServiceMap.conversation[0] + "/api/conv/autodelete/getConvers",
  );
  return async function () {
    var e = t.encodeAES(JSON.stringify({}));
    if (e)
      return (
        (e = await t.request(t.makeURL(o, { params: e }), { method: "GET" })),
        t.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
