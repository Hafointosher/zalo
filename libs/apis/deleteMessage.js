(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteMessageFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.deleteMessageFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpointUrls = {
    [index_js_1.ThreadType.User]: api.makeURL(
      serviceUrls.zpwServiceMap.chat[0] + "/api/message/delete",
    ),
    [index_js_1.ThreadType.Group]: api.makeURL(
      serviceUrls.zpwServiceMap.group[0] + "/api/group/deletemsg",
    ),
  };
  return async function (message, onlyMe = !1) {
    var { threadId, type: threadType = index_js_1.ThreadType.User, data: messageData } = message,
      isGroupThread = threadType === index_js_1.ThreadType.Group;
    if (appContext.uid == messageData.uidFrom && !1 === onlyMe)
      throw new ZaloApiError_js_1.ZaloApiError(
        "To delete your message for everyone, use undo api instead",
      );
    if (!isGroupThread && !1 === onlyMe)
      throw new ZaloApiError_js_1.ZaloApiError(
        "Can't delete message for everyone in a private chat",
      );
    ((requestParams = {
      [isGroupThread ? "grid" : "toid"]: threadId,
      cliMsgId: Date.now(),
      msgs: [
        {
          cliMsgId: messageData.cliMsgId,
          globalMsgId: messageData.msgId,
          ownerId: messageData.uidFrom,
          destId: threadId,
        },
      ],
      onlyMe: onlyMe ? 1 : 0,
    }),
      isGroupThread || (requestParams.imei = appContext.imei),
      (encryptedParams = api.encodeAES(JSON.stringify(requestParams))));
    if (encryptedParams)
      return (
        (response = await api.request(endpointUrls[threadType], {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
