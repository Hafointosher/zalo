(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.createCatalogFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.createCatalogFactory = (0, utils_js_1.apiFactory)()((r, a, e) => {
  let o = e.makeURL(
    r.zpwServiceMap.catalog[0] + "/api/prodcatalog/catalog/create",
  );
  return async function (r) {
    var r = e.encodeAES(JSON.stringify({ catalog_name: r, catalog_photo: "" }));
    if (r)
      return (
        (r = await e.request(o, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        e.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
