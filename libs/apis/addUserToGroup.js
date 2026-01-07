(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.addUserToGroupFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.addUserToGroupFactory = (0, utils_js_1.apiFactory)()((r, a, o) => {
  let i = o.makeURL(r.zpwServiceMap.group[0] + "/api/group/invite/v2");
  return async function (r, e) {
    var e = {
        grid: e,
        members: (r = Array.isArray(r) ? r : [r]),
        memberTypes: r.map(() => -1),
        imei: a.imei,
        clientLang: a.language,
      },
      r = o.encodeAES(JSON.stringify(e));
    if (r)
      return (
        (e = await o.request(i, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        o.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
