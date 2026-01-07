(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendFriendRequestFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.sendFriendRequestFactory = (0, utils_js_1.apiFactory)()((r, i, s) => {
  let a = s.makeURL(r.zpwServiceMap.friend[0] + "/api/friend/sendreq");
  return async function (r, e) {
    var r = {
        toid: e,
        msg: r,
        reqsrc: 30,
        imei: i.imei,
        language: i.language,
        srcParams: JSON.stringify({ uidTo: e }),
      },
      e = s.encodeAES(JSON.stringify(r));
    if (e)
      return (
        (r = await s.request(a, {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        s.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
