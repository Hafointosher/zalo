(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getFriendBoardListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getFriendBoardListFactory = (0, utils_js_1.apiFactory)()((r, e, i) => {
  let o = i.makeURL(r.zpwServiceMap.friend_board[0] + "/api/friendboard/list");
  return async function (r) {
    var r = { conversationId: r, version: 0, imei: e.imei },
      r = i.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await i.request(i.makeURL(o, { params: r }), { method: "GET" })),
        i.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
