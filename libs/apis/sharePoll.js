(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sharePollFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.sharePollFactory = (0, utils_js_1.apiFactory)()((r, e, o) => {
  let a = o.makeURL(r.zpwServiceMap.group[0] + "/api/poll/share");
  return async function (r) {
    var r = { poll_id: r, imei: e.imei },
      r = o.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await o.request(a, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        o.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
