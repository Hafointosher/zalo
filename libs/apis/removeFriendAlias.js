(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.removeFriendAliasFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.removeFriendAliasFactory = (0, utils_js_1.apiFactory)()((r, e, a) => {
  let i = a.makeURL(r.zpwServiceMap.alias[0] + "/api/alias/remove");
  return async function (r) {
    var r = a.encodeAES(JSON.stringify({ friendId: r }));
    if (r)
      return (
        (r = await a.request(a.makeURL(i, { params: r }), { method: "GET" })),
        a.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
