(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.leaveGroupFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.leaveGroupFactory = (0, utils_js_1.apiFactory)()((r, a, o) => {
  let i = o.makeURL(r.zpwServiceMap.group[0] + "/api/group/leave");
  return async function (r, e = !1) {
    var r = {
        grids: [r],
        imei: a.imei,
        silent: e ? 1 : 0,
        language: a.language,
      },
      e = o.encodeAES(JSON.stringify(r));
    if (e)
      return (
        (r = await o.request(i, {
          method: "POST",
          body: new URLSearchParams({ params: e }),
        })),
        o.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
