(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.acceptFriendRequestFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.acceptFriendRequestFactory = (0, utils_js_1.apiFactory)()((e, r, a) => {
  let t = a.makeURL(e.zpwServiceMap.friend[0] + "/api/friend/accept");
  return async function (e) {
    var e = { fid: e, language: r.language },
      e = a.encodeAES(JSON.stringify(e));
    if (e)
      return (
        (e = await a.request(t, {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        a.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
