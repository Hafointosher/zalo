(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteChatFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.deleteChatFactory = (0, utils_js_1.apiFactory)()((appContext, api, endpoint) => {
  let serviceUrls = {
    [index_js_1.ThreadType.User]: endpoint.makeURL(
      appContext.zpwServiceMap.chat[0] + "/api/message/deleteconver",
      { nretry: 0 },
    ),
    [index_js_1.ThreadType.Group]: endpoint.makeURL(
      appContext.zpwServiceMap.group[0] + "/api/group/deleteconver",
      { nretry: 0 },
    ),
  };
  return async function (conver, threadId, threadType = index_js_1.ThreadType.User) {
    var cliMsgId = Date.now().toString(),
      requestParams =
        threadType === index_js_1.ThreadType.User
          ? { toid: threadId, cliMsgId: cliMsgId, conver: conver, onlyMe: 1, imei: api.imei }
          : { grid: threadId, cliMsgId: cliMsgId, conver: conver, onlyMe: 1, imei: api.imei },
      encryptedParams = endpoint.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await endpoint.request(serviceUrls[threadType], {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        endpoint.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
