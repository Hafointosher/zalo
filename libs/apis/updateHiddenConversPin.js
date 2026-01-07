(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateHiddenConversPinFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateHiddenConversPinFactory = (0, utils_js_1.apiFactory)()(
  (e, r, i) => {
    let t = i.makeURL(
        e.zpwServiceMap.conversation[0] + "/api/hiddenconvers/update-pin",
      ),
      o = /^\d{4}$/;
    return async function (e) {
      if (!o.test(e))
        throw new ZaloApiError_js_1.ZaloApiError(
          "Pin must be a 4-digit number between 0000-9999",
        );
      var e = { new_pin: (0, utils_js_1.encryptPin)(e), imei: r.imei },
        e = i.encodeAES(JSON.stringify(e));
      if (e)
        return (
          (e = await i.request(i.makeURL(t, { params: e }), { method: "GET" })),
          i.resolve(e)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
