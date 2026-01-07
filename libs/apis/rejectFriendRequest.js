(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.rejectFriendRequestFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.rejectFriendRequestFactory = (0, utils_js_1.apiFactory)()((r, e, t) => {
  let i = t.makeURL(r.zpwServiceMap.friend[0] + "/api/friend/reject");
  return async function (r) {
    var r = t.encodeAES(JSON.stringify({ fid: r }));
    if (r)
      return (
        (r = await t.request(i, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        t.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
