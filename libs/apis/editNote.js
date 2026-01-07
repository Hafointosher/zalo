(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.editNoteFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.editNoteFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(
    serviceUrls.zpwServiceMap.group_board[0] + "/api/board/topic/updatev2",
  );
  return async function (content, groupId) {
    var requestParams = {
        grid: groupId,
        type: 0,
        color: -16777216,
        emoji: "",
        startTime: -1,
        duration: -1,
        params: JSON.stringify({ title: content.title }),
        topicId: content.topicId,
        repeat: 0,
        imei: appContext.imei,
        pinAct: content.pinAct ? 1 : 2,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(endpoint, {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response, (response) => {
          var data = response.data;
          return (
            "string" == typeof data.params && (data.params = JSON.parse(data.params)),
            data
          );
        })
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
