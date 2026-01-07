(Object.defineProperty(exports, "__esModule", { value: true }),
  (exports.createGroupFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");

exports.createGroupFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  const endpoint = api.makeURL(serviceUrls.zpwServiceMap.group[0] + "/api/group/create/v2");

  return async function createGroup(options) {
    if (options.members.length === 0) {
      throw new ZaloApiError_js_1.ZaloApiError(
        "Group must have at least one member",
      );
    }

    const requestParams = {
      clientId: Date.now(),
      gname: String(Date.now()),
      gdesc: null,
      members: options.members,
      membersTypes: options.members.map(() => -1),
      nameChanged: 0,
      createLink: 1,
      clientLang: appContext.language,
      imei: appContext.imei,
      zsource: 601,
    };

    if (options.name && options.name.length > 0) {
      requestParams.gname = options.name;
      requestParams.nameChanged = 1;
    }

    const encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (!encryptedParams) {
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
    }

    const response = await api.request(api.makeURL(endpoint, { params: encryptedParams }), { method: "POST" });
    const result = await api.resolve(response);

    options.avatarSource = options.avatarSource || options.avatarPath;
    if (options.avatarSource) {
      await serviceUrls.changeGroupAvatar(options.avatarSource, result.groupId).catch(api.logger.error);
    }

    return result;
  };
});
