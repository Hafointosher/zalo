(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.findUserFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.findUserFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let apiUrl = api.makeURL(serviceUrls.zpwServiceMap.friend[0] + "/api/friend/profile/get");
  return async function (phoneNumber) {
    if (!phoneNumber) throw new ZaloApiError_js_1.ZaloApiError("Missing phoneNumber");
    var url,
      normalizedPhone =
        phoneNumber.startsWith("0") && "vi" == appContext.language ? "84" + phoneNumber.slice(1) : phoneNumber,
      requestParams = {
        phone: normalizedPhone,
        avatar_size: 240,
        language: appContext.language,
        imei: appContext.imei,
        reqSrc: 40,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (url = new URL(apiUrl)).searchParams.append("params", encryptedParams),
        (response = await api.request(api.makeURL(url.toString(), { params: encryptedParams }))),
        api.resolve(response, (data) => {
          if (data.error && 216 != data.error.code)
            throw new ZaloApiError_js_1.ZaloApiError(
              data.error.message,
              data.error.code,
            );
          return data.data;
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
