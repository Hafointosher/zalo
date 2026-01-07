(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.changeFriendAliasFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.changeFriendAliasFactory = (0, utils_js_1.apiFactory)()((r, a, i) => {
  let s = i.makeURL(r.zpwServiceMap.alias[0] + "/api/alias/update");
  return async function (r, e) {
    var e = { friendId: e, alias: r, imei: a.imei },
      r = i.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await i.request(i.makeURL(s, { params: r }), { method: "GET" })),
        i.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
