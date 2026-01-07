(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getGroupInviteBoxInfoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getGroupInviteBoxInfoFactory = (0, utils_js_1.apiFactory)()(
  (serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/inv-box/inv-info");
    return async function (options) {
      var requestParams = {
          grId: options.groupId,
          mcount: null != (mcount = options.mcount) ? mcount : 10,
          mpage: null != (mpage = options.mpage) ? mpage : 1,
        },
        encryptedParams = api.encodeAES(JSON.stringify(requestParams));
      if (encryptedParams)
        return (
          (response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "GET" })),
          api.resolve(response, (result) => {
            var parsedParams,
              data = result.data,
              topic = data.groupInfo.topic;
            return (
              "string" == typeof topic.params &&
                ("string" == typeof (parsedParams = JSON.parse(topic.params)).extra &&
                  (parsedParams.extra = JSON.parse(parsedParams.extra)),
                (topic.params = parsedParams)),
              data
            );
          })
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
