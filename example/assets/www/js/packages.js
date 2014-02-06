/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {
    var LOG = window.LOG, DETAIL = window.DETAIL,
        bundlePackage, flattenFormGroups, onItemModified, extractFilename, createFilename, current;

    mdc.packages = {

            setDebug: function (onoff) {
                if (typeof onoff === "boolean") {
                    LOG = !!onoff;
                    DETAIL = !!onoff;
                } else if (typeof onoff === "object") {
                    LOG = !!onoff.log;
                    DETAIL = !!onoff.detail;
                }
                mdc.packageItem.setDebug(onoff);
            },

            queue: null,

            current: function () { return current; },

            initQueue: function (restore) {
                this.queue = new mdc.Queue(restore);
            },

            destroyCurrent: function () {
                var key;
                if (current) {
                    if (current.items) {
                        for (key in current.items) {
                            if (current.items[key].detachFromFormItem) {
                                current.items[key].detachFromFormItem();
                            }
                        }
                    }
                    current = null;
                }
            },

            createNew: function (formItems) {
                var i, k, item, formItemsToPackage;

                // destroy existing
                if (current) {
                    LOG && console.log("packages: Destroying current package.");
                    this.destroyCurrent();
                }

                if (formItems === undefined) {
                    formItems = mdc.form.items;
                }

                // create new package
                LOG && console.log("packages: Creating a new package.");

                current = new mdc.Package();

                // flatten group items
                formItemsToPackage = flattenFormGroups(formItems);

                // create package items
                for (i = 0, k = formItemsToPackage.length; i < k; i++) {
                    item = new mdc.PackageItem(formItemsToPackage[i]);
                    current.addItem(item);
                }

                formItemsToPackage = null;

                $(mdc.packages).triggerHandler("packageCreated");
            },

            restore: function (packageData) {
                var p = new mdc.Package();
                LOG && console.log("packages: restoring package.");
                DETAIL && console.log(JSON.stringify(packageData));

                p.id = packageData.id;
                p.modified = packageData.modified;
                p.mapId = packageData.mapId;
                p.layerId = packageData.layerId;

                $.each(packageData.items, function (i, item) {
                    p.items[item.key] = new mdc.PackageItem(item);
                });

                LOG && console.log("packages: package restored.");
                DETAIL && console.log(JSON.stringify(p));

                return p;
            }
    };

    mdc.Package = function () {
            // set defaults
            this.items = {};
            this.modified = $.now();
            this.sent = null;
            this.id = uniqueId();
            this.layerId = parseInt(mdc.storage.value("selectedLayerId"), 10);
            this.mapId = parseInt(mdc.storage.value("selectedMapId"), 10);
            this.locked = false;
    };

    mdc.Package.prototype = {

            addItem: function (item) {
                // add to items
                this.items[item.key] = item;
                $(item).bind("modified", $.proxy(onItemModified, this));
                return this;
            },

            removeItem: function (key) {
                delete this.items[key];
                return this;
            },

            isFull: function () {
                var key, item;
                for (key in this.items) {
                    item = this.items[key];
                    if (item.vital && !item.value) {
                        return false;
                    }
                }
                return true;
            },

            whatIsMissing: function () {
                return $.map(this.items, function (item) {
                    return (item.vital && !item.value) ? __(item.name) : null;
                });
            },

            validationError: function () {
                var idx, item, msg;

                for (idx in this.items) {
                    if (!this.items.hasOwnProperty(idx)) continue;
                    item = this.items[idx];
                    msg = item.validationError();
                    if (msg) {
                        return {
                            name: item.name,
                            key: item.key,
                            message: msg
                        };
                    }
                }

                return null;
            },

            load: function () {
                var loading = $.map(this.items, function (item) { return item.load(); });
                // return a combined promise
                return $.when.apply($, loading).promise();
            },

            loadMdcItemValues: function () {
                var key, item;
                for (key in this.items) {
                    item = this.items[key];
                    if (item.type.indexOf("mdc") === 0) {
                        item.load();
                    }
                }
            },

            lock: function () {
                this.locked = true;
                $.each(this.items, function (i, itm) { itm.lock(); });
            },

            send: function () {
                var bundle, uploadDeferred,
                    dfrd = new $.Deferred(),
                    mapId = this.mapId || mdc.storage.value("selectedMapId"),
                    layerId = this.layerId || mdc.storage.value("selectedLayerId");

                LOG && console.log("packages: Send!");

                // check network status
                if (!mdc.net.isAvailable()) {
                    // fail because of network
                    LOG && console.log("packages: No network available. Not sending.");
                    return dfrd
                        .reject({ reason: "network", clue: { networkAvailable: mdc.net.isAvailable() } })
                        .promise();
                }

                LOG && console.log("packages: Network is available: " + mdc.net.connectionType());

                // compile package data
                bundle = bundlePackage(this);

                // convert array data to strings
                $.each(bundle.data, function (key, val) {
                    if ($.isArray(val)) {
                        bundle.data[key] = val.join(",");
                    }
                });

                // upload files
                if (bundle.files.length) {
                    uploadDeferred = $.when.apply($, $.map(bundle.files, function (file) {
                        var name = file.filename, path = file.path;
                        LOG && console.log("packages: Uploading file " + name + " (" + path + ")");
                        return mdc.rest.upload(path, name, mapId);
                    }));
                } else {
                    uploadDeferred = $.Deferred().resolve();
                }

                // if upload succeeded, create feature; otherwise fail
                uploadDeferred
                // --> fail
                .fail(dfrd.reject)
                // --> create feature
                .done(function () {
                    LOG && console.log("packages: Creating a new feature");

                    // create feature
                    mdc.rest.post(
                        "layers/" + layerId + "/features.json?srid=4326",
                        {
                            geometry: bundle.geometry,
                            data: bundle.data,
                            mdc_info: bundle.mdcInfo
                        }
                    )
                    // reject dfrd on failure
                    .fail(function () {
                        LOG && console.log("packages: Error creating feature.");
                        DETAIL && console.log(JSON.stringify(arguments));
                        dfrd.reject();
                    })
                    // resolve and clear cache
                    .done(function () {
                        dfrd.resolve();
                        LOG && console.log("packages: Feature created. Clearing layer cache.");
                        mdc.rest.del("map_cache/" + mapId + "/2?layers=" + layerId);
                    })
                    // delete sent files from device on iOS
                    .done(function () {
                        if (device.platform === "iOS") {
                            if (bundle.files.length) {
                                LOG && console.log("packages: deleting sent files.");
                                DETAIL && console.log(JSON.stringify(bundle.files));
                                giscloud.Queue($.map(bundle.files, function (file) {
                                    return (function () {
                                            return file && file.path &&
                                                mdc.file.remove(file.path) ||
                                                $.Deferred().resolve();
                                        });
                                }));
                            }
                        }
                    });

                });

                return dfrd
                    .done(function () {
                        LOG && console.log("packages: Sending completed.");
                        DETAIL && console.log(JSON.stringify(arguments));
                    })
                    .fail(function () {
                        LOG && console.log("packages: Sending failed.");
                        DETAIL && console.log(JSON.stringify(arguments));
                    }).progress(function () {
                        LOG && console.log("packages: Sending progress");
                        DETAIL && console.log(JSON.stringify(arguments));
                    });
            }
    };

    flattenFormGroups = function (formItems) {
        return $.map(formItems, function (item) {
            if (item.items) {
                return flattenFormGroups(item.items);
            } else {
                return item;
            }
        });
    };

    onItemModified = function () {
        if (this.locked) {
            LOG && console.log("package: tried to modify locked package.");
            return;
        }

        DETAIL && console.log("package: modified.");
        this.modified = $.now();
    };

    bundlePackage = function (pack) {
        var i, item, filename, mdcInfo,
            correctPath = function (path) {
                var filename;

                if (device.platform !== "iOS")
                    return path;

                filename = path.substr(path.lastIndexOf("/") + 1);
                return mdc.file.fullPath(filename);
            },
            handleFileTypes = function (i, path) {
                var filename = createFilename(path, item.type);
                bundle.data[item.target || item.key].push(filename);
                bundle.files.push({ path: correctPath(path), filename: filename });
            },
            bundle = {
                srid: "4326",
                geometry: null,
                data: {},
                files: [],
                mdc_info: {}
            };

        LOG && console.log("package: bundling package.");

        for (i in pack.items) {
            item = pack.items[i];

            if (item.value == null) {
                continue;
            }

            if (item.type === "location") {

                bundle.geometry = "POINT (" + item.value.longitude + " " + item.value.latitude + ")";

            } else if (item.loadType === "single_file") {

                filename = createFilename(item.value, item.type);
                if (mdc.settings.value("useNativeAudioRecording")) {
                    bundle.files.push({ path: correctPath(item.value), filename: filename });
                } else {
                    bundle.files.push({
                        path: correctPath(item.value),
                        filename: filename });
                }

                if (item.type === "recording" || item.type === "audio") {
                    // change extension to mp3 for audio files
                    filename = filename.replace(/(\.\w+$)|($)/, ".mp3");  // this alse appends '.mp3' if there's no extension at all
                }

                if (item.target) {
                    if (!bundle.data[item.target]) {
                        bundle.data[item.target] = [filename];
                    } else {
                        bundle.data[item.target].push(filename);
                    }
                } else {
                    bundle.data[item.key] = filename;
                }
            } else if (item.loadType === "file") {
                if (item.value && item.value.length) {
                    bundle.data[item.target || item.key] = [];
                    $.each(item.value, handleFileTypes);
                }
            } else {
                bundle.data[item.key] = item.value;
            }
        }

        mdcInfo = new mdc.MdcInfo("insert");

        if (bundle.files.length) {
            mdcInfo.value(
                "uploaded_files",
                $.map(bundle.files, function (itm) { return itm.filename; }).join()
            );
        }

        bundle.mdcInfo = mdcInfo.data();

        DETAIL && console.log(JSON.stringify(bundle));

        return bundle;
    };

    extractFilename = function (path) {
        return path && path.substring(path.lastIndexOf("/") + 1);
    };

    createFilename = function (path, itemType) {
        var name, extension, extPos,
            filename = extractFilename(path);

        extPos = filename.lastIndexOf(".");
        if (extPos > -1) {
            extension = filename.substring(extPos);
            filename = filename.substring(0, extPos);
        } else {
            extension = "";
        }

        switch (itemType) {
            case "photo":
            case "photos":
                name = "mdc_photo_";
                extension = extension || ".jpg";
                break;
            case "audio":
            case "recording":
                name = "mdc_recording_";
                break;
            default:
                name = "mdc_file_";
        }

        return name + filename + "_" + $.now() + extension;
    };

}());



