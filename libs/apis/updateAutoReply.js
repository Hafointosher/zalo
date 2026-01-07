(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateAutoReplyFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateAutoReplyFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.auto_reply[0] + "/api/autoreply/update");
  return async function (options) {
    var userIds = Array.isArray(options.uids) ? options.uids : [options.uids],
      filteredUserIds = 2 === options.scope || 3 === options.scope ? userIds : [],
      requestParams = {
        cliLang: appContext.language,
        id: options.id,
        enable: options.isEnable,
        content: options.content,
        startTime: options.startTime,
        endTime: options.endTime,
        recurrence: ["RRULE:FREQ=DAILY;"],
        scope: options.scope,
        uids: filteredUserIds,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
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
