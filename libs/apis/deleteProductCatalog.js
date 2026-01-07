(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteProductCatalogFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.deleteProductCatalogFactory = (0, utils_js_1.apiFactory)()(
  (serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(
      serviceUrls.zpwServiceMap.catalog[0] + "/api/prodcatalog/product/mdelete",
    );
    return async function ({ productIds, catalogId }) {
      Array.isArray(productIds) || (productIds = [productIds]);
      let requestParams = { product_ids: productIds, catalog_id: catalogId };
      let encryptedParams = api.encodeAES(JSON.stringify(requestParams));
      if (encryptedParams) {
        let response = await api.request(endpoint, {
          method: "POST",
          body: new URLSearchParams({ params: encryptedParams }),
        });
        return api.resolve(response);
      }
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
