(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteAutoReplyFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.deleteAutoReplyFactory = (0, utils_js_1.apiFactory)()((e, r, t) => {
  let a = t.makeURL(e.zpwServiceMap.auto_reply[0] + "/api/autoreply/delete");
  return async function (e) {
    var e = { cliLang: r.language, id: e },
      e = t.encodeAES(JSON.stringify(e));
    if (e)
      return (
        (e = await t.request(a, {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        t.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
