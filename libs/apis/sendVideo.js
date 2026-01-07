(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendVideoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendVideoFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = {
    [index_js_1.ThreadType.User]: api.makeURL(
      serviceUrls.zpwServiceMap.file[0] + "/api/message/forward",
    ),
    [index_js_1.ThreadType.Group]: api.makeURL(
      serviceUrls.zpwServiceMap.file[0] + "/api/group/forward",
    ),
  };
  return async function (videoData, threadId, threadType = index_js_1.ThreadType.User) {
    let fileSize = 0;
    var clientId = Date.now();
    try {
      var response = await api.request(videoData.videoUrl, { method: "HEAD" }, !0);
      response.ok && (fileSize = parseInt(response.headers.get("content-length") || "0"));
    } catch (err) {
      throw new ZaloApiError_js_1.ZaloApiError(
        "Unable to get video content: " +
          (err instanceof Error ? err.message : String(err)),
      );
    }
    var requestParams =
      threadType === index_js_1.ThreadType.User
        ? {
            toId: threadId,
            clientId: String(clientId),
            ttl: videoData.ttl ?? 0,
            zsource: 704,
            msgType: 5,
            msgInfo: JSON.stringify({
              videoUrl: videoData.videoUrl,
              thumbUrl: videoData.thumbnailUrl,
              duration: videoData.duration ?? 0,
              width: videoData.width ?? 1280,
              height: videoData.height ?? 720,
              fileSize: fileSize,
              properties: {
                color: -1,
                size: -1,
                type: 1003,
                subType: 0,
                ext: { sSrcType: -1, sSrcStr: "", msg_warning_type: 0 },
              },
              title: videoData.msg ?? "",
            }),
            imei: appContext.imei,
          }
        : {
            grid: threadId,
            visibility: 0,
            clientId: String(clientId),
            ttl: videoData.ttl ?? 0,
            zsource: 704,
            msgType: 5,
            msgInfo: JSON.stringify({
              videoUrl: videoData.videoUrl,
              thumbUrl: videoData.thumbnailUrl,
              duration: videoData.duration ?? 0,
              width: videoData.width ?? 1280,
              height: videoData.height ?? 720,
              fileSize: fileSize,
              properties: {
                color: -1,
                size: -1,
                type: 1003,
                subType: 0,
                ext: { sSrcType: -1, sSrcStr: "", msg_warning_type: 0 },
              },
              title: videoData.msg ?? "",
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
