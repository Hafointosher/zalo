(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.forwardMessageFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.forwardMessageFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoints = {
    [index_js_1.ThreadType.User]: api.makeURL(
      serviceUrls.zpwServiceMap.file[0] + "/api/message/mforward",
    ),
    [index_js_1.ThreadType.Group]: api.makeURL(
      serviceUrls.zpwServiceMap.file[0] + "/api/group/mforward",
    ),
  };
  return async function (messageData, targetThreadIds, threadType = index_js_1.ThreadType.User) {
    if (!messageData.message)
      throw new ZaloApiError_js_1.ZaloApiError("Missing message content");
    if (!targetThreadIds || 0 === targetThreadIds.length)
      throw new ZaloApiError_js_1.ZaloApiError("Missing thread IDs");
    let clientId = Date.now().toString();
    var messageInfo = {
        message: messageData.message,
        reference: messageData.reference
          ? JSON.stringify({ type: 3, data: JSON.stringify(messageData.reference) })
          : void 0,
      },
      forwardMetadata = messageData.reference
        ? {
            fw: {
              pmsg: { st: 1, ts: messageData.reference.ts, id: messageData.reference.id },
              rmsg: { st: 1, ts: messageData.reference.ts, id: messageData.reference.id },
              fwLvl: messageData.reference.fwLvl,
            },
          }
        : null;
    let requestParams;
    requestParams =
      threadType === index_js_1.ThreadType.User
        ? {
            toIds: targetThreadIds.map((id) => ({
              clientId: clientId,
              toUid: id,
              ttl: null != (id = messageData.ttl) ? id : 0,
            })),
            imei: appContext.imei,
            ttl: null != (encryptedParams = messageData.ttl) ? encryptedParams : 0,
            msgType: "1",
            totalIds: targetThreadIds.length,
            msgInfo: JSON.stringify(messageInfo),
            decorLog: JSON.stringify(forwardMetadata),
          }
        : {
            grids: targetThreadIds.map((id) => ({
              clientId: clientId,
              grid: id,
              ttl: null != (id = messageData.ttl) ? id : 0,
            })),
            ttl: null != (encryptedParams = messageData.ttl) ? encryptedParams : 0,
            msgType: "1",
            totalIds: targetThreadIds.length,
            msgInfo: JSON.stringify(messageInfo),
            decorLog: JSON.stringify(forwardMetadata),
          };
    var encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(endpoints[threadType], {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
