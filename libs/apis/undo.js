(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.undoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.undoFactory = (0, utils_js_1.apiFactory)()((e, s, o) => {
  let a = {
    [index_js_1.ThreadType.User]: o.makeURL(
      e.zpwServiceMap.chat[0] + "/api/message/undo",
    ),
    [index_js_1.ThreadType.Group]: o.makeURL(
      e.zpwServiceMap.group[0] + "/api/group/undomsg",
    ),
  };
  return async function (e, r, i = index_js_1.ThreadType.User) {
    var e = { msgId: e.msgId, clientId: Date.now(), cliMsgIdUndo: e.cliMsgId },
      r =
        (i == index_js_1.ThreadType.Group
          ? ((e.grid = r), (e.visibility = 0), (e.imei = s.imei))
          : (e.toid = r),
        o.encodeAES(JSON.stringify(e)));
    if (r)
      return (
        (e = await o.request(a[i], {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        o.resolve(e)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
