(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateLangFactory = exports.UpdateLangAvailableLanguages = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
var UpdateLangAvailableLanguages;
(((a) => {
  ((a.VI = "VI"), (a.EN = "EN"));
})(
  UpdateLangAvailableLanguages ||
    (exports.UpdateLangAvailableLanguages = UpdateLangAvailableLanguages = {}),
),
  (exports.updateLangFactory = (0, utils_js_1.apiFactory)()((a, e, r) => {
    let t = r.makeURL(
      a.zpwServiceMap.profile[0] + "/api/social/profile/updatelang",
    );
    return async function (a = UpdateLangAvailableLanguages.VI) {
      var a = r.encodeAES(JSON.stringify({ language: a }));
      if (a)
        return (
          (a = await r.request(r.makeURL(t, { params: a }), { method: "GET" })),
          r.resolve(a)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  })));
