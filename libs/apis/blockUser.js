(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.blockUserFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.blockUserFactory = (0, utils_js_1.apiFactory)()((r, e, o) => {
  let i = o.makeURL(r.zpwServiceMap.friend[0] + "/api/friend/block");
  return async function (r) {
    var r = { fid: r, imei: e.imei },
      r = o.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await o.request(i, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        o.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
