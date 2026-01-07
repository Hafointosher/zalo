(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getArchivedChatListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getArchivedChatListFactory = (0, utils_js_1.apiFactory)()((r, e, i) => {
  let t = i.makeURL(r.zpwServiceMap.label[0] + "/api/archivedchat/list");
  return async function () {
    var r = { version: 1, imei: e.imei },
      r = i.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await i.request(i.makeURL(t, { params: r }), { method: "GET" })),
        i.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
