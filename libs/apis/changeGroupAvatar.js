var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.changeGroupAvatarFactory = void 0));
let form_data_1 = __importDefault(require("form-data")),
  node_fs_1 = __importDefault(require("node:fs")),
  ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.changeGroupAvatarFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.file[0] + "/api/group/upavatar");
  return async function (avatarPath, groupId) {
    var params = {
        grid: groupId,
        avatarSize: 120,
        clientId:
          "g" +
          groupId +
          (0, utils_js_1.getFullTimeFromMillisecond)(new Date().getTime()),
        imei: appContext.imei,
      },
      isString = "string" == typeof avatarPath,
      avatarData = isString ? await (0, utils_js_1.getImageMetaData)(appContext, avatarPath) : avatarPath.metadata;
    params.originWidth = avatarData.width || 1080;
    params.originHeight = avatarData.height || 1080;
    avatarData = isString ? node_fs_1.default.readFileSync(avatarPath) : avatarPath.data;
    var formData = new form_data_1.default();
    formData.append("fileContent", avatarData, {
      filename: "blob",
      contentType: "image/jpeg",
    });
    var encryptedParams = api.encodeAES(JSON.stringify(params));
    if (encryptedParams) {
      var response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), {
        method: "POST",
        headers: formData.getHeaders(),
        body: formData.getBuffer(),
      });
      return api.resolve(response);
    }
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
