(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteProductCatalogFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.deleteProductCatalogFactory = (0, utils_js_1.apiFactory)()(
  (r, e, o) => {
    let t = o.makeURL(
      r.zpwServiceMap.catalog[0] + "/api/prodcatalog/product/mdelete",
    );
    return async function (r) {
      Array.isArray(r.productIds) || (r.productIds = [r.productIds]);
      var r = { product_ids: r.productIds, catalog_id: r.catalogId },
        r = o.encodeAES(JSON.stringify(r));
      if (r)
        return (
          (r = await o.request(t, {
            method: "POST",
            body: new URLSearchParams({ params: r }),
          })),
          o.resolve(r)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
