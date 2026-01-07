var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.changeAccountAvatarFactory = void 0));
let form_data_1 = __importDefault(require("form-data")),
  node_fs_1 = __importDefault(require("node:fs")),
  ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.changeAccountAvatarFactory = (0, utils_js_1.apiFactory)()((e, i, o) => {
  let s = o.makeURL(e.zpwServiceMap.file[0] + "/api/profile/upavatar");
  return async function (e) {
    var t = "string" == typeof e,
      a = t ? await (0, utils_js_1.getImageMetaData)(i, e) : e.metadata,
      r = a.totalSize || 0,
      a = {
        avatarSize: 120,
        clientId: String(i.uid + (0, utils_js_1.formatTime)("%H:%M %d/%m/%Y")),
        language: i.language,
        metaData: JSON.stringify({
          origin: { width: a.width || 1080, height: a.height || 1080 },
          processed: {
            width: a.width || 1080,
            height: a.height || 1080,
            size: r,
          },
        }),
      },
      r = t ? node_fs_1.default.readFileSync(e) : e.data,
      t = new form_data_1.default(),
      e =
        (t.append("fileContent", r, {
          filename: "blob",
          contentType: "image/jpeg",
        }),
        o.encodeAES(JSON.stringify(a)));
    if (e)
      return (
        (r = await o.request(o.makeURL(s, { params: e }), {
          method: "POST",
          headers: t.getHeaders(),
          body: t.getBuffer(),
        })),
        o.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
