(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.customFactory = void 0));
let utils_js_1 = require("../utils.js");
exports.customFactory = (0, utils_js_1.apiFactory)()(
  (r, o, u) =>
    function (e, t) {
      Object.defineProperty(r, e, {
        value: function (e) {
          return t({ ctx: o, utils: u, props: e });
        },
        writable: !1,
        enumerable: !1,
        configurable: !1,
      });
    },
);
