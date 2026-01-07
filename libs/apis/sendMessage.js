var TextStyle,
  Urgency,
  __importDefault =
    (this && this.__importDefault) ||
    function (module) {
      return module && module.__esModule ? module : { default: module };
    };
(Object.defineProperty(exports, "__esModule", { value: !0 }),
  (exports.sendMessageFactory = exports.Urgency = exports.TextStyle = void 0));
let form_data_1 = __importDefault(require("form-data")),
  promises_1 = __importDefault(require("node:fs/promises")),
  ZaloApiError_js_1 = require("../Errors/ZaloApiError.js"),
  index_js_1 = require("../models/index.js"),
  utils_js_1 = require("../utils.js"),
  attachmentUrlType = {
    image: "photo_original/send?",
    gif: "gif?",
    video: "asyncfile/msg?",
    others: "asyncfile/msg?",
  };
function prepareQMSGAttach(quoteMessage) {
  return "string" == typeof quoteMessage.content
    ? quoteMessage.propertyExt
    : "chat.todo" == quoteMessage.msgType
      ? {
          properties: {
            color: 0,
            size: 0,
            type: 0,
            subType: 0,
            ext: '{"shouldParseLinkOrContact":0}',
          },
        }
      : {
          ...quoteMessage.content,
          thumbUrl: quoteMessage.content.thumb,
          oriUrl: quoteMessage.content.href,
          normalUrl: quoteMessage.content.href,
        };
}
function prepareQMSG(quoteMessage) {
  return "chat.todo" == quoteMessage.msgType &&
    "object" == typeof quoteMessage.content &&
    "string" == typeof quoteMessage.content.params
    ? JSON.parse(quoteMessage.content.params).item.content
    : "";
}
(((style) => {
  ((style.Bold = "b"),
    (style.Italic = "i"),
    (style.Underline = "u"),
    (style.StrikeThrough = "s"),
    (style.Red = "c_db342e"),
    (style.Orange = "c_f27806"),
    (style.Yellow = "c_f7b503"),
    (style.Green = "c_15a85f"),
    (style.Small = "f_13"),
    (style.Big = "f_18"),
    (style.UnorderedList = "lst_1"),
    (style.OrderedList = "lst_2"),
    (style.Indent = "ind_$"));
})(TextStyle || (exports.TextStyle = TextStyle = {})),
  ((urgencyEnum) => {
    ((urgencyEnum[(urgencyEnum.Default = 0)] = "Default"),
      (urgencyEnum[(urgencyEnum.Important = 1)] = "Important"),
      (urgencyEnum[(urgencyEnum.Urgent = 2)] = "Urgent"));
  })(Urgency || (exports.Urgency = Urgency = {})),
  (exports.sendMessageFactory = (0, utils_js_1.apiFactory)()((serviceUrls, appContext, api) => {
    let endpoints = {
        message: {
          [index_js_1.ThreadType.User]: api.makeURL(
            serviceUrls.zpwServiceMap.chat[0] + "/api/message",
            { nretry: 0 },
          ),
          [index_js_1.ThreadType.Group]: api.makeURL(
            serviceUrls.zpwServiceMap.group[0] + "/api/group",
            { nretry: 0 },
          ),
        },
        attachment: {
          [index_js_1.ThreadType.User]:
            serviceUrls.zpwServiceMap.file[0] + "/api/message/",
          [index_js_1.ThreadType.Group]:
            serviceUrls.zpwServiceMap.file[0] + "/api/group/",
        },
      },
      shareFileConfig = appContext.settings.features.sharefile;
    async function sendRequests(requestConfigs) {
      var results = [];
      for (let config of (requestConfigs = Array.isArray(requestConfigs) ? requestConfigs : [requestConfigs]))
        results.push(
          (async () => {
            var response = await api.request(config.url, {
              method: "POST",
              body: config.body,
              headers: config.headers,
            });
            return (0, utils_js_1.resolveResponse)(appContext, response);
          })(),
        );
      return Promise.all(results);
    }
    function processMentions(threadType, message, mentions) {
      let totalMentionLength = 0;
      var mentionsFinal =
        Array.isArray(mentions) && threadType == index_js_1.ThreadType.Group
          ? mentions
              .filter((mention) => 0 <= mention.pos && mention.uid && 0 < mention.len)
              .map(
                (mention) => (
                  (totalMentionLength += mention.len),
                  {
                    pos: mention.pos,
                    uid: mention.uid,
                    len: mention.len,
                    type: "-1" == mention.uid ? 1 : 0,
                  }
                ),
              )
          : [];
      if (totalMentionLength > message.length)
        throw new ZaloApiError_js_1.ZaloApiError(
          "Invalid mentions: total mention characters exceed message length",
        );
      return { mentionsFinal: mentionsFinal, msgFinal: message };
    }
    function applyUrgency(params, urgencyLevel) {
      (urgencyLevel != Urgency.Important && urgencyLevel != Urgency.Urgent) ||
        Object.assign(params, { metaData: { urgency: urgencyLevel } });
    }
    async function buildTextMessage(
      { msg: message, styles: textStyles, urgency: urgencyLevel, mentions: mentionsList, quote: quoteMessage, ttl: timeToLive },
      threadId,
      threadType,
    ) {
      if (!message || 0 == message.length)
        throw new ZaloApiError_js_1.ZaloApiError("Missing message content");
      var isGroupThread = threadType == index_js_1.ThreadType.Group,
        { mentionsFinal: processedMentions, msgFinal: finalMessage } = processMentions(threadType, message, mentionsList);
      if (((message = finalMessage), quoteMessage)) {
        if ("string" != typeof quoteMessage.content && "webchat" == quoteMessage.msgType)
          throw new ZaloApiError_js_1.ZaloApiError(
            "This kind of `webchat` quote type is not available",
          );
        if ("group.poll" == quoteMessage.msgType)
          throw new ZaloApiError_js_1.ZaloApiError(
            "The `group.poll` quote type is not available",
          );
      }
      var hasMentions = 0 < processedMentions.length && isGroupThread,
        messageParams = quoteMessage
          ? {
              toid: isGroupThread ? void 0 : threadId,
              grid: isGroupThread ? threadId : void 0,
              message: message,
              clientId: Date.now(),
              mentionInfo: hasMentions ? JSON.stringify(processedMentions) : void 0,
              qmsgOwner: quoteMessage.uidFrom,
              qmsgId: quoteMessage.msgId,
              qmsgCliId: quoteMessage.cliMsgId,
              qmsgType: (0, utils_js_1.getClientMessageType)(quoteMessage.msgType),
              qmsgTs: quoteMessage.ts,
              qmsg: "string" == typeof quoteMessage.content ? quoteMessage.content : prepareQMSG(quoteMessage),
              imei: isGroupThread ? void 0 : appContext.imei,
              visibility: isGroupThread ? 0 : void 0,
              qmsgAttach: isGroupThread ? JSON.stringify(prepareQMSGAttach(quoteMessage)) : void 0,
              qmsgTTL: quoteMessage.ttl,
              ttl: null != timeToLive ? timeToLive : 0,
            }
          : {
              message: message,
              clientId: Date.now(),
              mentionInfo: hasMentions ? JSON.stringify(processedMentions) : void 0,
              imei: isGroupThread ? void 0 : appContext.imei,
              ttl: null != timeToLive ? timeToLive : 0,
              visibility: isGroupThread ? 0 : void 0,
              toid: isGroupThread ? void 0 : threadId,
              grid: isGroupThread ? threadId : void 0,
            },
        encryptedParams =
          ((hasMentions = messageParams),
          (processedMentions = textStyles) &&
            Object.assign(hasMentions, {
              textProperties: JSON.stringify({
                styles: processedMentions.map((style) => {
                  var styleObj = {
                    ...style,
                    indentSize: void 0,
                    st:
                      style.st == TextStyle.Indent
                        ? TextStyle.Indent.replace(
                            /\$/g,
                            `${null != (styleObj = style.indentSize) ? styleObj : 1}0`,
                          )
                        : style.st,
                  };
                  return ((0, utils_js_1.removeUndefinedKeys)(styleObj), styleObj);
                }),
                ver: 0,
              }),
            }),
          applyUrgency(messageParams, urgencyLevel),
          (0, utils_js_1.removeUndefinedKeys)(messageParams),
          api.encodeAES(JSON.stringify(messageParams)));
      if (encryptedParams)
        return (
          ((threadId = new URL(endpoints.message[threadType])).pathname = quoteMessage
            ? threadId.pathname + "/quote"
            : threadId.pathname +
              "/" +
              (isGroupThread ? (messageParams.mentionInfo ? "mention" : "sendmsg") : "sms")),
          { url: threadId.toString(), body: new URLSearchParams({ params: encryptedParams }) }
        );
      throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
    }
    async function buildAttachmentMessage(
      { msg: message, attachments: attachmentList, mentions: mentionsList, quote: quoteMessage, ttl: timeToLive, urgency: urgencyLevel },
      threadId,
      threadType,
    ) {
      if (!attachmentList) throw new ZaloApiError_js_1.ZaloApiError("Missing attachments");
      if (0 == (attachmentList = Array.isArray(attachmentList) ? attachmentList : [attachmentList]).length)
        throw new ZaloApiError_js_1.ZaloApiError("Missing attachments");
      var firstAttachment = attachmentList[0];
      let isFilePath = "string" == typeof firstAttachment;
      var fileExtension = (0, utils_js_1.getFileExtension)(isFilePath ? firstAttachment : firstAttachment.filename),
        isSingleAttachment = 1 == attachmentList.length,
        isGroupThread = threadType == index_js_1.ThreadType.Group,
        isSingleImage = isSingleAttachment && ["jpg", "jpeg", "png", "webp"].includes(fileExtension),
        gifAttachments = attachmentList.filter(
          (attachment) =>
            "gif" ==
            (0, utils_js_1.getFileExtension)(
              "string" == typeof attachment ? attachment : attachment.filename,
            ),
        ),
        uploadedFiles =
          0 ==
          (attachmentList = attachmentList.filter(
            (attachment) =>
              "gif" !=
              (0, utils_js_1.getFileExtension)(
                "string" == typeof attachment ? attachment : attachment.filename,
              ),
          )).length
            ? []
            : await serviceUrls.uploadAttachment(attachmentList, threadId, threadType),
        requestConfigs = [];
      let groupIdxCounter = uploadedFiles.length - 1;
      var uploadedFile,
        gifAttachment,
        groupLayoutId = Date.now(),
        { mentionsFinal: processedMentions, msgFinal: finalMessage } = processMentions(threadType, message, mentionsList),
        hasMentionsForImage = ((message = finalMessage), 0 < processedMentions.length && isGroupThread && 1 == attachmentList.length),
        isMultipleAttachments = 1 < attachmentList.length;
      let clientIdCounter = Date.now();
      for (uploadedFile of uploadedFiles) {
        let attachmentParams;
        switch (uploadedFile.fileType) {
          case "image":
            attachmentParams = {
              fileType: uploadedFile.fileType,
              params: {
                photoId: uploadedFile.photoId,
                clientId: (clientIdCounter++).toString(),
                desc: message,
                width: uploadedFile.width,
                height: uploadedFile.height,
                toid: isGroupThread ? void 0 : String(threadId),
                grid: isGroupThread ? String(threadId) : void 0,
                rawUrl: uploadedFile.normalUrl,
                hdUrl: uploadedFile.hdUrl,
                thumbUrl: uploadedFile.thumbUrl,
                oriUrl: isGroupThread ? uploadedFile.normalUrl : void 0,
                normalUrl: isGroupThread ? void 0 : uploadedFile.normalUrl,
                hdSize: String(uploadedFile.totalSize),
                zsource: -1,
                ttl: null != timeToLive ? timeToLive : 0,
                jcp: '{"convertible":"jxl"}',
                groupLayoutId: isMultipleAttachments ? groupLayoutId : void 0,
                isGroupLayout: isMultipleAttachments ? 1 : void 0,
                idInGroup: isMultipleAttachments ? groupIdxCounter-- : void 0,
                totalItemInGroup: isMultipleAttachments ? uploadedFiles.length : void 0,
                mentionInfo: hasMentionsForImage && isSingleImage && !quoteMessage ? JSON.stringify(processedMentions) : void 0,
              },
              body: new URLSearchParams(),
            };
            break;
          case "video":
          case "others":
            attachmentParams = {
              fileType: uploadedFile.fileType,
              params: {
                fileId: uploadedFile.fileId,
                checksum: uploadedFile.checksum,
                checksumSha: "",
                extention: (0, utils_js_1.getFileExtension)(uploadedFile.fileName),
                totalSize: uploadedFile.totalSize,
                fileName: uploadedFile.fileName,
                clientId: uploadedFile.clientFileId,
                fType: 1,
                fileCount: 0,
                fdata: "{}",
                toid: isGroupThread ? void 0 : String(threadId),
                grid: isGroupThread ? String(threadId) : void 0,
                fileUrl: uploadedFile.fileUrl,
                zsource: -1,
                ttl: null != timeToLive ? timeToLive : 0,
              },
              body: new URLSearchParams(),
            };
        }
        (applyUrgency(attachmentParams.params, urgencyLevel), (0, utils_js_1.removeUndefinedKeys)(attachmentParams.params));
        var encryptedParams = api.encodeAES(JSON.stringify(attachmentParams.params));
        if (!encryptedParams)
          throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
        (attachmentParams.body.append("params", encryptedParams), requestConfigs.push(attachmentParams));
      }
      for (gifAttachment of gifAttachments) {
        let isGifPath = "string" == typeof gifAttachment;
        var gifMetadata = isGifPath
          ? await (0, utils_js_1.getGifMetaData)(appContext, gifAttachment)
          : { ...gifAttachment.metadata, fileName: gifAttachment.filename };
        if (gifMetadata.totalSize > 1024 * shareFileConfig.max_size_share_file_v3 * 1024)
          throw new ZaloApiError_js_1.ZaloApiError(
            `File ${isGifPath ? (0, utils_js_1.getFileName)(gifAttachment) : gifAttachment.filename} size exceed maximum size of ${shareFileConfig.max_size_share_file_v3}MB`,
          );
        var thumbUploadResponse = await (async (gifFile, baseUrl) => {
            var formData = new form_data_1.default(),
              fileBuffer =
                "string" == typeof gifFile
                  ? await promises_1.default.readFile(gifFile)
                  : gifFile.data,
              thumbParams =
                (formData.append("fileContent", fileBuffer, {
                  filename: "blob",
                  contentType: "image/png",
                }),
                { clientId: Date.now(), imei: appContext.imei });
            if ((thumbParams = api.encodeAES(JSON.stringify(thumbParams))))
              return (
                (baseUrl = await api.request(api.makeURL(baseUrl + "upthumb?", { params: thumbParams }), {
                  method: "POST",
                  headers: formData.getHeaders(),
                  body: formData.getBuffer(),
                })),
                (0, utils_js_1.resolveResponse)(appContext, baseUrl)
              );
            throw new ZaloApiError_js_1.ZaloApiError(
              "Failed to encrypt message",
            );
          })(gifAttachment, endpoints.attachment[index_js_1.ThreadType.User]),
          gifFormData = new form_data_1.default(),
          gifParams =
            (gifFormData.append(
              "chunkContent",
              isGifPath ? await promises_1.default.readFile(gifAttachment) : gifAttachment.data,
              {
                filename: isGifPath ? (0, utils_js_1.getFileName)(gifAttachment) : gifAttachment.filename,
                contentType: "application/octet-stream",
              },
            ),
            {
              clientId: Date.now().toString(),
              fileName: gifMetadata.fileName,
              totalSize: gifMetadata.totalSize,
              width: gifMetadata.width,
              height: gifMetadata.height,
              msg: message,
              type: 1,
              ttl: null != timeToLive ? timeToLive : 0,
              visibility: isGroupThread ? 0 : void 0,
              toid: isGroupThread ? void 0 : threadId,
              grid: isGroupThread ? threadId : void 0,
              thumb: thumbUploadResponse.url,
              checksum: (
                await (0, utils_js_1.getMd5LargeFileObject)(gifAttachment, gifMetadata.totalSize)
              ).data,
              totalChunk: 1,
              chunkId: 1,
            }),
          encryptedGifParams =
            (applyUrgency(gifParams, urgencyLevel),
            (0, utils_js_1.removeUndefinedKeys)(gifParams),
            api.encodeAES(JSON.stringify(gifParams)));
        if (!encryptedGifParams)
          throw new ZaloApiError_js_1.ZaloApiError("Failed to encrypt message");
        requestConfigs.push({
          query: { params: encryptedGifParams, type: "1" },
          body: gifFormData.getBuffer(),
          headers: gifFormData.getHeaders(),
          fileType: "gif",
        });
      }
      var requestConfig,
        finalRequests = [];
      for (requestConfig of requestConfigs)
        finalRequests.push({
          url: api.makeURL(
            endpoints.attachment[threadType] + attachmentUrlType[requestConfig.fileType],
            Object.assign({ nretry: "0" }, requestConfig.query || {}),
          ),
          body: requestConfig.body,
          headers: "gif" == requestConfig.fileType ? requestConfig.headers : {},
        });
      return finalRequests;
    }
    return async function (messageInput, threadId, threadType = index_js_1.ThreadType.User) {
      if (!messageInput)
        throw new ZaloApiError_js_1.ZaloApiError("Missing message content");
      if (!threadId) throw new ZaloApiError_js_1.ZaloApiError("Missing threadId");
      let {
        msg: message,
        attachments: attachmentList,
        mentions: mentionsList,
      } = (messageInput = "string" == typeof messageInput ? { msg: messageInput } : messageInput);
      var fileExtension,
        { quote: quoteMessage, ttl: timeToLive, styles: textStyles, urgency: urgencyLevel } = messageInput;
      if (
        (attachmentList && !Array.isArray(attachmentList) && (attachmentList = [attachmentList]), !(message || (attachmentList && (attachmentList, 0 != attachmentList.length))))
      )
        throw new ZaloApiError_js_1.ZaloApiError("Missing message content");
      if (attachmentList && attachmentList.length > shareFileConfig.max_file)
        throw new ZaloApiError_js_1.ZaloApiError(
          "Exceed maximum file of " + shareFileConfig.max_file,
        );
      let result = { message: null, attachment: [] };
      return (
        attachmentList &&
          0 < attachmentList.length &&
          ((fileExtension = (0, utils_js_1.getFileExtension)(
            "string" == typeof attachmentList[0] ? attachmentList[0] : attachmentList[0].filename,
          )),
          ((!(1 == attachmentList.length && ["jpg", "jpeg", "png", "webp"].includes(fileExtension)) &&
            0 < message.length) ||
            (0 < message.length && quoteMessage)) &&
            (await buildTextMessage(messageInput, threadId, threadType).then(async (request) => {
              result.message = (await sendRequests(request))[0];
            }),
            (message = ""),
            (mentionsList = void 0)),
          (fileExtension = await buildAttachmentMessage(
            {
              msg: message,
              mentions: mentionsList,
              attachments: attachmentList,
              quote: quoteMessage,
              ttl: timeToLive,
              styles: textStyles,
              urgency: urgencyLevel,
            },
            threadId,
            threadType,
          )),
          (result.attachment = await sendRequests(fileExtension)),
          (message = "")),
        0 < message.length && ((quoteMessage = await buildTextMessage(messageInput, threadId, threadType)), (result.message = (await sendRequests(quoteMessage))[0])),
        result
      );
    };
  })));
