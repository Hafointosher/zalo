(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.removeGroupDeputyFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.removeGroupDeputyFactory = (0, utils_js_1.apiFactory)()((r, o, i) => {
  let a = i.makeURL(r.zpwServiceMap.group[0] + "/api/group/admins/remove");
  return async function (r, e) {
    var e = {
        grid: e,
        members: (r = Array.isArray(r) ? r : [r]),
        imei: o.imei,
      },
      r = i.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await i.request(i.makeURL(a, { params: r }), { method: "GET" })),
        i.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
