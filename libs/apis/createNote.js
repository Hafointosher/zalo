(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.createNoteFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.createNoteFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(
    serviceUrls.zpwServiceMap.group_board[0] + "/api/board/topic/createv2",
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
        repeat: 0,
        src: 1,
        imei: appContext.imei,
        pinAct: content.pinAct ? 1 : 0,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(endpoint, {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(
          response,
          (response) => (
            "string" == typeof response.data.params &&
              (response.data.params = JSON.parse(response.data.params)),
            response.data
          ),
        )
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
