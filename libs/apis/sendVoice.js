(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendVoiceFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendVoiceFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = {
    [index_js_1.ThreadType.User]: api.makeURL(
      serviceUrls.zpwServiceMap.file[0] + "/api/message/forward",
    ),
    [index_js_1.ThreadType.Group]: api.makeURL(
      serviceUrls.zpwServiceMap.file[0] + "/api/group/forward",
    ),
  };
  return async function (voiceData, threadId, threadType = index_js_1.ThreadType.User) {
    let ttlUser,
      ttlGroup,
      fileSize = null;
    var clientId = Date.now().toString();
    try {
      var response = await api.request(voiceData.voiceUrl, { method: "HEAD" }, !0);
      response.ok && (fileSize = parseInt(response.headers.get("content-length") || "0"));
    } catch (e) {
      throw new ZaloApiError_js_1.ZaloApiError(
        "Unable to get voice content: " +
          (e instanceof Error ? e.message : String(e)),
      );
    }
    var requestParams =
      threadType === index_js_1.ThreadType.User
        ? {
            toId: threadId,
            ttl: null != (ttlUser = voiceData.ttl) ? ttlUser : 0,
            zsource: -1,
            msgType: 3,
            clientId: clientId,
            msgInfo: JSON.stringify({
              voiceUrl: voiceData.voiceUrl,
              m4aUrl: voiceData.voiceUrl,
              fileSize: null != fileSize ? fileSize : 0,
            }),
            imei: appContext.imei,
          }
        : {
            grid: threadId,
            visibility: 0,
            ttl: null != (ttlGroup = voiceData.ttl) ? ttlGroup : 0,
            zsource: -1,
            msgType: 3,
            clientId: clientId,
            msgInfo: JSON.stringify({
              voiceUrl: voiceData.voiceUrl,
              m4aUrl: voiceData.voiceUrl,
              fileSize: null != fileSize ? fileSize : 0,
            }),
            imei: appContext.imei,
          };
    if (threadType !== index_js_1.ThreadType.User && threadType !== index_js_1.ThreadType.Group)
      throw new ZaloApiError_js_1.ZaloApiError("Thread type is invalid");
    var encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(endpoint[threadType], {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
