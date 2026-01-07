(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendStickerFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendStickerFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoints = {
    [index_js_1.ThreadType.User]: api.makeURL(
      serviceUrls.zpwServiceMap.chat[0] + "/api/message/sticker",
      { nretry: "0" },
    ),
    [index_js_1.ThreadType.Group]: api.makeURL(
      serviceUrls.zpwServiceMap.group[0] + "/api/group/sticker",
      { nretry: "0" },
    ),
  };
  return async function (sticker, threadId, threadType = index_js_1.ThreadType.User) {
    if (!sticker) throw new ZaloApiError_js_1.ZaloApiError("Missing sticker");
    if (!threadId) throw new ZaloApiError_js_1.ZaloApiError("Missing threadId");
    if (!sticker.id) throw new ZaloApiError_js_1.ZaloApiError("Missing sticker id");
    if (!sticker.cateId)
      throw new ZaloApiError_js_1.ZaloApiError("Missing sticker cateId");
    if (!sticker.type)
      throw new ZaloApiError_js_1.ZaloApiError("Missing sticker type");
    var isGroupThread = threadType === index_js_1.ThreadType.Group,
      stickerData = {
        stickerId: sticker.id,
        cateId: sticker.cateId,
        type: sticker.type,
        clientId: Date.now(),
        imei: appContext.imei,
        zsource: 101,
        toid: isGroupThread ? void 0 : threadId,
        grid: isGroupThread ? threadId : void 0,
      },
      encryptedParams =
        ((0, utils_js_1.removeUndefinedKeys)(stickerData),
        api.encodeAES(JSON.stringify(stickerData)));
    if (encryptedParams)
      return (
        (response = await api.request(endpoints[threadType], {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
