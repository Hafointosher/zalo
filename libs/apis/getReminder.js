(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getReminderFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getReminderFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(
    serviceUrls.zpwServiceMap.group_board[0] + "/api/board/topic/getReminder",
  );
  return async function (eventId) {
    var requestParams = { eventId: eventId, imei: appContext.imei },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
