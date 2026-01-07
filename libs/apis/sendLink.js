(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendLinkFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendLinkFactory = (0, utils_js_1.apiFactory)()((appContext, api, endpoints) => {
  let serviceUrls = {
    [index_js_1.ThreadType.User]: endpoints.makeURL(
      appContext.zpwServiceMap.chat[0] + "/api/message/link",
      { nretry: 0 },
    ),
    [index_js_1.ThreadType.Group]: endpoints.makeURL(
      appContext.zpwServiceMap.group[0] + "/api/group/sendlink",
      { nretry: 0 },
    ),
  };
  return async function (link, threadId, threadType = index_js_1.ThreadType.User) {
    var parsedLink = await appContext.parseLink(link.link),
      isGroupThread = threadType == index_js_1.ThreadType.Group,
      requestParams = {
        msg:
          link.msg && link.msg.trim()
            ? link.msg.includes(link.link)
              ? link.msg
              : link.msg + " " + link.link
            : link.link,
        href: parsedLink.data.href,
        src: parsedLink.data.src,
        title: parsedLink.data.title,
        desc: parsedLink.data.desc,
        thumb: parsedLink.data.thumb,
        type: 2,
        media: JSON.stringify(parsedLink.data.media),
        ttl: null != link.ttl ? link.ttl : 0,
        clientId: Date.now(),
      };
    if (isGroupThread) {
      requestParams.grid = threadId;
      requestParams.imei = api.imei;
    } else {
      requestParams.toId = threadId;
      requestParams.mentionInfo = "";
    }
    var encryptedParams = endpoints.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams) {
      var response = await endpoints.request(serviceUrls[threadType], {
        method: "POST",
        body: new URLSearchParams({ params: encryptedParams }),
      });
      return endpoints.resolve(response);
    }
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
