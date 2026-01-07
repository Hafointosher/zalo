(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getStickersFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getStickersFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.sticker + "/api/message/sticker");
  return async function (keyword) {
    if (!keyword) throw new ZaloApiError_js_1.ZaloApiError("Missing keyword");
    var stickerUrl,
      requestParams = { keyword: keyword, gif: 1, guggy: 0, imei: appContext.imei },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        ((stickerUrl = new URL(endpoint)).pathname = stickerUrl.pathname + "/suggest/stickers"),
        (response = await api.request(api.makeURL(stickerUrl.toString(), { params: encryptedParams }))),
        api.resolve(response, (result) => {
          data = result.data;
          let stickerIds = [];
          return (
            data.sugg_sticker &&
              data.sugg_sticker.forEach((sticker) => stickerIds.push(sticker.sticker_id)),
            stickerIds
          );
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
