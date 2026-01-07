(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.addPollOptionsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.addPollOptionsFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/poll/option/add");
  return async function (options) {
    var requestParams = {
        poll_id: options.pollId,
        new_options: JSON.stringify(options.options),
        voted_option_ids: options.votedOptionIds,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
