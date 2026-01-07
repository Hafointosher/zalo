(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.removeFriendFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.removeFriendFactory = (0, utils_js_1.apiFactory)()((r, e, i) => {
  let o = i.makeURL(r.zpwServiceMap.friend[0] + "/api/friend/remove");
  return async function (r) {
    var r = { fid: r, imei: e.imei },
      r = i.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await i.request(o, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        i.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
