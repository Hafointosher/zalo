(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getStickersDetailFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getStickersDetailFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(
    serviceUrls.zpwServiceMap.sticker + "/api/message/sticker/sticker_detail",
  );
  return async function (stickerIds) {
    if (!stickerIds) throw new ZaloApiError_js_1.ZaloApiError("Missing sticker id");
    if (0 == (stickerIds = Array.isArray(stickerIds) ? stickerIds : [stickerIds]).length)
      throw new ZaloApiError_js_1.ZaloApiError("Missing sticker id");
    let results = [];
    stickerPromises = stickerIds.map((stickerId) =>
      (async (stickerId) => {
        if (((requestParams = { sid: stickerId }), (encryptedParams = api.encodeAES(JSON.stringify(requestParams)))))
          return (
            (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }))),
            (0, utils_js_1.resolveResponse)(appContext, response)
          );
        throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
      })(stickerId),
    );
    return (
      (await Promise.allSettled(stickerPromises)).forEach((result) => {
        "fulfilled" === result.status && results.push(result.value);
      }),
      results
    );
  };
});
