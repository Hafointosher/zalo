(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getProductCatalogListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getProductCatalogListFactory = (0, utils_js_1.apiFactory)()(
  (r, t, a) => {
    let o = a.makeURL(
      r.zpwServiceMap.catalog[0] + "/api/prodcatalog/product/list",
    );
    return async function (r) {
      var r = {
          catalog_id: r.catalogId,
          limit: null != (t = r.limit) ? t : 100,
          version_catalog: null != (t = r.versionCatalog) ? t : 0,
          last_product_id: null != (t = r.lastProductId) ? t : -1,
          page: null != (t = r.page) ? t : 0,
        },
        t = a.encodeAES(JSON.stringify(r));
      if (t)
        return (
          (r = await a.request(o, {
            method: "POST",
            body: new URLSearchParams({ params: t }),
          })),
          a.resolve(r)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
