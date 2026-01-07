(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.createProductCatalogFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.createProductCatalogFactory = (0, utils_js_1.apiFactory)()(
  (a, r, t) => {
    let i = t.makeURL(
      a.zpwServiceMap.catalog[0] + "/api/prodcatalog/product/create",
    );
    return async function (r) {
      var e = r.product_photos || [];
      if (r.files && 0 == r.files.length) {
        if (5 < r.files.length)
          throw new ZaloApiError_js_1.ZaloApiError(
            "Maximum 5 media files are allowed",
          );
        for (var o of r.files) {
          ((o = await a.uploadProductPhoto({ file: o })),
            (o = o.normalUrl || o.hdUrl));
          e.push(o);
        }
      }
      if (5 < e.length)
        throw new ZaloApiError_js_1.ZaloApiError(
          "Maximum 5 media files are allowed",
        );
      var r = {
          product_name: r.productName,
          price: r.price,
          description: r.description,
          product_photos: e,
          catalog_id: r.catalogId,
          currency_unit: "₫",
          create_time: Date.now(),
        },
        r = t.encodeAES(JSON.stringify(r));
      if (r)
        return (
          (r = await t.request(i, {
            method: "POST",
            body: new URLSearchParams({ params: r }),
          })),
          t.resolve(r)
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
    };
  },
);
