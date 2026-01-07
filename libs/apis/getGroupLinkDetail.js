(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupLinkDetailFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupLinkDetailFactory = (0, utils_js_1.apiFactory)()((r, e, i) => {
  let o = i.makeURL(r.zpwServiceMap.group[0] + "/api/group/link/detail");
  return async function (r) {
    var r = { grid: r, imei: e.imei },
      r = i.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await i.request(i.makeURL(o, { params: r }), { method: "GET" })),
        i.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
