var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.changeGroupAvatarFactory = void 0));
let form_data_1 = __importDefault(require("form-data")),
  node_fs_1 = __importDefault(require("node:fs")),
  ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.changeGroupAvatarFactory = (0, utils_js_1.apiFactory)()((e, i, o) => {
  let s = o.makeURL(e.zpwServiceMap.file[0] + "/api/group/upavatar");
  return async function (e, r) {
    var r = {
        grid: r,
        avatarSize: 120,
        clientId:
          "g" +
          r +
          (0, utils_js_1.getFullTimeFromMillisecond)(new Date().getTime()),
        imei: i.imei,
      },
      t = "string" == typeof e,
      a = t ? await (0, utils_js_1.getImageMetaData)(i, e) : e.metadata,
      a =
        ((r.originWidth = a.width || 1080),
        (r.originHeight = a.height || 1080),
        t ? node_fs_1.default.readFileSync(e) : e.data),
      t = new form_data_1.default(),
      e =
        (t.append("fileContent", a, {
          filename: "blob",
          contentType: "image/jpeg",
        }),
        o.encodeAES(JSON.stringify(r)));
    if (e)
      return (
        (a = await o.request(o.makeURL(s, { params: e }), {
          method: "POST",
          headers: t.getHeaders(),
          body: t.getBuffer(),
        })),
        o.resolve(a)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
