(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupInfoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupInfoFactory = (0, utils_js_1.apiFactory)()((r, e, o) => {
  let t = o.makeURL(r.zpwServiceMap.group[0] + "/api/group/getmg-v2");
  return async function (r) {
    Array.isArray(r) || (r = [r]);
    var r = {
        gridVerMap: JSON.stringify(r.reduce((r, e) => ((r[e] = 0), r), {})),
      },
      r = o.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await o.request(t, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        o.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
