/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {

    var LOG = window.LOG, DETAIL = window.DETAIL,
        keyExists, get, getMany, set, setMany, writeStorageToFile,
        storFile = "giscloud_mdc.stor",
        writeQueued = false,
        writing = (new $.Deferred()).resolve(),
        data = {},
        useLocalStorage = true;

    mdc.storage = {

            setDebug: function (onoff) {
                if (typeof onoff === "boolean") {
                    LOG = !!onoff;
                    DETAIL = !!onoff;
                } else if (typeof onoff === "object") {
                    LOG = !!onoff.log;
                    DETAIL = !!onoff.detail;
                }
            },

            init: function (opts) {
                var dfrd = new $.Deferred();

                if (opts && opts.useLocalStorage) {
                    LOG && console.log("storage: no init needed. using localStorage.");
                    useLocalStorage = true;
                    return dfrd.resolve();
                }

                LOG && console.log("storage: initializing storage.");
                useLocalStorage = false;

                // try to get the storage file
                mdc.file.readJson(storFile)
                .fail(function () {
                    // create new storage file
                    LOG && console.log("storage: storage not found. creating new storage file.");
                    mdc.file.writeJson(storFile, {})
                    .done(function () {
                        LOG && console.log("storage: new storage file created.");
                        dfrd.resolve();
                    })
                    .fail(function () {
                        LOG && console.log("storage: failed to create a new storage file.");
                        dfrd.reject();
                    });
                })
                .done(function (storageData) {
                    LOG && console.log("storage: retrieved storage from file.");
                    DETAIL && console.log(JSON.stringify(storageData));
                    data = storageData;
                    dfrd.resolve();
                });

                dfrd
                .done(function () {
                    LOG && console.log("storage: init success.");
                })
                .fail(function () {
                    LOG && console.log("storage: init failure.");
                });

                return dfrd.promise();
            },

            has: function (key) {
                return keyExists(key);
            },

            value: function (key, val) {
                if (val === undefined) {
                    return $.isArray(key) ? getMany(key) : get(key);
                } else {
                    return set(key, val);
                }
            },

            remove: function (key) {
                return remove(key);
            },

            all: function () {
                return data;
            },

            clear: function (filter) {
                return removeAll(filter);
            }
    };

    keyExists = function (key) {
        return useLocalStorage ?
            (localStorage.getItem(key) != null) :
            data.hasOwnProperty(key);
    };

    get = function (key) {
        return useLocalStorage ?
            JSON.parse(localStorage.getItem(key)) :
            data[key];
    };

    getMany = function (keys) {
        return $.map(keys, get);
    };

    set = function (key, val) {
        if (useLocalStorage) {
            localStorage.setItem(key, JSON.stringify(val));
        } else {
            data[key] = val;
            writeStorageToFile();
        }
        return mdc.storage;
    };

    remove = function (key) {
        if (useLocalStorage) {
            localStorage.removeItem(key);
        } else {
            delete data[key];
            writeStorageToFile();
        }
        return mdc.storage;
    };

    removeAll = function (filter) {
        var keys = [];

        if (filter == null) {
            if (useLocalStorage) {
                localStorage.clear();
            } else {
                data = {};
                writeStorageToFile();
            }
        } else {
            // find which keys match the filter
            if (typeof filter === "string") {
                keys = $.map(data, function (key) {
                    return (key.indexOf(filter) > -1) ? key : null;
                });
            } else {
                keys = $.map(data, function (key) {
                    return (key.match(filter) != null) ? key : null;
                });
            }
            // remove keys
            if (useLocalStorage) {
                while (keys.length) {
                    localStorage.removeItem(keys.pop());
                }
            } else {
                while (keys.length) {
                    delete data[keys.pop()];
                }
                writeStorageToFile();
            }
        }
        return mdc.storage;
    };

    setMany = function (keys, vals) {
        $.each(keys, function (i, key) {
            set(key, vals[i]);
        });
        return mdc.storage;
    };

    writeStorageToFile = function () {
        if (writing.state() !== "pending") {
            // if a write operation is not in progress, write immediately
            writing = new $.Deferred();
            mdc.file.writeJson(storFile, data, true)
            .always(function () {
                // reset queue flag after writing
                writeQueued = false;
                writing.resolve();
            });
        } else {
            // if there is a write operation in progress queue one write after it ends
            if (!writeQueued) {
                // queue write only if another write hasn't been queued already
                // - one queued write is enough since it records the most recent state
                //   of the data object
                writing.always(writeStorageToFile);
                // set the queue flag
                writeQueued = true;
            }
        }
    };

}());