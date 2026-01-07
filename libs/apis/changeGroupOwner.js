(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.changeGroupOwnerFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.changeGroupOwnerFactory = (0, utils_js_1.apiFactory)()((r, a, o) => {
  let i = o.makeURL(r.zpwServiceMap.group[0] + "/api/group/change-owner");
  return async function (r, e) {
    var e = { grid: e, newAdminId: r, imei: a.imei, language: a.language },
      r = o.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await o.request(o.makeURL(i, { params: r }), { method: "GET" })),
        o.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
