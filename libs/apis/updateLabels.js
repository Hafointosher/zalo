(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateLabelsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateLabelsFactory = (0, utils_js_1.apiFactory)()((e, a, r) => {
  let t = r.makeURL(e.zpwServiceMap.label[0] + "/api/convlabel/update");
  return async function (e) {
    var e = {
        labelData: JSON.stringify(e.labelData),
        version: e.version,
        imei: a.imei,
      },
      e = r.encodeAES(JSON.stringify(e));
    if (e)
      return (
        (e = await r.request(t, {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        (e = await r.resolve(e)),
        {
          labelData: JSON.parse(e.labelData),
          version: e.version,
          lastUpdateTime: e.lastUpdateTime,
        }
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
