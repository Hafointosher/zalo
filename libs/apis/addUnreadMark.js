(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.addUnreadMarkFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.addUnreadMarkFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(
    serviceUrls.zpwServiceMap.conversation[0] + "/api/conv/addUnreadMark",
  );
  return async function (threadId, threadType = index_js_1.ThreadType.User) {
    var timestamp = Date.now(),
      cliMsgId = timestamp.toString(),
      isGroup = threadType === index_js_1.ThreadType.Group,
      requestParams = {
        param: JSON.stringify({
          [isGroup ? "convsGroup" : "convsUser"]: [
            { id: threadId, cliMsgId: cliMsgId, fromUid: "0", ts: timestamp },
          ],
          [isGroup ? "convsUser" : "convsGroup"]: [],
          imei: appContext.imei,
        }),
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(endpoint, {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response, (result) => {
          var data = result.data;
          return "string" == typeof data.data
            ? { data: JSON.parse(data.data), status: data.status }
            : result.data;
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
