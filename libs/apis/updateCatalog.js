(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateCatalogFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateCatalogFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let endpoint = api.makeURL(
    serviceUrls.zpwServiceMap.catalog[0] + "/api/prodcatalog/catalog/update",
  );
  return async function (options) {
    var requestParams = {
        catalog_id: options.catalogId,
        catalog_name: options.catalogName,
        catalog_photo: "",
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
