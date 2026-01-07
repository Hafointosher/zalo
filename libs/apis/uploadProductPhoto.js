var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.uploadProductPhotoFactory = void 0));
let node_fs_1 = __importDefault(require("node:fs")),
  form_data_1 = __importDefault(require("form-data")),
  ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.uploadProductPhotoFactory = (0, utils_js_1.apiFactory)()((e, r, o) => {
  let i = o.makeURL(e.zpwServiceMap.file[0] + "/api/product/upload/photo");
  return async function (e) {
    var t = "string" == typeof e.file,
      a =
        (t
          ? await (0, utils_js_1.getImageMetaData)(r, e.file)
          : e.file.metadata
        ).totalSize || 0,
      t = t ? await node_fs_1.default.promises.readFile(e.file) : e.file.data,
      e = new form_data_1.default(),
      t =
        (e.append("chunkContent", t, {
          filename: "undefined",
          contentType: "application/octet-stream",
        }),
        {
          totalChunk: 1,
          fileName: `Base64_Img_Picker_${Date.now()}.jpg`,
          clientId: Date.now(),
          totalSize: a,
          imei: r.imei,
          chunkId: 1,
          toid: r.loginInfo.send2me_id,
          featureId: 1,
        }),
      a = o.encodeAES(JSON.stringify(t));
    if (a)
      return (
        (t = await o.request(o.makeURL(i, { params: a }), {
          method: "POST",
          headers: e.getHeaders(),
          body: e.getBuffer(),
        })),
        o.resolve(t)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
