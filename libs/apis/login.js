(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.login = login),
  (exports.getServerInfo = getServerInfo));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
async function login(r, e) {
  e = await getEncryptParam(r, e, "getlogininfo");
  try {
    var t,
      a,
      i = await (0, utils_js_1.request)(
        r,
        (0, utils_js_1.makeURL)(
          r,
          "https://wpa.chat.zalo.me/api/login/getLoginInfo",
          { ...e.params, nretry: 0 },
        ),
      );
    if (i.ok)
      return (
        (t = await i.json()),
        e.enk &&
        null != (a = (0, utils_js_1.decryptResp)(e.enk, t.data)) &&
        "string" != typeof a
          ? a
          : null
      );
    throw new ZaloApiError_js_1.ZaloApiError(
      "Failed to fetch login info: " + i.statusText,
    );
  } catch (e) {
    throw ((0, utils_js_1.logger)(r).error("Login failed:", e), e);
  }
}
async function getServerInfo(e, r) {
  r = await getEncryptParam(e, r, "getserverinfo");
  if (!r.params.signkey || "string" != typeof r.params.signkey)
    throw new ZaloApiError_js_1.ZaloApiError("Missing signkey");
  e = await (0, utils_js_1.request)(
    e,
    (0, utils_js_1.makeURL)(
      e,
      "https://wpa.chat.zalo.me/api/login/getServerInfo",
      {
        imei: e.imei,
        type: e.API_TYPE,
        client_version: e.API_VERSION,
        computer_name: "Web",
        signkey: r.params.signkey,
      },
      !1,
    ),
  );
  if (!e.ok)
    throw new ZaloApiError_js_1.ZaloApiError(
      "Failed to fetch server info: " + e.statusText,
    );
  r = await e.json();
  if (null == r.data)
    throw new ZaloApiError_js_1.ZaloApiError(
      "Failed to fetch server info: " + r.error_message,
    );
  return r.data;
}
async function getEncryptParam(e, r, t) {
  var a,
    i = {},
    n = {
      computer_name: "Web",
      imei: e.imei,
      language: e.language,
      ts: Date.now(),
    },
    r = await _encryptParam(e, n, r);
  return (
    null == r
      ? Object.assign(i, n)
      : (({ encrypted_params: n, encrypted_data: a } = r),
        Object.assign(i, n),
        (i.params = a)),
    (i.type = e.API_TYPE),
    (i.client_version = e.API_VERSION),
    (i.signkey =
      "getserverinfo" == t
        ? (0, utils_js_1.getSignKey)(t, {
            imei: e.imei,
            type: e.API_TYPE,
            client_version: e.API_VERSION,
            computer_name: "Web",
          })
        : (0, utils_js_1.getSignKey)(t, i)),
    { params: i, enk: r ? r.enk : null }
  );
}
async function _encryptParam(e, r, t) {
  if (t) {
    t = new utils_js_1.ParamsEncryptor({
      type: e.API_TYPE,
      imei: r.imei,
      firstLaunchTime: Date.now(),
    });
    try {
      var a = JSON.stringify(r),
        i = t.getEncryptKey(),
        n = utils_js_1.ParamsEncryptor.encodeAES(i, a, "base64", !1),
        s = t.getParams();
      return s ? { encrypted_data: n, encrypted_params: s, enk: i } : null;
    } catch (e) {
      throw new ZaloApiError_js_1.ZaloApiError(
        "Failed to encrypt params: " + e,
      );
    }
  }
  return null;
}
