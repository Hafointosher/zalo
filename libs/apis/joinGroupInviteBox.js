(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.joinGroupInviteBoxFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.joinGroupInviteBoxFactory = (0, utils_js_1.apiFactory)()((r, e, o) => {
  let i = o.makeURL(r.zpwServiceMap.group[0] + "/api/group/inv-box/join");
  return async function (r) {
    var r = { grid: r, lang: e.language },
      r = o.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await o.request(o.makeURL(i, { params: r }), { method: "GET" })),
        o.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
