/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {

    var LOG = window.LOG, DETAIL = window.DETAIL,
        url, crappyUpload, chunkData, sendChunks, sendChunk, getFileTransferError,
        // baseUrl = "https://192.168.0.17/rest/1/";
        // baseUrl = "https://local.giscloud.com/rest/1/";
        baseUrl = "https://api.giscloud.com/1/";

    mdc.rest = {

        setDebug: function (onoff) {
            if (typeof onoff === "boolean") {
                LOG = !!onoff;
                DETAIL = !!onoff;
            } else if (typeof onoff === "object") {
                LOG = !!onoff.log;
                DETAIL = !!onoff.detail;
            }
        },

        baseUrl: function (url) {
            if (url === undefined) {
                return baseUrl;
            } else {
                baseUrl = url;
            }
        },

        get: function (resource, params, options) {
            var opts = options || {},
                restUrl = url(resource, opts.dontUseApiKey);

            LOG && console.log("rest: getting data from " + restUrl);
            DETAIL && console.log("params: " + JSON.stringify(params));

            return $.getJSON(restUrl, params)
            .pipe(
                // on success
                function (data /*, status, jqxhr*/) {
                    LOG && console.log("rest: successful get.");
                    return data;
                },
                // on failure
                function () {
                    LOG && console.log("rest: get failed.");
                    DETAIL && console.log(JSON.stringify(arguments));
                    return null;
                }
            );
        },

        post: function (resource, data, options) {
            var opts = options || {},
                restUrl = url(resource, opts.dontUseApiKey);

            LOG && console.log("rest: posting data to " + restUrl);
            DETAIL && console.log(JSON.stringify(data));

            return $.ajax({
                url: restUrl,
                type: "POST",
                cache: false,
                dataType: "json",
                accepts : "application/json",
                contentType: "application/json",
                data: JSON.stringify(data)
            })
            .pipe(
                // on success
                function (data, status, jqxhr) {
                    var loc = jqxhr.getResponseHeader("Location");
                    LOG && console.log("rest: successful post. Location: " + loc);
                    if (opts.dontParseLocation) {
                        return { data: data, jqxhr: jqxhr };
                    }
                    return loc;
                },
                // on failure
                function (jqxhr, textStatus, errorThrown) {
                    LOG && console.log("rest: post failed.");
                    DETAIL && console.log(JSON.stringify([jqxhr, textStatus, errorThrown]));
                    return { error: errorThrown, status: jqxhr.status, statusText: jqxhr.statusText };
                }
            );
        },

        del: function (resource, params, options) {
            var opts = options || {},
                restUrl = url(resource, opts.dontUseApiKey);

            LOG && console.log("rest: sending delete to " + restUrl);
            DETAIL && console.log("params: " + JSON.stringify(params));

            return $.ajax({
                url: restUrl,
                type: "DELETE",
                cache: false,
                mimeType: "text/plain",
                data: params
            })
            .pipe(
                // on success
                function (data /*, status, jqxhr*/) {
                    LOG && console.log("rest: successful delete.");
                    return data;
                },
                // on failure
                function () {
                    LOG && console.log("rest: delete failed.");
                    DETAIL && console.log(arguments);
                    return null;
                }
            );
        },

        upload: function (file, name, mapId, mimeType) {
            var destMap = mapId ? "&destination_map=" + mapId : "",
                restUrl = url("/storage/fs/uploads?convert" + destMap),
                ft = new FileTransfer(),
                options = new FileUploadOptions(),
                dfrd = new $.Deferred(),
                preferCrappyUploads = parseInt(mdc.storage.value("crappy"), 10);

            if (preferCrappyUploads) {
                LOG && console.log("rest: crappy upload preferred " + preferCrappyUploads + " more times.");
                return crappyUpload(file, name, mapId, mimeType, preferCrappyUploads);
            }

            LOG && console.log("rest: uploading file " + file + " as " + (name || "?"));

            if (name) {
                options.fileName = name;
            }
            if (mimeType) {
                options.mimeType = mimeType;
            }

            options.fileKey = "file";

            ft.upload(
                // path
                file,
                // url
                encodeURI(restUrl),
                // success handler
                dfrd.resolve,
                // failure handler
                dfrd.reject,
                // options
                options
            );

            // progress handler
            ft.onprogress = $.proxy(dfrd, dfrd.notify);

            // log progress
            dfrd.progress(function (evt) {
                LOG && console.log("rest: upload progress.");
                DETAIL && console.log(JSON.stringify(evt));
            });

            // handle unsuccessful upload
            dfrd.fail(function (response) {
                LOG && console.log(
                    "rest: upload failed. " +
                    getFileTransferError(response && response.code)
                );
                DETAIL && console.log(JSON.stringify(response));

                if (response.http_status === 400 || response.http_status === 403) {
                    // try crappy upload for the next 20 uploads
                    mdc.storage.value("crappy", 20);
                }
            });

            return dfrd.promise();
        },

        fsResourceUrl: function (id, mime) {
            var resource = "storage/fs/" + id + "?source_map=" + mdc.storage.value("selectedMapId");

            if (mime) {
                resource += "&mime=" + mime;
            }

            return url(resource);
        }

    };

    url = function(resource, noApiKey) {
        var key = !noApiKey && mdc.user.apiKey(),
            completeUrl = baseUrl + resource;

        if (key) {
            if (completeUrl.indexOf("?") > -1) {
                completeUrl += "&api_key=" + key;
            } else {
                completeUrl += "?api_key=" + key;
            }
        }

        return completeUrl;
    };

    crappyUpload = function (file, name, mapId, mimeType, crappyCounter) {
        var queue;

        crappyCounter--;
        mdc.storage.value("crappy", crappyCounter);

        queue = giscloud.Queue([
            // read from file
            { func: mdc.file.quickRead, context: mdc.file, params: [file], msg: "File read." },
            // chunk the data
            { func: chunkData, msg: "Data split into chunks."},
            // send chunks
            {
                func: sendChunks,
                params: [name, mapId],
                msg: "Send."
            }
        ]);

        queue.progress(function (msg, stepResult) {
            LOG && console.log("crappy upload: " + msg);
            DETAIL && console.log(JSON.stringify(stepResult));
        });

        return queue.promise();

    };

    chunkData = function (data) {

        if (typeof data !== "string") {
            return $.Deferred().reject();
        }

        var chunkSize,
            maxBytes = 48 * 1024,
            chunks = [],
            rx = /^data:([\w\/]+);base64,/,
            m = data.match(rx),
            mimeType = m && m[1],
            base64data = mimeType ? data.replace(rx, "") : data,
            length = base64data.length;

        LOG && console.log("crappy upload: mimeType is " + (mimeType || "unknown"));

        // split the data into chunks
        do {
            chunkSize = Math.min(maxBytes, length);
            chunks.push(base64data.substr(0, chunkSize));
            base64data = base64data.substr(chunkSize);
            length = base64data.length;
        } while (chunkSize === maxBytes && length > 0);

        LOG && console.log("crappy upload: chunked data to " + chunks.length + " chunks.");

        return $.Deferred().resolve(chunks, mimeType);
    };

    sendChunks = function (chunks, mimeType, name, map) {
        var total = chunks.length,
            unique = uniqueId({ length: 5 }),
            functions = $.map(chunks, function (chunk, i) {
                return function () {
                    return sendChunk(chunk, i + 1, total, name, unique, mimeType, map);
                };
            });

        return giscloud.Queue(functions);
    };

    sendChunk = function (chunk, i, total, name, unique, mimeType, map) {
        var restUrl,
            resource = "/storage/fs/uploads/crappy?",
            params = [
                "convert",
                "chunk_nr=" + i,
                "total_chunks=" + total,
                "name=" + name,
                "unique=" + unique
            ];

        if (map) {
            params.push("destination_map=" + map);
        }

        restUrl = url(resource + params.join("&"));

        LOG && console.log(
            "crappy upload: sending chunk " + i + " of " + total + ". (" + chunk.length + " bytes)"
        );

        return $.ajax({
                url: restUrl,
                type: "POST",
                cache: false,
                contentType: mimeType,
                data: chunk,
                processData: false
            });
    };

    getFileTransferError = function (code) {
        if (code == null) {
            return "No error code";
        }

        switch (code) {
            case FileTransferError.FILE_NOT_FOUND_ERR:
                return "File not found";
            case FileTransferError.INVALID_URL_ERR:
                return "Invalid url";
            case FileTransferError.CONNECTION_ERR:
                return "Connection error";
            case FileTransferError.ABORT_ERR:
                return "Aborted";
            default:
                return "Unknown error. Code: " + JSON.stringify(code);
        }
    };

}());