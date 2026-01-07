(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.createGroupFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.createGroupFactory = (0, utils_js_1.apiFactory)()((a, t, o) => {
  let i = o.makeURL(a.zpwServiceMap.group[0] + "/api/group/create/v2");
  return async function (e) {
    if (0 == e.members.length)
      throw new ZaloApiError_js_1.ZaloApiError(
        "Group must have at least one member",
      );
    var r = {
        clientId: Date.now(),
        gname: String(Date.now()),
        gdesc: null,
        members: e.members,
        membersTypes: e.members.map(() => -1),
        nameChanged: 0,
        createLink: 1,
        clientLang: t.language,
        imei: t.imei,
        zsource: 601,
      },
      r =
        (e.name &&
          0 < e.name.length &&
          ((r.gname = e.name), (r.nameChanged = 1)),
        o.encodeAES(JSON.stringify(r)));
    if (r)
      return (
        (r = await o.request(o.makeURL(i, { params: r }), { method: "POST" })),
        (r = await o.resolve(r)),
        (e.avatarSource = e.avatarSource || e.avatarPath),
        e.avatarSource &&
          (await a
            .changeGroupAvatar(e.avatarSource, r.groupId)
            .catch(o.logger.error)),
        r
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
  };
});
