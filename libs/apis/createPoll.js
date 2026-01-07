(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.createPollFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.createPollFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/poll/create");
  return async function (pollOptions, groupId) {
    var requestParams = {
        group_id: groupId,
        question: pollOptions.question,
        options: pollOptions.options,
        expired_time: null != (groupId = pollOptions.expiredTime) ? groupId : 0,
        pinAct: !1,
        allow_multi_choices: !!pollOptions.allowMultiChoices,
        allow_add_new_option: !!pollOptions.allowAddNewOption,
        is_hide_vote_preview: !!pollOptions.hideVotePreview,
        is_anonymous: !!pollOptions.isAnonymous,
        poll_type: 0,
        src: 1,
        imei: appContext.imei,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
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
});
