(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.getCatalogListFactory = void 0));
let ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  utils_js_1 = require("../utils.js");
exports.getCatalogListFactory = (0, utils_js_1.apiFactory)()((r, t, a) => {
  let e = a.makeURL(
    r.zpwServiceMap.catalog[0] + "/api/prodcatalog/catalog/list",
  );
  return async function (r) {
    var r = {
        version_list_catalog: 0,
        limit: null != (t = null == r ? void 0 : r.limit) ? t : 20,
        last_product_id:
          null != (t = null == r ? void 0 : r.lastProductId) ? t : -1,
        page: null != (t = null == r ? void 0 : r.page) ? t : 0,
      },
      t = a.encodeAES(JSON.stringify(r));
    if (t)
      return (
        (r = await a.request(e, {
          method: "POST",
          body: new URLSearchParams({ params: t }),
        })),
        a.resolve(r)
      );
    throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt params");
  };
});
