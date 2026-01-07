(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.deleteCatalogFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.deleteCatalogFactory = (0, utils_js_1.apiFactory)()((r, e, a) => {
  let o = a.makeURL(
    r.zpwServiceMap.catalog[0] + "/api/prodcatalog/catalog/delete",
  );
  return async function (r) {
    var r = a.encodeAES(JSON.stringify({ catalog_id: r }));
    if (r)
      return (
        (r = await a.request(o, {
          method: "POST",
          body: new URLSearchParams({ params: r }),
        })),
        a.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
