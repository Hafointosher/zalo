(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getLabelsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getLabelsFactory = (0, utils_js_1.apiFactory)()((e, r, a) => {
  let t = a.makeURL(e.zpwServiceMap.label[0] + "/api/convlabel/get");
  return async function () {
    var e = { imei: r.imei },
      e = a.encodeAES(JSON.stringify(e));
    if (e)
      return (
        (e = await a.request(a.makeURL(t, { params: e }))),
        a.resolve(e, (e) => {
          e = e.data;
          return {
            labelData: JSON.parse(e.labelData),
            version: e.version,
            lastUpdateTime: e.lastUpdateTime,
          };
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
