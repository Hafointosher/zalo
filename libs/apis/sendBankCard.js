(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendBankCardFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.sendBankCardFactory = (0, utils_js_1.apiFactory)()((e, r, s) => {
  let n = s.makeURL(e.zpwServiceMap.zimsg[0] + "/api/transfer/card");
  return async function (e, r, a = index_js_1.ThreadType.User) {
    ((e = {
      binBank: e.binBank,
      numAccBank: e.numAccBank,
      nameAccBank:
        (null == (e = e.nameAccBank) ? void 0 : e.toUpperCase()) || "---",
      cliMsgId: Date.now().toString(),
      tsMsg: Date.now(),
      destUid: r,
      destType: a === index_js_1.ThreadType.Group ? 1 : 0,
    }),
      (r = s.encodeAES(JSON.stringify(e))));
    if (r)
      return (
        (a = await s.request(n, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        s.resolve(a)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
