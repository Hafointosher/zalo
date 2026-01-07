(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.setHiddenConversationsFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js");
exports.setHiddenConversationsFactory = (0, utils_js_1.apiFactory)()(
  (r, a, o) => {
    let t = o.makeURL(
      r.zpwServiceMap.conversation[0] + "/api/hiddenconvers/add-remove",
    );
    return async function (r, e, i = index_js_1.ThreadType.User) {
      if (0 === (e = Array.isArray(e) ? e : [e]).length)
        throw new ZaloApiError_js_1.ZaloApiError("threadId is required");
      let s = i === index_js_1.ThreadType.Group ? 1 : 0;
      ((i = {
        [r ? "add_threads" : "del_threads"]: JSON.stringify(
          e.map((r) => ({ thread_id: r, is_group: s })),
        ),
        [r ? "del_threads" : "add_threads"]: "[]",
        imei: a.imei,
      }),
        (e = o.encodeAES(JSON.stringify(i))));
      if (e)
        return (
          (r = await o.request(t, {
            method: "POST",
            body: new URLSearchParams({ params: e }),
          })),
          o.resolve(r)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