(function () {

    var LOG = window.LOG, DETAIL = window.DETAIL,
        valueChangeHandler, cutBase64prefix, getMdcTypeValue;

    mdc.packageItem = {

        setDebug: function (onoff) {
            if (typeof onoff === "boolean") {
                LOG = !!onoff;
                DETAIL = !!onoff;
            } else if (typeof onoff === "object") {
                LOG = !!onoff.log;
                DETAIL = !!onoff.detail;
            }
        }
    };

    mdc.PackageItem = function (item) {
        var changeHandler;

        this.locked = false;

        if (item instanceof mdc.FormItem) {

            // tie to a form item
            this.name = item.name;
            this.type = item.type;
            this.loadType = item.loadType;
            this.key = item.key;
            this.vital = item.required;
            this.value = item.value;
            this.target = item.target;

            changeHandler = $.proxy(valueChangeHandler, this);

            $(item).bind("valueChange", changeHandler);

            this.detachFromFormItem = function () {
                $(item).unbind("valueChange", changeHandler);
            };

        } else {

            // copy data from an object (probably during a restore operation)
            this.name = item.name;
            this.type = item.type;
            this.loadType = item.loadType;
            this.key = item.key;
            this.value = item.value;
            this.target = item.target;

        }
    };

    mdc.PackageItem.prototype = {

            lock: function () { this.locked = true; },

            load: function () {
                var dfrd, that = this;

                if (this.type.indexOf("mdc") === 0) {

                    this.value = getMdcTypeValue(this.type);
                    return $.Deferred().resolve(this).promise();

                } else if (this.value) {

                    if (this.loadType === "immediate") {

                        return $.Deferred().resolve(this).promise();

                    } else if (this.loadType === "single_file") {

                        dfrd = new $.Deferred();

                        // get value from file
                        mdc.file.read(this.value).then(

                                // on file load success
                                function (data) {
                                    // remove 'base64' from strings and save data
                                    that.data = cutBase64prefix(data);
                                    // sound the horn
                                    dfrd.resolve(that);
                                },

                                // on file load failure
                                function (err) {
                                    dfrd.reject({ reason: "file load", clue: err });
                                }
                        );

                        return dfrd.promise();
                    } else if (this.loadType === "file") {

                        dfrd = new $.Deferred();

                        // get value from file(s)
                        mdc.file.getData(this.value).then(

                                // on file load success
                                function () {
                                    // save data
                                    that.data = Array.prototype.slice.call(arguments, 0);
                                    // remove 'base64' from strings
                                    that.data = $.map(that.data, cutBase64prefix);
                                    // sound the horn
                                    dfrd.resolve(that);
                                },

                                // on file load failure
                                function (err) {
                                    dfrd.reject({ reason: "file load", clue: err });
                                }
                        );

                        return dfrd.promise();
                    } else {
                        // god knows what...
                        throw { error: "Unknown item type." };
                    }
                } else {

                    if (this.vital) {
                        return $.Deferred().reject("No data").promise();
                    } else {
                        $.Deferred().resolve(this).promise();
                    }
                }
            },

            validationError: function () {
                if (this.type === "numeric" || this.type === "number") { // only validate number fields
                    if(!isNaN(parseFloat(this.value))) {
                        if (isInt(this.value)) { // for now, only validate integers
                            if (this.value[0] === "-" && (this.value.length > 11 || parseInt(this.value, 10) < -2147483648)) {
                                return _("integer too small validation message");
                            }
                            if (this.value.length > 10 || parseInt(this.value, 10) > 2147483647) {
                                return _("integer too big validation message");
                            }
                        }
                    }
                }
                return null;
            }
    };

    getMdcTypeValue = function (itemType) {
        switch (itemType) {
            case "mdcDeviceId":
                return mdc.settings.value("deviceId");
            case "mdcDevicePlatform":
                return device.mock ? null : device.platform;
            case "mdcDeviceVersion":
                return device.mock ? null : device.version;
            case "mdcDeviceModel":
                return device.mock ? null : device.model;
            case "mdcLocationLat":
                return mdc.location.current && mdc.location.current.latitude;
            case "mdcLocationLon":
                return mdc.location.current && mdc.location.current.longitude;
            case "mdcLocationAcc":
                return mdc.location.current && mdc.location.current.accuracy;
            case "mdcLocationAlt":
                return mdc.location.current && mdc.location.current.altitude;
            case "mdcLocationHeading":
                return mdc.location.current && mdc.location.current.heading;
            case "mdcLocationSpeed":
                return mdc.location.current && mdc.location.current.speed;
            case "mdcCompassHeading":
                return mdc.location.current && mdc.location.current.compassHeading;
            case "mdcLocationAltAcc":
                return mdc.location.current && mdc.location.current.altitudeAccuracy;
            case "mdcLocationTime":
                return mdc.location.current &&
                    Math.round(mdc.location.current.time.getTime() / 1000);
            case "mdcLocationTimeZone":
                return mdc.location.current &&
                    mdc.location.current.time.getTimezoneOffset();
            case "mdcUsername":
                return mdc.storage.value("currentUserData").username;
            case "mdcUserId":
                return mdc.storage.value("currentUserData").id;
            default:
                return null;
        }
    };

    valueChangeHandler = function (jqevt, val) {
        if (this.locked) {
            LOG && console.log("package item (" + JSON.stringify(this.name) + "): trying to change locked item value.");
            return;
        }
        DETAIL && console.log("package item (" + JSON.stringify(this.name) + "): value = " + JSON.stringify(val));
        this.value = val;
        $(this).triggerHandler("modified");
    };

    cutBase64prefix = function (b64) {
        var m = b64.match(/base64\,(.+)/);
        return (m && m[1]) || b64;
    };

}());