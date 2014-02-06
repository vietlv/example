/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {
    var LOG = window.LOG, DETAIL = window.DETAIL,
        getFileSystemsInfo, fileReader, fileWriter, getFilePath, getFile, getFileEntry, getFileEntryFromUri,
        getFileSystem, fsDeferred, fs = null,
        loadFilesParallel = true;

    mdc.file = {

        setDebug: function (onoff) {
            if (typeof onoff === "boolean") {
                LOG = !!onoff;
                DETAIL = !!onoff;
            } else if (typeof onoff === "object") {
                LOG = !!onoff.log;
                DETAIL = !!onoff.detail;
            }
        },

        fsInfo: function () {
            LOG && getFileSystemsInfo();
        },

        getData: function (fileNames) {

            LOG && console.log("file: getting data.");
            DETAIL && console.log(JSON.stringify(fileNames));

            var mainDeferred;

            if (loadFilesParallel) {

                mainDeferred = $.map(fileNames, function (fname) {
                       return mdc.file.read(fname);
                });

                return $.when.apply($, mainDeferred).promise();

            } else {
               mainDeferred = new $.Deferred();

               chain = $.map(fileNames, function (fname) {
                   var dfrd = new $.Deferred();
                   return {
                       file: fname,
                       dfrd: dfrd,
                       func: function () {
                           mdc.file.read(fname)
                           .done(function () { dfrd.resolve.apply(dfrd, Array.prototype.slice.apply(arguments)); })
                           .fail(function () { dfrd.reject.apply(dfrd, Array.prototype.slice.apply(arguments)); });
                       }
                   };
               });

               $.each(chain, function (i, itm) {
                   var next;
                   if (i < chain.length - 1) {
                       next = chain[i + 1];
                       itm.dfrd
                       .done(function () {
                           next.func();
                       });
                   } else {
                       itm.dfrd
                       .done(function () {
                           mainDeferred.resolve.apply(finalDfrd, Array.prototype.slice.apply(arguments));
                       });
                   }
                   itm.dfrd
                   .fail(function () {
                       mainDeferred.reject.apply(mainDeferred, Array.prototype.slice.apply(arguments));
                   });
               });

               chain[0].func();

               return mainDeferred.promise();

           }
        },

        quickRead: function (path) {
            var dfrd = new $.Deferred(),
                fr = new FileReader();

            LOG && console.log("file: quick-reading file from path: " + path);

            fr.onload = function (evt) {
                var result = evt.target.result;

                LOG && console.log("file: quick-read done.");
                DETAIL && console.log(JSON.stringify(result));

                dfrd.resolve(result);
            };

            fr.onerror = function (evt) {
                LOG && console.log("file: quick-read error.");
                DETAIL && console.log(JSON.stringify(evt));
                console.log("file: error: " + JSON.stringify(fr.error));
                dfrd.reject(evt.target.error);
            };

            fr.onabort = function (evt) {
                LOG && console.log("file: quick-read aborted.");
                DETAIL && console.log(JSON.stringify(evt));

                dfrd.reject(evt.target);
            };

            fr.readAsDataURL({ fullPath: path });

            return dfrd;
        },

        read: function (fileName) {
            var dfrd = new $.Deferred(),
                fr = fileReader(dfrd);

            LOG && console.log("file: reading file.");
            DETAIL && console.log(fileName);

            getFilePath(fileName)
            .fail(dfrd.reject)
            .done($.proxy(fr.readAsDataURL, fr));

            return dfrd.promise();
        },

        readText: function (fileName) {
            var dfrd = new $.Deferred(),
                fr = fileReader(dfrd);

            LOG && console.log("file: reading text file.");
            DETAIL && console.log(fileName);

            getFilePath(fileName)
            .fail(dfrd.reject)
            .done($.proxy(fr.readAsText, fr));

            return dfrd.promise();
        },

        readJson: function (fileName) {
            var dfrd = new $.Deferred();

            LOG && console.log("file: reading json file.");
            DETAIL && console.log(fileName);

            mdc.file.readText(fileName)
            .done(function (json) {
                var data;
                try {
                    data = JSON.parse(json);
                    LOG && console.log("file: successfully parsed json file.");
                    DETAIL && console.log(JSON.stringify(data));
                    dfrd.resolve(data);
                } catch (exc) {
                    LOG && console.log("file: error while parsing json.");
                    DETAIL && console.log(JSON.stringify(exc));
                    dfrd.reject({ error: "Error parsing JSON.", clue: JSON.stringify(exc) });
                }
            })
            .fail(dfrd.reject);

            return dfrd.promise();
        },

        writeJson: function (fileName, object, format) {
            var content = format ? JSON.stringify(object, null, "    ") : JSON.stringify(object),
                dfrd = new $.Deferred();

            LOG && console.log("file: writing json file.");
            DETAIL && console.log(fileName);

            if (content === null) {
                content = "null";
            } else if (content === undefined) {
                content = "undefined";
            }

            fileWriter(fileName, true)
            .fail(dfrd.reject)
            .done(function (fw) {
                LOG && console.log("file: truncating file to the length of 0");

                fw.onwriteend = function () {
                    LOG && console.log("file: writing json");
                    DETAIL && console.log(content);

                    fw.onwriteend = function () {
                        LOG && console.log("file: file written successfully.");
                        dfrd.resolve();

                    };

                    fw.write(content);
                };

                fw.truncate(0);
            });

            return dfrd.promise();
        },

        moveToDocuments: function (fileUri, setUniqueName, keepOriginal) {
            var dfrd = new $.Deferred(), fileEntryDfrd;

            LOG && console.log("file: moving file to Documents.");
            DETAIL && console.log(fileUri);

            if (!fileUri || typeof fileUri !== "string")
                return dfrd.reject("No file URI.").promise();

            // perhaps it's not a file URI but a full file path...
            if (fileUri.indexOf("/") === 0) {
                // get file entry from full path
                fileEntryDfrd = getFileEntryFromFullPath(fileUri)
            } else {
                // resolve file uri to file entry
                fileEntryDfrd = getFileEntryFromUri(fileUri);
            }

            fileEntryDfrd
            .fail(function (err) {
                // error getting file entry
                LOG && console.log("file: error getting file entry from URI: " + fileUri);
                DETAIL && console.log(JSON.stringify(err));
                dfrd.reject("Error loading file from URI");
            })
            .done(function (fileEntry) {
                var fsPromise = fsDeferred || getFileSystem(),
                    name = fileEntry.name;

                fsPromise
                .fail(dfrd.reject)
                .done(function (fs) {
                    // modify name if required
                    if (setUniqueName) {
                        name = "mdc_" + uniqueId({ length: 6 }) + "_" + name;
                    }
                    // move/copy file entry to root
                    if (keepOriginal) {
                        LOG && console.log("file: copying file to root.");
                        fileEntry.copyTo(fs.root, name, dfrd.resolve, dfrd.reject);
                    } else {
                        LOG && console.log("file: moving file to root.");
                        fileEntry.copyTo(fs.root, name, dfrd.resolve, dfrd.reject);
                    }
                    dfrd.then(
                        function (entry) {
                            LOG && console.log("file: successfully moved/copied file.");
                            DETAIL && console.log(entry && entry.fullPath);
                        },
                        function (err) {
                            LOG && console.log("file: failed copying/moving file.");
                            DETAIL && console.log(JSON.stringify(err));
                        }
                    );
                });
            });

            return dfrd.pipe(function (fileEntry) {
                    return fileEntry && fileEntry.fullPath || null ;
                });
        },

        remove: function (fileUri) {
            var fileEntryDfrd, dfrd = new $.Deferred();

            if (!fileUri || typeof fileUri !== "string") {
                LOG && console.log("file: can't delete file, no file URI.");
                return dfrd.reject("No file URI.").promise();
            }

            // perhaps it's not a file URI but a full file path...
            if (fileUri.indexOf("/") === 0) {
                // get file entry from full path
                fileEntryDfrd = getFileEntryFromFullPath(fileUri)
            } else {
                // resolve file uri to file entry
                fileEntryDfrd = getFileEntryFromUri(fileUri);
            }

            LOG && console.log("file: deleting file.");
            DETAIL && console.log(fileUri);

            fileEntryDfrd
            .fail(function (err) {
                LOG && console.log("file: error deleting file. no file entry.");
                DETAIL && console.log(JSON.stringify(err));
                dfrd.reject("File entry error.");
            })
            .done(function () {
                LOG && console.log("file: file deleted.");
                DETAIL && console.log(fileUri);
                dfrd.resolve("File deleted.");
            });

            return dfrd.promise();
        },

        fullPath: function (relativeToRoot) {
            var path;

            if (!fs)
                return null;

            path = fs.root.fullPath;
            if (path.length && path[path.length - 1] !== "/") {
                path += "/";
            }
            path += relativeToRoot;

            return path;
        }
    };

    fileReader = function (dfrd) {
        var fr = new FileReader();

        fr.onload = function (evt) {

            LOG && console.log("file: file loaded.");
            DETAIL && console.log(JSON.stringify(evt.target.result));

            dfrd.resolve(evt.target.result);
        };

        fr.onerror = function (evt) {

            LOG && console.log("file: file load error.");
            DETAIL && console.log(JSON.stringify(evt.target.error));

            dfrd.reject(evt.target.error);
        };

        fr.onabort = function (evt) {

            LOG && console.log("file: file load abort.");
            DETAIL && console.log(JSON.stringify(evt.target));

            dfrd.reject(evt.target);
        };

        return fr;
    };

    fileWriter = function (fileName, create) {
        var dfrd = new $.Deferred();
        getFileEntry(fileName, create)
        .fail(dfrd.reject)
        .done(function (fe) {
            fe.createWriter(dfrd.resolve, dfrd.reject);
        });

        return dfrd;
    };

    getFilePath = function (fileName) {
        var dfrd = new $.Deferred();

        getFile(fileName)
        .done(function () {
            DETAIL && console.log("file success");
        })
        .fail(function (err) {
            DETAIL && console.log("file failure");
            dfrd.reject({ error: "file error.", clue: JSON.stringify(err) });
        })
        .then(dfrd.resolve, dfrd.reject);

        return dfrd.promise();
    };

    getFile = function (filename) {
        var dfrd = new $.Deferred();

        LOG && console.log("file: getting file from file entry.");

        getFileEntry(filename)
        // file entry success
        .done(function (fe) {
            DETAIL && console.log("file entry success");
            fe.file(dfrd.resolve, dfrd.reject);
        })
        // file entry failure
        .fail(function (err) {
            DETAIL && console.log("file entry failure");
            dfrd.reject({ error: "file entry error.", clue: JSON.stringify(err) });
        });

        return dfrd.promise();
    };

    getFileEntryFromFullPath = function (filePath) {
        var fe;

        fe = new FileEntry(
            filePath.substr(filePath.lastIndexOf("/") + 1), // name
            filePath // full path
        );

        return $.Deferred().resolve(fe);
    }

    getFileEntryFromUri = function (fileUri) {
        var dfrd = new $.Deferred;

        LOG && console.log("file: getting file entry from URI.");
        DETAIL && console.log(JSON.stringify(fileUri));

        window.resolveLocalFileSystemURI(fileUri, dfrd.resolve, dfrd.reject);

        return dfrd;
    };

    getFileEntry = function (fileName, create) {
        var dfrd = new $.Deferred();

        LOG && console.log("file: getting file entry.");
        DETAIL && console.log(JSON.stringify(fileName));

        getFileSystem()
        // fs ready
        .done(function (fs) {
            DETAIL && console.log("file system success");
            fs.root.getFile(
                fileName,
                { create: !!create },
                dfrd.resolve,
                function () {
                    LOG && console.log("file: getting file entry failed.");
                    DETAIL && console.log(JSON.stringify(arguments));
                    dfrd.reject();
                });
        })
        // fs error
        .fail(function (err) {
            DETAIL && console.log("file system failure");
            dfrd.reject({ error: "file system error.", clue: JSON.stringify(err) });
        });

        return dfrd.promise();
    };

    getFileSystem = function () {
        if (!fsDeferred || fsDeferred.state() === "rejected") {
            fsDeferred = new $.Deferred();
            fsDeferred.done(function (fileSys) { fs = fileSys; });
        }

        if (fsDeferred.state() !== "resolved") {
            LOG && console.log("file: getting file system.");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fsDeferred.resolve, fsDeferred.reject);
        }
        return fsDeferred.promise();
    };

    getFileSystemsInfo = function () {
        var pers, temp, dirinfo, maxDepth, dfrds = [], info = {};

        LOG && console.log("file: getting file systems info.");

        pers = new $.Deferred();
        temp = new $.Deferred();

        dfrds.push(pers);
        dfrds.push(temp);

        maxDepth = 10;

        dirinfo = function (dir, old, dfrd, depth) {
            var getParent, d;

            depth = depth || 0;

            if (dir && dir.toURL && depth <= maxDepth) {

                if (old && old.toURL && old.toURL() === dir.toURL()) {
                    dfrd.resolve();
                    return null;
                }

                getParent = new $.Deferred();

                d = {
                    name: dir.name,
                    path: dir.fullPath,
                    uri: dir.toURL(),
                    parent: "unknown"
                };

                getParent.done(function (de) { d.parent = dirinfo(de, dir, dfrd, depth + 1); });
                dfrds.push(getParent);

                dir.getParent(getParent.resolve, getParent.resolve);

                return d;
            } else {
                dfrd.resolve();
                return null;
            }
        };

        window.requestFileSystem(
                LocalFileSystem.PERSISTENT, 0,
                function (fs) { info.persistent = { name: fs.name, root: dirinfo(fs.root, null, pers) }; },
                function (evt) { info.persistent = { error: evt.target.error.code }; pers.resolve(); }
        );

        window.requestFileSystem(
                LocalFileSystem.TEMPORARY, 0,
                function (fs) { info.temporary = { name: fs.name, root: dirinfo(fs.root, null, temp) }; },
                function (evt) { info.temporary = { error: evt.target.error.code }; temp.resolve(); }
        );

        LOG && console.log(JSON.stringify(info));
        $.when.apply($, dfrds)
        .always(function () { console.log(JSON.stringify(info)); })
        .done(function () { mdc.file.fsRoot = info.persistent.root.path; });
    };

}());