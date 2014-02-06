/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {

    var LOG = window.LOG, DETAIL = window.DETAIL,
        createApiKey, deleteKey, getOptions, handleSignupMapsAndLayers;

    mdc.user = {

        setDebug: function (onoff) {
            if (typeof onoff === "boolean") {
                LOG = !!onoff;
                DETAIL = !!onoff;
            } else if (typeof onoff === "object") {
                LOG = !!onoff.log;
                DETAIL = !!onoff.detail;
            }
        },

        isLoggedIn: function () {
            return this.apiKey() != null;
        },

        logIn: function (username, password) {
            var dfrd = new $.Deferred();

            LOG && console.log("user: logging in " + [username, password].join(", "));

            // create a new api key
            createApiKey(username, password)
            // if user credentials are invalid
            .fail(function (response) {
                LOG && console.log("user: login failed.");
                DETAIL && console.log(JSON.stringify(response));

                $.each(arguments, function (i, itm) { console.log("arg " + i + ": " + JSON.stringify(itm)); });

                if (response && response.error && response.error === "Forbidden") {
                    dfrd.reject("Invalid username or password");
                } else {
                    dfrd.reject();
                }
            })
            // get current user data
            .done(function () {
                LOG && console.log("user: getting user data after login.");

                mdc.rest.get("users/current", { expand: "options" })
                // successfully retrieved current user data
                .done(function (data) {
                    var userData;

                    LOG && console.log("user: retrieved user data.");
                    DETAIL && console.log(JSON.stringify(data));

                    userData = {
                        id: data.id,
                        username: data.username,
                        firstName: data.firstname,
                        lastName: data.lastname,
                        email: data.email,
                        options: getOptions(data.options)
                    };

                    if (userData.options.MDC_MAP != null) {
                        mdc.storage.value("presetMap", userData.options.MDC_MAP);
                        mdc.user.selectMap(userData.options.MDC_MAP, /* don't display layers */ true);
                    }

                    if (userData.options.MDC_LAYER != null) {
                        mdc.storage.value("presetLayer", userData.options.MDC_LAYER);
                        mdc.user.selectLayer(userData.options.MDC_LAYER);
                    }

                    if (userData.options.MDC_FIRST_TIME &&
                        userData.options.MDC_MAP == null && userData.options.MDC_LAYER == null) {

                        handleSignupMapsAndLayers()
                        .done(function () {
                            mdc.rest.del("/users/current/options/MDC_FIRST_TIME");
                            delete userData.options.MDC_FIRST_TIME;
                        })
                        .always(function () {
                            mdc.storage.value("currentUserData", userData);
                            $(mdc.user).triggerHandler("loggedIn", [userData]);
                            dfrd.resolve(userData);
                        });

                    } else {

                        mdc.storage.value("currentUserData", userData);
                        $(mdc.user).triggerHandler("loggedIn", [userData]);
                        dfrd.resolve(userData);

                    }

                })
                // failed to get user data
                .fail(function () {
                    LOG && console.log("user: failed to retrieve user data.");
                    dfrd.reject();
                });
            });

            return dfrd.promise();
        },

        logOut: function () {
            var dfrd = new $.Deferred();

            LOG && console.log("user: logging out.");

            if (this.isLoggedIn()) {
                deleteKey(mdc.storage.value("apiKeyId"))
                .fail(function () {
                    LOG && console.log("user: failed to delete key. key id: " + mdc.storage.value("apiKeyId"));
                })
                .done(function() {
                    LOG && console.log("user: key deleted.");
                    mdc.storage.remove("apiKeyId");
                })
                .always(function () {
                    LOG && console.log("user: wiping user info from storage.");

                    mdc.storage
                    .remove("apiKey")
                    .remove("currentUserData")
                    .remove("userMaps")
                    .remove("userLayers")
                    .remove("selectedMapId")
                    .remove("selectedLayerId")
                    .remove("selectedLayerForm")
                    .remove("presetMap")
                    .remove("presetLayer");

                    $(mdc.user).triggerHandler("loggedOut");

                    dfrd.resolve();
                });
            }

            return dfrd;
        },

        signUp: function (username, email, password) {
            var dfrd = new $.Deferred(),
                mdcInfo = new mdc.MdcInfo("sign up");

            LOG && console.log("user: signing up a new user: " + [username, email, password].join(", "));

            mdcInfo.value("user_name", username);
            showLoader();

            $.getJSON(
                "https://editor.giscloud.com/auth/mdcsignup",
                {
                    username: username,
                    email: email,
                    password: password,
                    mdc_info: mdcInfo.data()
                }
            )
            .always(function (response) {
                LOG && console.log("user: signup operation response: " + JSON.stringify(response));
                hideLoader();
            })
            .fail(function () {
                dfrd.reject(_("unsuccessful signup message"));
            })
            .done(function (response) {
                if (!response) {
                    dfrd.reject(_("unsuccessful signup message"));
                } else if (response.result === "no") {
                    dfrd.reject(response.msg);
                } else {
                    dfrd.resolve();
                }
            });

            return dfrd.promise();
        },

        data: function () {
            return mdc.storage.value("currentUserData");
        },

        apiKey: function () {
            return mdc.storage.value("apiKey");
        },

        maps: function (forceRefresh) {
            if (!forceRefresh && mdc.storage.has("userMaps")) {
                LOG && console.log("user: getting maps from storage.");
                return $.Deferred().resolve(mdc.storage.value("userMaps"));
            }

            LOG && console.log("user: getting maps from rest.");
            $.mobile.loading("show");
            return mdc.rest.get("maps", { type: "private,shared", order_by: "accessed:desc", perpage: 200 })
                .done(function (maps) {
                    // save maps
                    mdc.storage.value("userMaps", maps);
                    $(mdc.user).triggerHandler("mapsLoaded");
                })
                .always(function () {
                    $.mobile.loading("hide");
                });
        },

        layers: function (forceRefresh) {
            var mapId;

            if (!forceRefresh && mdc.storage.has("userLayers")) {
                LOG && console.log("user: getting layers from storage.");
                return $.Deferred().resolve(mdc.storage.value("userLayers"));
            }

            mapId = mdc.storage.value("selectedMapId");

            if (mapId == null) {
                return $.Deferred().reject();
            }

            LOG && console.log("user: getting layers from rest.");

            $.mobile.loading("show");
            return mdc.rest.get("maps/" + mapId + "/layers")
                .done(function (layers) {
                    // save layers
                    mdc.storage.value("userLayers", layers);
                    $(mdc.user).triggerHandler("layersLoaded");
                })
                .always(function () {
                    $.mobile.loading("hide");
                });
        },

        form: function (forceRefresh) {
            var layerId;

            if (!forceRefresh && mdc.storage.has("selectedLayerForm")) {
                LOG && console.log("user: getting form from storage.");
                return $.Deferred().resolve(mdc.storage.value("selectedLayerForm"));
            }

            LOG && console.log("user: getting form from rest.");
            layerId = mdc.storage.value("selectedLayerId");
            return mdc.rest.get("layers/" + layerId + ".json", { expand: "form" })
                // save form once you get layer data
                .pipe(function (layer) {
                    var form = layer.form;
                    form.definition = JSON.parse(form.definition);
                    mdc.storage.value("selectedLayerForm", form);
                    // trigger event
                    $(mdc.user).triggerHandler("formSelected");
                    return form;
                });
        },

        selectMap: function (map, dontGetLayers) {
            var id;
            if (map instanceof $.Event) {
                id = map.target.value;
            } else if (map && map.id) {
                id = map.id;
            } else {
                id = map;
            }

            if (id === -1 || id === "null") {
                LOG && console.log("user: no map selected.");
                mdc.storage.remove("selectedMapId");
            } else {
                LOG && console.log("user: map selected, id: " + id);
                mdc.storage.value("selectedMapId", id);
            }

            mdc.storage.remove("userLayers");
            mdc.storage.remove("selectedLayerId");
            mdc.storage.remove("selectedLayerForm");

            // trigger event
            $(mdc.user).triggerHandler("mapSelected");

            if (!dontGetLayers) {
                // display map layers
                mdc.user.layers().always(mdc.ui.displayLayers);
            }
        },

        selectLayer: function (layer) {
            var id;
            if (layer instanceof $.Event) {
                id = layer.target.value;
            } else if (layer && layer.id) {
                id = layer.id;
            } else {
                id = layer;
            }

            mdc.storage.remove("selectedLayerForm");

            if (id === -1 || id === "null") {
                LOG && console.log("user: no layer selected.");
                mdc.storage.remove("selectedLayerId");
            } else {
                LOG && console.log("user: layer selected, id: " + id);
                mdc.storage.value("selectedLayerId", id);
            }
            // trigger event
            $(mdc.user).triggerHandler("layerSelected");
        }


    };

    getOptions = function (options) {
        var opts;

        if (options == null || !$.isArray(options) || options.length === 0) {
            return {};
        }

        opts = {};
        $.each(options, function (i, opt) {
            opts[opt.name] = opt.value;
        });

        return opts;
    };

    createApiKey = function (username, password) {
        var mdcInfo = new mdc.MdcInfo("log in"), resource;

        if (password === undefined) {
            // username is actually a session id
            resource = "keys.json?api_sessid=" + encodeURIComponent(username);
        } else {
            mdcInfo.value("user_name", username);
            resource = "keys.json?api_username=" + encodeURIComponent(username) +
                "&api_password=" + encodeURIComponent(password);
        }



        return mdc.rest.post(
            resource,
            {
                key_desc: "Created by MDC on " + (new Date()).toLocaleString(),
                mdc_info: mdcInfo.data()
            },
            {
               dontParseLocation: true,
               dontUseApiKey: true
            })
            // on successful key cration
            .pipe(function (response) {
                var data = response && response.data,
                    jqxhr = response && response.jqxhr,
                    location = jqxhr && jqxhr.getResponseHeader("Location"),
                    m = location && location.match(/keys\/(\d+)$/i),
                    id = m && m[1],
                    key = data && data.value;

                // because of CORS, the location header is sometimes unavailable
                // so the key id is not as important, but save it if you get it
                if (id != null) {
                    mdc.storage.value("apiKeyId", id);
                    LOG && console.log("user: new api key id saved: " + id);
                }

                if (key != null) {
                    mdc.storage.value("apiKey", key);
                    LOG && console.log("user: new api key created: " + key);
                    return key;
                }

                LOG && console.log("user: new api key failed to create.");
                return null;
            });
    };

    deleteKey = function (keyId) {
        var mdcInfo;

        if (keyId != null) {
            mdcInfo = new mdc.MdcInfo("log out");
            return mdc.rest.del("keys/" + keyId, { mdc_info: JSON.stringify(mdcInfo.data()) });
        }
        return $.Deferred().reject();
    };

    handleSignupMapsAndLayers = function () {
        return giscloud.Queue([

            // get maps
            mdc.user.maps,

            // pick the sample map
            function (maps) {
                var i, l = maps && maps.data && maps.data.length,
                    dfrd = new $.Deferred();

                for (i = 0; i < l; i++) {
                    if (maps.data[i].name === "Sample: Mobile Data Collection") {
                        mdc.user.selectMap(maps.data[i].id);
                        return dfrd.resolve();
                    }
                }

                return dfrd.reject();
            },

            // get sample map layers
            mdc.user.layers,

            // pick the mdc layer
            function (layers) {
                var i, l = layers && layers.data && layers.data.length,
                    dfrd = new $.Deferred();

                for (i = 0; i < l; i++) {
                    if (layers.data[i].name === "MDC Sample Layer") {
                        mdc.user.selectLayer(layers.data[i].id);
                        mdc.storage.value("selectedLayerForm", layers.data[i].form);
                        return dfrd.resolve();
                    }
                }

                return dfrd.reject();
            }
        ]);
    };

}());