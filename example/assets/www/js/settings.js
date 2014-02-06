/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {
    var LOG = window.LOG, DETAIL = window.DETAIL,
        refresh,
        settings = {},
        defaults = mdc.defaultAppSettings(),
        settingsFile = "mdc_settings.json";

    mdc.settings = {

            setDebug: function (onoff) {
                if (typeof onoff === "boolean") {
                    LOG = !!onoff;
                    DETAIL = !!onoff;
                } else if (typeof onoff === "object") {
                    LOG = !!onoff.log;
                    DETAIL = !!onoff.detail;
                }
            },

            load: function () {
                LOG && console.log("settings: loading.");

                var dfrd = new $.Deferred(),
                    loadSettingsFile = new $.Deferred();

                mdc.file.readJson("/mnt/sdcard/" + settingsFile)
                .fail(function () {
                    mdc.file.readJson("settingsFile")
                    .done(loadSettingsFile.resolve)
                    .fail(loadSettingsFile.reject);
                })
                .done(loadSettingsFile.resolve);

                loadSettingsFile
                .done(function (data) {
                    LOG && console.log("settings: successfully loaded settings from file.");
                    try { refresh(data); } catch (err) { console.error(err); }
                    dfrd.resolve(mdc.settings);
                })
                .fail(function (err) {
                    dfrd.reject({ error: "Error loading settings file.", clue: JSON.stringify(err) });
                });

                return dfrd.promise();
            },

            value: function (key, val) {
                if (val === undefined) {
                    if (settings[key] === undefined) {
                        settings[key] = mdc.storage.value(key);
                    }
                    return settings[key] === undefined ? defaults[key] : settings[key];
                } else {
                    var d = {};
                    d[key] = val;
                    refresh(d);
                    return this;
                }
            },

            setDefault: function (key) {
                if (key === undefined) {
                    refresh(defaults);
                } else {
                    this.value(key, defaults[key]);
                }
            }

    };

    refresh = function (data) {
        var key;

        LOG && console.log("settings: writing settings to local storage.");
        DETAIL && console.log(JSON.stringify(data));

        for (key in data) {
            mdc.storage.value(key, data[key]);
            settings[key] = data[key];
        }
    };

}());