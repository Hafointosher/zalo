var __importDefault =
  (this && this.__importDefault) ||
  function (e) {
    return e && e.__esModule ? e : { default: e };
  };
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.uploadAttachmentFactory = void 0));
let form_data_1 = __importDefault(require("form-data")),
  node_fs_1 = __importDefault(require("node:fs")),
  ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js"),
  urlType = {
    image: "photo_original/upload",
    video: "asyncfile/upload",
    others: "asyncfile/upload",
  };
exports.uploadAttachmentFactory = (0, utils_js_1.apiFactory)()((e, A, x) => {
  let S = e.zpwServiceMap.file[0] + "/api",
    Z = A.settings.features.sharefile;
  function v(e) {
    return e > 1024 * Z.max_size_share_file_v3 * 1024;
  }
  return async function (e, a, i = index_js_1.ThreadType.User) {
    if (!e) throw new ZaloApiError_js_1.ZaloApiError("Missing sources");
    if (0 == (e = Array.isArray(e) ? e : [e]).length)
      throw new ZaloApiError_js_1.ZaloApiError("Missing sources");
    if (e.length > Z.max_file)
      throw new ZaloApiError_js_1.ZaloApiError(
        "Exceed maximum file of " + Z.max_file,
      );
    if (!a) throw new ZaloApiError_js_1.ZaloApiError("Missing threadId");
    var r,
      t,
      l = A.settings.features.sharefile.chunk_size_file,
      o = i == index_js_1.ThreadType.Group,
      s = [],
      p = S + `/${o ? "group" : "message"}/`,
      n = o ? "11" : "2";
    let f = Date.now();
    for (r of e) {
      var m = "string" == typeof r,
        _ = "object" == typeof r && r.data instanceof Buffer;
      if (!m && !_)
        throw new ZaloApiError_js_1.ZaloApiError("Invalid source type");
      if (!m && !r.filename)
        throw new ZaloApiError_js_1.ZaloApiError("Missing filename");
      if (m && !node_fs_1.default.existsSync(r))
        throw new ZaloApiError_js_1.ZaloApiError("File not found");
      var _ = (0, utils_js_1.getFileExtension)(
          m ? r : r.filename,
        ).toLowerCase(),
        u = m ? (0, utils_js_1.getFileName)(r) : r.filename;
      if (0 == ((t = _), -1 == Z.restricted_ext_file.indexOf(t)))
        throw new ZaloApiError_js_1.ZaloApiError(
          `File extension "${_}" is not allowed`,
        );
      var d = {
        filePath: m ? r : r.filename,
        chunkContent: [],
        params: {},
        source: r,
      };
      switch ((o ? (d.params.grid = a) : (d.params.toid = a), _)) {
        case "jpg":
        case "jpeg":
        case "png":
        case "webp":
          var h = m
            ? await (0, utils_js_1.getImageMetaData)(A, r)
            : { ...r.metadata, fileName: u };
          if (v(h.totalSize))
            throw new ZaloApiError_js_1.ZaloApiError(
              `File ${u} size exceed maximum size of ${Z.max_size_share_file_v3}MB`,
            );
          ((d.fileData = h),
            (d.fileType = "image"),
            (d.params.totalChunk = Math.ceil(d.fileData.totalSize / l)),
            (d.params.fileName = u),
            (d.params.clientId = f++),
            (d.params.totalSize = h.totalSize),
            (d.params.imei = A.imei),
            (d.params.isE2EE = 0),
            (d.params.jxl = 0),
            (d.params.chunkId = 1));
          break;
        case "mp4":
          h = m ? await (0, utils_js_1.getFileSize)(r) : r.metadata.totalSize;
          if (v(h))
            throw new ZaloApiError_js_1.ZaloApiError(
              `File ${u} size exceed maximum size of ${Z.max_size_share_file_v3}MB`,
            );
          ((d.fileType = "video"),
            (d.fileData = { fileName: u, totalSize: h }),
            (d.params.totalChunk = Math.ceil(d.fileData.totalSize / l)),
            (d.params.fileName = u),
            (d.params.clientId = f++),
            (d.params.totalSize = h),
            (d.params.imei = A.imei),
            (d.params.isE2EE = 0),
            (d.params.jxl = 0),
            (d.params.chunkId = 1));
          break;
        default:
          var c = m
            ? await (0, utils_js_1.getFileSize)(r)
            : r.metadata.totalSize;
          if (v(c))
            throw new ZaloApiError_js_1.ZaloApiError(
              `File ${u} size exceed maximum size of ${Z.max_size_share_file_v3}MB`,
            );
          ((d.fileType = "others"),
            (d.fileData = { fileName: u, totalSize: c }),
            (d.params.totalChunk = Math.ceil(d.fileData.totalSize / l)),
            (d.params.fileName = u),
            (d.params.clientId = f++),
            (d.params.totalSize = c),
            (d.params.imei = A.imei),
            (d.params.isE2EE = 0),
            (d.params.jxl = 0),
            (d.params.chunkId = 1));
      }
      var w = m ? await node_fs_1.default.promises.readFile(r) : r.data;
      for (let e = 0; e < d.params.totalChunk; e++) {
        var E = new form_data_1.default(),
          j = w.subarray(e * l, (e + 1) * l);
        (E.append("chunkContent", j, {
          filename: u,
          contentType: "application/octet-stream",
        }),
          (d.chunkContent[e] = E));
      }
      s.push(d);
    }
    let g = [],
      y = [];
    for (let r of s)
      for (let e = 0; e < r.params.totalChunk; e++) {
        var z = x.encodeAES(JSON.stringify(r.params));
        if (!z)
          throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
        (g.push(
          x
            .request(
              x.makeURL(p + urlType[r.fileType], { type: n, params: z }),
              {
                method: "POST",
                headers: r.chunkContent[e].getHeaders(),
                body: r.chunkContent[e].getBuffer(),
              },
            )
            .then(async (e) => {
              let i = await (0, utils_js_1.resolveResponse)(A, e);
              i &&
                "-1" != i.fileId &&
                "-1" != i.photoId &&
                (await new Promise((a) => {
                  var e;
                  (("video" != r.fileType && "others" != r.fileType) ||
                    A.uploadCallbacks.set(i.fileId.toString(), async (e) => {
                      e = {
                        fileType: r.fileType,
                        ...i,
                        ...e,
                        totalSize: r.fileData.totalSize,
                        fileName: r.fileData.fileName,
                        checksum: (
                          await (0, utils_js_1.getMd5LargeFileObject)(
                            r.source,
                            r.fileData.totalSize,
                          )
                        ).data,
                      };
                      (y.push(e), a());
                    }),
                    "image" == r.fileType &&
                      ((e = {
                        fileType: "image",
                        width: r.fileData.width,
                        height: r.fileData.height,
                        totalSize: r.fileData.totalSize,
                        hdSize: r.fileData.totalSize,
                        finished: i.finished,
                        normalUrl: i.normalUrl,
                        hdUrl: i.hdUrl,
                        thumbUrl: i.thumbUrl,
                        chunkId: i.chunkId,
                        photoId: i.photoId,
                        clientFileId: i.clientFileId,
                      }),
                      y.push(e),
                      a()));
                }));
            }),
        ),
          r.params.chunkId++);
      }
    return (await Promise.all(g), y);
  };
});
