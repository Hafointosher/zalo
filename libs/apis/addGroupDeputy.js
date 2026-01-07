(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.addGroupDeputyFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.addGroupDeputyFactory = (0, utils_js_1.apiFactory)()((r, a, o) => {
  let i = o.makeURL(r.zpwServiceMap.group[0] + "/api/group/admins/add");
  return async function (r, e) {
    var e = {
        grid: e,
        members: (r = Array.isArray(r) ? r : [r]),
        imei: a.imei,
      },
      r = o.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await o.request(o.makeURL(i, { params: r }), { method: "GET" })),
        o.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
