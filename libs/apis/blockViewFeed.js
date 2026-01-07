(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.blockViewFeedFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.blockViewFeedFactory = (0, utils_js_1.apiFactory)()((e, i, o) => {
  let a = o.makeURL(e.zpwServiceMap.friend[0] + "/api/friend/feed/block");
  return async function (e, r) {
    var r = { fid: r, isBlockFeed: e ? 1 : 0, imei: i.imei },
      e = o.encodeAES(JSON.stringify(r));
    if (e)
      return (
        (r = await o.request(a, {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        o.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
