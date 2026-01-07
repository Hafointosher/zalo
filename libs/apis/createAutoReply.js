(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.createAutoReplyFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.createAutoReplyFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.auto_reply[0] + "/api/autoreply/create");
  return async function (options) {
    var requestParams = Array.isArray(options.uids) ? options.uids : [options.uids],
      requestParams = 2 === options.scope || 3 === options.scope ? requestParams : [],
      message = {
        cliLang: appContext.language,
        enable: options.isEnable,
        content: options.content,
        startTime: options.startTime,
        endTime: options.endTime,
        recurrence: ["RRULE:FREQ=DAILY;"],
        scope: options.scope,
        uids: requestParams,
      },
      encryptedParams = api.encodeAES(JSON.stringify(message));
    if (encryptedParams)
      return (
        (response = await api.request(endpoint, {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
