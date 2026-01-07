(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateLangFactory = exports.UpdateLangAvailableLanguages = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
var UpdateLangAvailableLanguages;
(((lang) => {
  ((lang.VI = "VI"), (lang.EN = "EN"));
})(
  UpdateLangAvailableLanguages ||
    (exports.UpdateLangAvailableLanguages = UpdateLangAvailableLanguages = {}),
),
  (exports.updateLangFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(
      serviceUrls.zpwServiceMap.profile[0] + "/api/social/profile/updatelang",
    );
    return async function (language = UpdateLangAvailableLanguages.VI) {
      var encryptedParams = api.encodeAES(JSON.stringify({ language: language }));
      if (encryptedParams)
        return (
          (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
          api.resolve(response)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  })));
