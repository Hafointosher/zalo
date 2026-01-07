(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getUserInfoFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getUserInfoFactory = (0, utils_js_1.apiFactory)()((r, e, o) => {
  let i = o.makeURL(
    r.zpwServiceMap.profile[0] + "/api/social/friend/getprofiles/v2",
  );
  return async function (r) {
    if (!r) throw new ZaloApiError_js_1.ZaloApiError("Missing user id");
    r = (r = Array.isArray(r) ? r : [r]).map((r) =>
      1 < r.split("_").length ? r : r + "_0",
    );
    var r = {
        phonebook_version: e.extraVer.phonebook,
        friend_pversion_map: r,
        avatar_size: 120,
        language: e.language,
        show_online_status: 1,
        imei: e.imei,
      },
      r = o.encodeAES(JSON.stringify(r));
    if (r)
      return (
        (r = await o.request(i, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        o.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
