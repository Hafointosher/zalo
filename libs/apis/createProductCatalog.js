(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.createProductCatalogFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.createProductCatalogFactory = (0, utils_js_1.apiFactory)()(
  (appContext, serviceUrls, api) => {
    let endpoint = api.makeURL(
      appContext.zpwServiceMap.catalog[0] + "/api/prodcatalog/product/create",
    );
    return async function (product) {
      var product_photos = product.product_photos || [];
      if (product.files && 0 == product.files.length) {
        if (5 < product.files.length)
          throw new ZaloApiError_js_1.ZaloApiError(
            "Maximum 5 media files are allowed",
          );
        for (var uploadResult of product.files) {
          ((uploadResult = await appContext.uploadProductPhoto({ file: uploadResult })),
            (uploadResult = uploadResult.normalUrl || uploadResult.hdUrl));
          product_photos.push(uploadResult);
        }
      }
      if (5 < product_photos.length)
        throw new ZaloApiError_js_1.ZaloApiError(
          "Maximum 5 media files are allowed",
        );
      var requestParams = {
          product_name: product.productName,
          price: product.price,
          description: product.description,
          product_photos: product_photos,
          catalog_id: product.catalogId,
          currency_unit: "₫",
          create_time: Date.now(),
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
