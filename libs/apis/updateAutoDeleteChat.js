(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateAutoDeleteChatFactory = exports.ChatTTL = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
var ChatTTL;
(((ttl) => {
  ((ttl[(ttl.NO_DELETE = 0)] = "NO_DELETE"),
    (ttl[(ttl.ONE_DAY = 864e5)] = "ONE_DAY"),
    (ttl[(ttl.SEVEN_DAYS = 6048e5)] = "SEVEN_DAYS"),
    (ttl[(ttl.FOURTEEN_DAYS = 12096e5)] = "FOURTEEN_DAYS"));
})(ChatTTL || (exports.ChatTTL = ChatTTL = {})),
  (exports.updateAutoDeleteChatFactory = (0, utils_js_1.apiFactory)()(
    (serviceUrls, appContext, api) => {
      let endpoint = api.makeURL(
        serviceUrls.zpwServiceMap.conversation[0] + "/api/conv/autodelete/updateConvers",
      );
      return async function (ttl, threadId, threadType = index_js_1.ThreadType.User) {
        ((requestParams = {
          threadId: threadId,
          isGroup: threadType === index_js_1.ThreadType.Group ? 1 : 0,
          ttl: ttl,
          clientLang: appContext.language,
        }),
          (encryptedParams = api.encodeAES(JSON.stringify(requestParams))));
        if (encryptedParams)
          return (
            (response = await api.request(endpoint, {
              method: "POST",
              body: new URLSearchParams({ params: encryptedParams }),
            })),
            api.resolve(response)
          );
        throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
      };
    },
  )));
