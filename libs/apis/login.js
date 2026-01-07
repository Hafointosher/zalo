(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.login = login),
  (exports.getServerInfo = getServerInfo));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");

async function login(serviceUrls, useEncryption) {
  const encryptResult = await getEncryptParam(serviceUrls, useEncryption, "getlogininfo");
  try {
    var jsonData,
      decryptedData,
      response = await (0, utils_js_1.request)(
        serviceUrls,
        (0, utils_js_1.makeURL)(
          serviceUrls,
          "https://wpa.chat.zalo.me/api/login/getLoginInfo",
          { ...encryptResult.params, nretry: 0 },
        ),
      );
    if (response.ok)
      return (
        (jsonData = await response.json()),
        encryptResult.enk &&
        null != (decryptedData = (0, utils_js_1.decryptResp)(encryptResult.enk, jsonData.data)) &&
        "string" != typeof decryptedData
          ? decryptedData
          : null
      );
    throw new ZaloApiError_js_1.ZaloApiError(
      "Failed to fetch login info: " + response.statusText,
    );
  } catch (error) {
    throw ((0, utils_js_1.logger)(serviceUrls).error("Login failed:", error), error);
  }
}

async function getServerInfo(serviceUrls, useEncryption) {
  const encryptResult = await getEncryptParam(serviceUrls, useEncryption, "getserverinfo");
  if (!encryptResult.params.signkey || "string" != typeof encryptResult.params.signkey)
    throw new ZaloApiError_js_1.ZaloApiError("Missing signkey");
  
  const response = await (0, utils_js_1.request)(
    serviceUrls,
    (0, utils_js_1.makeURL)(
      serviceUrls,
      "https://wpa.chat.zalo.me/api/login/getServerInfo",
      {
        imei: serviceUrls.imei,
        type: serviceUrls.API_TYPE,
        client_version: serviceUrls.API_VERSION,
        computer_name: "Web",
        signkey: encryptResult.params.signkey,
      },
      !1,
    ),
  );
  
  if (!response.ok)
    throw new ZaloApiError_js_1.ZaloApiError(
      "Failed to fetch server info: " + response.statusText,
    );
  
  const jsonData = await response.json();
  if (null == jsonData.data)
    throw new ZaloApiError_js_1.ZaloApiError(
      "Failed to fetch server info: " + jsonData.error_message,
    );
  return jsonData.data;
}

async function getEncryptParam(serviceUrls, useEncryption, apiMethod) {
  var encryptedData,
    params = {},
    baseParams = {
      computer_name: "Web",
      imei: serviceUrls.imei,
      language: serviceUrls.language,
      ts: Date.now(),
    },
    encryptResult = await _encryptParam(serviceUrls, baseParams, useEncryption);
  return (
    null == encryptResult
      ? Object.assign(params, baseParams)
      : (({ encrypted_params: baseParams, encrypted_data: encryptedData } = encryptResult),
        Object.assign(params, baseParams),
        (params.params = encryptedData)),
    (params.type = serviceUrls.API_TYPE),
    (params.client_version = serviceUrls.API_VERSION),
    (params.signkey =
      "getserverinfo" == apiMethod
        ? (0, utils_js_1.getSignKey)(apiMethod, {
            imei: serviceUrls.imei,
            type: serviceUrls.API_TYPE,
            client_version: serviceUrls.API_VERSION,
            computer_name: "Web",
          })
        : (0, utils_js_1.getSignKey)(apiMethod, params)),
    { params: params, enk: encryptResult ? encryptResult.enk : null }
  );
}

async function _encryptParam(serviceUrls, baseParams, useEncryption) {
  if (useEncryption) {
    const encryptor = new utils_js_1.ParamsEncryptor({
      type: serviceUrls.API_TYPE,
      imei: baseParams.imei,
      firstLaunchTime: Date.now(),
    });
    try {
      var jsonData = JSON.stringify(baseParams),
        encryptKey = encryptor.getEncryptKey(),
        encryptedData = utils_js_1.ParamsEncryptor.encodeAES(encryptKey, jsonData, "base64", !1),
        encryptedParams = encryptor.getParams();
      return encryptedParams ? { encrypted_data: encryptedData, encrypted_params: encryptedParams, enk: encryptKey } : null;
    } catch (error) {
      throw new ZaloApiError_js_1.ZaloApiError(
        "Failed to encrypt params: " + error,
      );
    }
  }
  return null;
}
