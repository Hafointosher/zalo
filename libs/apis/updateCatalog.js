(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.updateCatalogFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.updateCatalogFactory = (0, utils_js_1.apiFactory)()((a, r, e) => {
  let o = e.makeURL(
    a.zpwServiceMap.catalog[0] + "/api/prodcatalog/catalog/update",
  );
  return async function (a) {
    var a = {
        catalog_id: a.catalogId,
        catalog_name: a.catalogName,
        catalog_photo: "",
      },
      a = e.encodeAES(JSON.stringify(a));
    if (a)
      return (
        (a = await e.request(o, {
          method: "POST",
          body: new URLSearchParams({ params: a }),
        })),
        e.resolve(a)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
