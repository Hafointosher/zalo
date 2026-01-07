(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateHiddenConversPinFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateHiddenConversPinFactory = (0, utils_js_1.apiFactory)()(
  (serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(
        serviceUrls.zpwServiceMap.conversation[0] + "/api/hiddenconvers/update-pin",
      ),
      pinRegex = /^\d{4}$/;
    return async function (pin) {
      if (!pinRegex.test(pin))
        throw new ZaloApiError_js_1.ZaloApiError(
          "Pin must be a 4-digit number between 0000-9999",
        );
      var requestParams = { new_pin: (0, utils_js_1.encryptPin)(pin), imei: appContext.imei },
        encryptedParams = api.encodeAES(JSON.stringify(requestParams));
      if (encryptedParams)
        return (
          (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
          api.resolve(response)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
