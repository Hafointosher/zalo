(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.setPinnedConversationsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.setPinnedConversationsFactory = (0, utils_js_1.apiFactory)()(
  (serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(
      serviceUrls.zpwServiceMap.conversation[0] + "/api/pinconvers/updatev2",
    );
    return async function (isPinned, conversations, threadType = index_js_1.ThreadType.User) {
      "string" == typeof conversations && (conversations = [conversations]);
      let requestParams = {
        actionType: isPinned ? 1 : 2,
        conversations:
          threadType == index_js_1.ThreadType.Group
            ? conversations.map((id) => "g" + id)
            : conversations.map((id) => "u" + id),
      };
      let encryptedParams = api.encodeAES(JSON.stringify(requestParams));
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
);
