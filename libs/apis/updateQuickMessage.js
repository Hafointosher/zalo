(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateQuickMessageFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateQuickMessageFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(
    serviceUrls.zpwServiceMap.quick_message[0] + "/api/quickmessage/update",
  );
  return async function (options, itemId) {
    var mediaType = options.media ? 1 : 0,
      requestParams = {
        itemId: itemId,
        keyword: options.keyword,
        message: { title: options.title, params: "" },
        type: mediaType,
      };
    if (1 == mediaType) {
      if (!options.media)
        throw new ZaloApiError_js_1.ZaloApiError("Media is required");
      var uploadResult = await serviceUrls.uploadProductPhoto({ file: options.media }),
        photoId = uploadResult.photoId,
        thumbUrl = uploadResult.thumbUrl,
        normalUrl = uploadResult.normalUrl,
        hdUrl = uploadResult.hdUrl;
      requestParams.media = {
        items: [
          {
            type: 0,
            photoId: photoId,
            title: "",
            width: "",
            height: "",
            previewThumb: thumbUrl,
            rawUrl: normalUrl || hdUrl,
            thumbUrl: thumbUrl,
            normalUrl: normalUrl || hdUrl,
            hdUrl: hdUrl || normalUrl,
          },
        ],
      };
    }
    encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
