(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.parseLinkFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.parseLinkFactory = (0, utils_js_1.apiFactory)()((r, e, i) => {
  let a = i.makeURL(r.zpwServiceMap.file[0] + "/api/message/parselink");
  return async function (r) {
    var r = { link: r, version: 1, imei: e.imei },
      r = i.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await i.request(i.makeURL(a, { params: r }), { method: "GET" })),
        i.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
