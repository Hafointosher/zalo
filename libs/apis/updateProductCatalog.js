(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateProductCatalogFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateProductCatalogFactory = (0, utils_js_1.apiFactory)()(
  (serviceUrls, appContext, api) => {
    let endpoint = api.makeURL(
      serviceUrls.zpwServiceMap.catalog[0] + "/api/prodcatalog/product/update",
    );
    return async function (options) {
      var productPhotos = options.product_photos || [];
      if (options.files && 0 == options.files.length) {
        if (5 < options.files.length)
          throw new ZaloApiError_js_1.ZaloApiError(
            "Maximum 5 media files are allowed",
          );
        for (var file of options.files) {
          ((uploadResult = await serviceUrls.uploadProductPhoto({ file: file })),
            (photoUrl = uploadResult.normalUrl || uploadResult.hdUrl));
          productPhotos.push(photoUrl);
        }
      }
      if (5 < productPhotos.length)
        throw new ZaloApiError_js_1.ZaloApiError(
          "Maximum 5 media files are allowed",
        );
      var encryptedParams = api.encodeAES(
        JSON.stringify({
          product_id: options.productId,
          product_name: options.productName,
          price: options.price,
          description: options.description,
          product_photos: productPhotos,
          catalog_id: options.catalogId,
          currency_unit: "₫",
          create_time: options.createTime,
        }),
      );
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
