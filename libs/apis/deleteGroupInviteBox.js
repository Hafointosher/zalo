(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteGroupInviteBoxFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.deleteGroupInviteBoxFactory = (0, utils_js_1.apiFactory)()(
  (r, e, o) => {
    let i = o.makeURL(r.zpwServiceMap.group[0] + "/api/group/inv-box/mdel-inv");
    return async function (r, e = !1) {
      var r = Array.isArray(r) ? r : [r],
        r = {
          invitations: JSON.stringify(r.map((r) => ({ grid: r }))),
          block: e ? 1 : 0,
        },
        e = o.encodeAES(JSON.stringify(r));
      if (e)
        return (
          (r = await o.request(o.makeURL(i, { params: e }), { method: "GET" })),
          o.resolve(r)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
