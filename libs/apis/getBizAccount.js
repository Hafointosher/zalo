(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getBizAccountFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getBizAccountFactory = (0, utils_js_1.apiFactory)()((r, e, o) => {
  let t = o.makeURL(
    r.zpwServiceMap.profile[0] + "/api/social/friend/get-bizacc",
  );
  return async function (r) {
    var r = o.encodeAES(JSON.stringify({ fid: r }));
    if (r)
      return (
        (r = await o.request(t, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        o.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
