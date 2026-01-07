(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getCatalogListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getCatalogListFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(
    serviceUrls.zpwServiceMap.catalog[0] + "/api/prodcatalog/catalog/list",
  );
  return async function (options) {
    var requestParams = {
        version_list_catalog: 0,
        limit: null != (appContext = null == options ? void 0 : options.limit) ? appContext : 20,
        last_product_id:
          null != (appContext = null == options ? void 0 : options.lastProductId) ? appContext : -1,
        page: null != (appContext = null == options ? void 0 : options.page) ? appContext : 0,
      },
      encryptedParams = api.encodeAES(JSON.stringify(requestParams));
    if (encryptedParams)
      return (
        (response = await api.request(endpoint, {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        })),
        api.resolve(response)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
