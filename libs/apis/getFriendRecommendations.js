(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getFriendRecommendationsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getFriendRecommendationsFactory = (0, utils_js_1.apiFactory)()(
  (e, r, i) => {
    let o = i.makeURL(
      e.zpwServiceMap.friend[0] + "/api/friend/recommendsv2/list",
    );
    return async function () {
      var e = { imei: r.imei },
        e = i.encodeAES(JSON.stringify(e));
      if (e)
        return (
          (e = await i.request(i.makeURL(o, { params: e }), { method: "GET" })),
          i.resolve(e)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
