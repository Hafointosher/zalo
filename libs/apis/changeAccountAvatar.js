var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.changeAccountAvatarFactory = void 0));
let form_data_1 = __importDefault(require("form-data")),
  node_fs_1 = __importDefault(require("node:fs")),
  ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.changeAccountAvatarFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.file[0] + "/api/profile/upavatar");
  return async function (avatarPath) {
    var isString = "string" == typeof avatarPath,
      metadata = isString ? await (0, utils_js_1.getImageMetaData)(appContext, avatarPath) : avatarPath.metadata,
      totalSize = metadata.totalSize || 0,
      requestParams = {
        avatarSize: 120,
        clientId: String(appContext.uid + (0, utils_js_1.formatTime)("%H:%M %d/%m/%Y")),
        language: appContext.language,
        metaData: JSON.stringify({
          origin: { width: metadata.width || 1080, height: metadata.height || 1080 },
          processed: {
            width: metadata.width || 1080,
            height: metadata.height || 1080,
            size: totalSize,
          },
        }),
      },
      avatarData = isString ? node_fs_1.default.readFileSync(avatarPath) : avatarPath.data,
      formData = new form_data_1.default(),
      encryptedParams =
        (formData.append("fileContent", avatarData, {
          filename: "blob",
          contentType: "image/jpeg",
        }),
        api.encodeAES(JSON.stringify(requestParams)));
    if (encryptedParams)
      return (
        (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), {
          method: "POST",
          headers: formData.getHeaders(),
          body: formData.getBuffer(),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
