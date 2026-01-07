(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupBlockedMemberFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupBlockedMemberFactory = (0, utils_js_1.apiFactory)()(
  (r, o, t) => {
    let i = t.makeURL(r.zpwServiceMap.group[0] + "/api/group/blockedmems/list");
    return async function (r, e) {
      var r = {
          grid: e,
          page: null != (e = r.page) ? e : 1,
          count: null != (e = r.count) ? e : 50,
          imei: o.imei,
        },
        e = t.encodeAES(JSON.stringify(r));
      if (e)
        return (
          (r = await t.request(t.makeURL(i, { params: e }), { method: "GET" })),
          t.resolve(r)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
