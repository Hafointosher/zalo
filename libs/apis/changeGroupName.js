(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.changeGroupNameFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.changeGroupNameFactory = (0, utils_js_1.apiFactory)()((r, o, a) => {
  let t = a.makeURL(r.zpwServiceMap.group[0] + "/api/group/updateinfo");
  return async function (r, e) {
    var e = {
        grid: e,
        gname: (r = 0 == r.length ? Date.now().toString() : r),
        imei: o.imei,
      },
      r = a.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await a.request(t, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        a.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
