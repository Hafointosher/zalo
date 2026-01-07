(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getAllFriendsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getAllFriendsFactory = (0, utils_js_1.apiFactory)()((e, i, t) => {
  let a = t.makeURL(
    e.zpwServiceMap.profile[0] + "/api/social/friend/getfriends",
  );
  return async function (e = 2e4, r = 1) {
    var r = {
        incInvalid: 1,
        page: r,
        count: e,
        avatar_size: 120,
        actiontime: 0,
        imei: i.imei,
      },
      e = t.encodeAES(JSON.stringify(r));
    if (e)
      return (
        (r = await t.request(t.makeURL(a, { params: e }), { method: "GET" })),
        t.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
