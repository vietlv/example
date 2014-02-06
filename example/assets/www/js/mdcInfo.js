(function () {

    var LOG = window.LOG, DETAIL = window.DETAIL;

    mdc.mdcInfo = {
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

    mdc.MdcInfo = function (action) {
        var info;

        // user data
        info = mdc.storage.value("currentUserData");
        if (info) {
            this.user_id = info.id;
            this.user_name = info.username;
        } else {
            this.user_id = null;
            this.user_name = null;
        }

        // location data
        info = mdc.location.current;
        if (info) {
            this.latitude = info.latitude;
            this.longitude = info.longitude;
            this.altitude = info.altitude;
            this.heading = info.heading;
            this.compass_heading = info.compassHeading;
            this.speed = info.speed;
            this.accuracy = info.accuracy;
            this.altitude_accuracy = info.altitudeAccuracy;
            this.location_time = Math.round(info.time.getTime() / 1000);
            this.location_timezone_offset = info.time.getTimezoneOffset();
        } else {
            this.latitude = null;
            this.longitude = null;
            this.altitude = null;
            this.heading = null;
            this.compass_heading = null;
            this.speed = null;
            this.accuracy = null;
            this.altitude_accuracy = null;
            this.location_time = null;
            this.location_timezone_offset = null;
        }

        if (action !== "sign up" && action !== "log in" && action !== "log out") {
            // map data
            this.map_id = mdc.storage.value("selectedMapId") || null;
            this.map_owner_id = getMapOwner(this.map_id);

            // layer and table data
            this.layer_id = mdc.storage.value("selectedLayerId") || null;
            this.table_name = getTableName(this.layer_id);
            this.table_schema = this.map_owner_id ? "usrsch" + this.map_owner_id : null;

            // form data
            info = mdc.storage.value("selectedLayerForm");
            this.form_id = info ? info.id : null;

            // uploaded files
            this.uploaded_files = null;
        }

        // device data
        if (device.mock) {
            this.device_cordova = null;
            this.device_platform = null;
            this.device_version = null;
            this.device_model = null;
        } else {
            this.device_cordova = device.cordova;
            this.device_platform = device.platform;
            this.device_version = device.version;
            this.device_model = device.model;
        }
        this.device_uuid = mdc.settings.value("deviceId");

        // mdc data
        this.mdc_version = mdc.version;

        // action
        this.action = getActionId(action);

    };

    mdc.MdcInfo.prototype = {

        value: function (key, val) {
            this[key] = val;
            return this;
        },

        data: function () {
            var key, val, retval = {};

            for (key in this) {
                if (this.hasOwnProperty(key)) {
                    val = this[key];
                    if (val === null ||
                        typeof val === "string" || typeof val === "number") {
                        retval[key] = val;
                    }
                }
            }
            return retval;
        }
    };

    function getMapOwner(mapId) {
        var maps, ownerId;

        if (mapId == null) {
            return null;
        }

        maps = mdc.storage.value("userMaps");

        if (maps == null || maps.data == null ||
            maps.data.length == null || maps.data.length === 0) {
            return null;
        }

        $.each(maps.data, function (i, map) {
            if (map.id === mapId) {
                ownerId = map.owner;
                return false; // break $.each loop
            }
        });

        return ownerId || null;
    }

    function getTableName(layerId) {
        var layers, src;

        if (layerId == null) {
            return null;
        }

        layers = mdc.storage.value("userLayers");

        if (layers == null || layers.data == null ||
            layers.data.length == null || layers.data.length === 0) {
            return null;
        }

        $.each(layers.data, function (i, layer) {
            if (layer.id === layerId) {
                src = JSON.parse(layer.source);
                return false; // break $.each loop
            }
        });

        if (!src) {
            return null;
        }

        return src.src;
    }

    function getActionId(actionName)
    {
        switch (actionName)
        {
            case "sign up": return 0;
            case "log in": return 1;
            case "log out": return 2;
            case "insert": return 3;
            case "update": return 4;
            case "upload": return 5;
            case "mdc_log_error": return -1;
            default: return -2;
        }
    }

}());