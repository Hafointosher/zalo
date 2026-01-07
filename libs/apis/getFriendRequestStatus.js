(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getFriendRequestStatusFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getFriendRequestStatusFactory = (0, utils_js_1.apiFactory)()(
  (e, r, t) => {
    let i = t.makeURL(e.zpwServiceMap.friend[0] + "/api/friend/reqstatus");
    return async function (e) {
      var e = { fid: e, imei: r.imei },
        e = t.encodeAES(JSON.stringify(e));
      if (e)
        return (
          (e = await t.request(t.makeURL(i, { params: e }), { method: "GET" })),
          t.resolve(e)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
