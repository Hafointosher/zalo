(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getAliasListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getAliasListFactory = (0, utils_js_1.apiFactory)()((r, i, a) => {
  let t = a.makeURL(r.zpwServiceMap.alias[0] + "/api/alias/list");
  return async function (r = 100, e = 1) {
    var e = { page: e, count: r, imei: i.imei },
      r = a.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await a.request(a.makeURL(t, { params: r }), { method: "GET" })),
        a.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
