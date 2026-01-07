(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getQRFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getQRFactory = (0, utils_js_1.apiFactory)()((r, e, t) => {
  let o = t.makeURL(r.zpwServiceMap.friend[0] + "/api/friend/mget-qr");
  return async function (r) {
    "string" == typeof r && (r = [r]);
    var r = t.encodeAES(JSON.stringify({ fids: r }));
    if (r)
      return (
        (r = await t.request(o, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        t.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
