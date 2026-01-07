var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
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
exports.uploadAttachmentFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
  let fileServiceBaseUrl = serviceUrls.zpwServiceMap.file[0] + "/api",
    shareFileConfig = appContext.settings.features.sharefile;
  function exceedsMaxSize(fileSize) {
    return fileSize > 1024 * shareFileConfig.max_size_share_file_v3 * 1024;
  }
  return async function (sources, threadId, threadType = index_js_1.ThreadType.User) {
    if (!sources) throw new ZaloApiError_js_1.ZaloApiError("Missing sources");
    if (0 == (sources = Array.isArray(sources) ? sources : [sources]).length)
      throw new ZaloApiError_js_1.ZaloApiError("Missing sources");
    if (sources.length > shareFileConfig.max_file)
      throw new ZaloApiError_js_1.ZaloApiError(
        "Exceed maximum file of " + shareFileConfig.max_file,
      );
    if (!threadId) throw new ZaloApiError_js_1.ZaloApiError("Missing threadId");
    var source,
      extForCheck,
      chunkSize = appContext.settings.features.sharefile.chunk_size_file,
      isGroupThread = threadType == index_js_1.ThreadType.Group,
      uploadDataList = [],
      uploadEndpoint = fileServiceBaseUrl + `/${isGroupThread ? "group" : "message"}/`,
      typeParam = isGroupThread ? "11" : "2";
    let clientIdCounter = Date.now();
    for (source of sources) {
      var isFilePath = "string" == typeof source,
        isBufferData = "object" == typeof source && source.data instanceof Buffer;
      if (!isFilePath && !isBufferData)
        throw new ZaloApiError_js_1.ZaloApiError("Invalid source type");
      if (!isFilePath && !source.filename)
        throw new ZaloApiError_js_1.ZaloApiError("Missing filename");
      if (isFilePath && !node_fs_1.default.existsSync(source))
        throw new ZaloApiError_js_1.ZaloApiError("File not found");
      var fileExtension = (0, utils_js_1.getFileExtension)(
          isFilePath ? source : source.filename,
        ).toLowerCase(),
        fileName = isFilePath ? (0, utils_js_1.getFileName)(source) : source.filename;
      if (0 == ((extForCheck = fileExtension), -1 == shareFileConfig.restricted_ext_file.indexOf(extForCheck)))
        throw new ZaloApiError_js_1.ZaloApiError(
          `File extension "${fileExtension}" is not allowed`,
        );
      var uploadData = {
        filePath: isFilePath ? source : source.filename,
        chunkContent: [],
        params: {},
        source: source,
      };
      switch ((isGroupThread ? (uploadData.params.grid = threadId) : (uploadData.params.toid = threadId), fileExtension)) {
        case "jpg":
        case "jpeg":
        case "png":
        case "webp":
          var imageMetadata = isFilePath
            ? await (0, utils_js_1.getImageMetaData)(appContext, source)
            : { ...source.metadata, fileName: fileName };
          if (exceedsMaxSize(imageMetadata.totalSize))
            throw new ZaloApiError_js_1.ZaloApiError(
              `File ${fileName} size exceed maximum size of ${shareFileConfig.max_size_share_file_v3}MB`,
            );
          ((uploadData.fileData = imageMetadata),
            (uploadData.fileType = "image"),
            (uploadData.params.totalChunk = Math.ceil(uploadData.fileData.totalSize / chunkSize)),
            (uploadData.params.fileName = fileName),
            (uploadData.params.clientId = clientIdCounter++),
            (uploadData.params.totalSize = imageMetadata.totalSize),
            (uploadData.params.imei = appContext.imei),
            (uploadData.params.isE2EE = 0),
            (uploadData.params.jxl = 0),
            (uploadData.params.chunkId = 1));
          break;
        case "mp4":
          var videoFileSize = isFilePath ? await (0, utils_js_1.getFileSize)(source) : source.metadata.totalSize;
          if (exceedsMaxSize(videoFileSize))
            throw new ZaloApiError_js_1.ZaloApiError(
              `File ${fileName} size exceed maximum size of ${shareFileConfig.max_size_share_file_v3}MB`,
            );
          ((uploadData.fileType = "video"),
            (uploadData.fileData = { fileName: fileName, totalSize: videoFileSize }),
            (uploadData.params.totalChunk = Math.ceil(uploadData.fileData.totalSize / chunkSize)),
            (uploadData.params.fileName = fileName),
            (uploadData.params.clientId = clientIdCounter++),
            (uploadData.params.totalSize = videoFileSize),
            (uploadData.params.imei = appContext.imei),
            (uploadData.params.isE2EE = 0),
            (uploadData.params.jxl = 0),
            (uploadData.params.chunkId = 1));
          break;
        default:
          var otherFileSize = isFilePath
            ? await (0, utils_js_1.getFileSize)(source)
            : source.metadata.totalSize;
          if (exceedsMaxSize(otherFileSize))
            throw new ZaloApiError_js_1.ZaloApiError(
              `File ${fileName} size exceed maximum size of ${shareFileConfig.max_size_share_file_v3}MB`,
            );
          ((uploadData.fileType = "others"),
            (uploadData.fileData = { fileName: fileName, totalSize: otherFileSize }),
            (uploadData.params.totalChunk = Math.ceil(uploadData.fileData.totalSize / chunkSize)),
            (uploadData.params.fileName = fileName),
            (uploadData.params.clientId = clientIdCounter++),
            (uploadData.params.totalSize = otherFileSize),
            (uploadData.params.imei = appContext.imei),
            (uploadData.params.isE2EE = 0),
            (uploadData.params.jxl = 0),
            (uploadData.params.chunkId = 1));
      }
      var fileBuffer = isFilePath ? await node_fs_1.default.promises.readFile(source) : source.data;
      for (let i = 0; i < uploadData.params.totalChunk; i++) {
        var formData = new form_data_1.default(),
          chunkData = fileBuffer.subarray(i * chunkSize, (i + 1) * chunkSize);
        (formData.append("chunkContent", chunkData, {
          filename: fileName,
          contentType: "application/octet-stream",
        }),
          (uploadData.chunkContent[i] = formData));
      }
      uploadDataList.push(uploadData);
    }
    let uploadPromises = [],
      uploadResults = [];
    for (let fileUpload of uploadDataList)
      for (let i = 0; i < fileUpload.params.totalChunk; i++) {
        var encryptedParams = api.encodeAES(JSON.stringify(fileUpload.params));
        if (!encryptedParams)
          throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
        (uploadPromises.push(
          api
            .request(
              api.makeURL(uploadEndpoint + urlType[fileUpload.fileType], { type: typeParam, params: encryptedParams }),
              {
                method: "POST",
                headers: fileUpload.chunkContent[i].getHeaders(),
                body: fileUpload.chunkContent[i].getBuffer(),
              },
            )
            .then(async (response) => {
              let uploadResponse = await (0, utils_js_1.resolveResponse)(appContext, response);
              uploadResponse &&
                "-1" != uploadResponse.fileId &&
                "-1" != uploadResponse.photoId &&
                (await new Promise((resolve) => {
                  var imageResult;
                  (("video" != fileUpload.fileType && "others" != fileUpload.fileType) ||
                    appContext.uploadCallbacks.set(uploadResponse.fileId.toString(), async (callbackData) => {
                      callbackData = {
                        fileType: fileUpload.fileType,
                        ...uploadResponse,
                        ...callbackData,
                        totalSize: fileUpload.fileData.totalSize,
                        fileName: fileUpload.fileData.fileName,
                        checksum: (
                          await (0, utils_js_1.getMd5LargeFileObject)(
                            fileUpload.source,
                            fileUpload.fileData.totalSize,
                          )
                        ).data,
                      };
                      (uploadResults.push(callbackData), resolve());
                    }),
                    "image" == fileUpload.fileType &&
                      ((imageResult = {
                        fileType: "image",
                        width: fileUpload.fileData.width,
                        height: fileUpload.fileData.height,
                        totalSize: fileUpload.fileData.totalSize,
                        hdSize: fileUpload.fileData.totalSize,
                        finished: uploadResponse.finished,
                        normalUrl: uploadResponse.normalUrl,
                        hdUrl: uploadResponse.hdUrl,
                        thumbUrl: uploadResponse.thumbUrl,
                        chunkId: uploadResponse.chunkId,
                        photoId: uploadResponse.photoId,
                        clientFileId: uploadResponse.clientFileId,
                      }),
                      uploadResults.push(imageResult),
                      resolve()));
                }));
            }),
        ),
          fileUpload.params.chunkId++);
      }
    return (await Promise.all(uploadPromises), uploadResults);
  };
});
