(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getProductCatalogListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getProductCatalogListFactory = (0, utils_js_1.apiFactory)()(
  (serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(
      serviceUrls.zpwServiceMap.catalog[0] + "/api/prodcatalog/product/list",
    );
    return async function (options) {
      var requestParams = {
          catalog_id: options.catalogId,
          limit: null != (limit = options.limit) ? limit : 100,
          version_catalog: null != (versionCatalog = options.versionCatalog) ? versionCatalog : 0,
          last_product_id: null != (lastProductId = options.lastProductId) ? lastProductId : -1,
          page: null != (page = options.page) ? page : 0,
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
  },
);
