/*global iScroll */

(function () {
    var LOG = window.LOG, DETAIL = window.DETAIL,
        viewer, map, infoTableScroller, infoTableWrapper, userMarker, userRadius, mapToLoad,
        pinpointDfrd, pinpointMarker, setPinpointToGps,
        onPagebeforeshow, onPagebeforehide, onPageshow, onPagechange,
        onViewerInitializing, onNewLocation, onFeatureClick,
        resizeContentArea, showInfo, refreshScroller, bindButtonClickHandlers,

        wgs84 = new Proj4js.Proj("EPSG:4326"),
        container = "mapContainer",
        mode = "view",
        viewerInitializing = new $.Deferred();

    mdc.map = {

        setDebug: function (onoff) {
            if (typeof onoff === "boolean") {
                LOG = !!onoff;
                DETAIL = !!onoff;
            } else if (typeof onoff === "object") {
                LOG = !!onoff.log;
                DETAIL = !!onoff.detail;
            }
        },

        init: function () {
            LOG && console.log("map: initializing map.");

            mdc.map.viewer = viewer = new giscloud.Viewer(container);

            viewer.initializing
            .done(onViewerInitializing)
            .then(
                viewerInitializing.resolve,
                viewerInitializing.reject
            );

            viewer.bind("featureClick", onFeatureClick);

            mapPage = $("#mapPage").on({
                "pagebeforeshow": onPagebeforeshow,
                "pagebeforehide": onPagebeforehide,
                "pageshow": onPageshow
            });

            $(document).on("pagechange", onPagechange);

            bindButtonClickHandlers();

            return this;
        },

        prepareMap: function (mapId) {
            LOG && console.log("map: preparing map " + mapId);

            mapToLoad = mapId;

            if (viewer && viewer.initializing.state() !== "pending") {
                viewer.instance.unload();
                mdc.map.hideUserLocation();
            }

            return this;
        },

        load: function (mapId) {
            viewerInitializing.done(function () {
                LOG && console.log("map: loading map.");
                showLoader();
                this.loadMap(mapId)
                .loading.done(hideLoader);
            });
            return this;
        },

        reload: function () {
            viewerInitializing.done(function () {
                viewer.loading.done(function () {
                    mdc.map.hideUserLocation();
                    showLoader();
                    viewer.reloadMap()
                    .loading.done(hideLoader);
                });
            });
            return this;
        },

        followUser: function () {
            $(mdc.location).on("new", onNewLocation);
            return this;
        },

        stopFollowing: function () {
            $(mdc.location).off("new", onNewLocation);
            return this;
        },

        pinpoint: function () {
            var dfrd = new $.Deferred(),
                cancelOnBack = function () {
                    console.log("map: backbutton pinpoint cancel");
                    dfrd.reject();
                    pinpointDfrd && pinpointDfrd.reject();
                },
                onClick = function (evt) {
                    pinpointMarker && pinpointMarker.setLatLng(evt.latlng);
                };

            document.addEventListener("backbutton", cancelOnBack, false);
            dfrd.always(function () {
                document.removeEventListener("backbutton", cancelOnBack, false);
            });

            pinpointDfrd = new $.Deferred();

            viewer.loading
            .fail(function () {
                dfrd.reject();
            })
            .done(function () {
                var p, loc = mdc.location.current;

                if (!loc) {
                    p = viewer.center();
                    loc = viewer.instance.toLeafletCoords(p.lat, p.lon);
                } else {
                    p = new Proj4js.Point(loc.longitude, loc.latitude);
                    Proj4js.transform(wgs84, viewer.projection, p);
                    loc = viewer.instance.toLeafletCoords(p.x, p.y);
                }

                if (userRadius) {
                    map.removeLayer(userRadius);
                }

                if (userMarker) {
                    map.removeLayer(userMarker);
                }

                pinpointMarker = new L.Marker(loc, { draggable: true });
                map.addLayer(pinpointMarker);
                map.on("click", onClick);
            });

            pinpointDfrd
            .fail(function () { dfrd.reject(); })
            .done(function () {
                var latlng, p, loc;

                if (pinpointMarker) {
                    latlng = pinpointMarker.getLatLng();
                    loc = viewer.instance.fromLeafletCoords(latlng);
                    p = new Proj4js.Point(loc.x, loc.y);
                    Proj4js.transform(viewer.projection, wgs84, p);
                    dfrd.resolve(p.y, p.x);
                } else {
                    dfrd.reject();
                }
            })
            .always(function () {
                if (pinpointMarker) {
                    map.off("click", onClick);
                    map.removeLayer(pinpointMarker);
                }
            });

            return dfrd;
        },

        mode: function (modeName) {
            if (modeName == null) {
                return mode;
            }

            if (mode !== modeName) {
                mode = modeName;
                if (mode === "view") {
                    $("#pinpointingToolbar").hide();
                    $("#viewingToolbar").show();
                } else {
                    $("#viewingToolbar").hide();
                    $("#pinpointingToolbar").show();
                }
            }

            return this;
        },

        centerAndZoom: function (lat, lon) {
            LOG && console.log("map: center and zoom.");
            DETAIL && console.log([lat, lon].join(", "));

            viewer.loading.done(function () {
                this.center(new giscloud.LonLat(lon, lat), 16);
            });

            return this;
        },

        centerOnUser: function () {
            viewer.loading.done(function () {
                var lon, lat, p;

                if (!mdc.location.current) {
                    return this;
                }

                lon = mdc.location.current.longitude;
                lat = mdc.location.current.latitude;

                p = new Proj4js.Point(lon, lat);
                Proj4js.transform(wgs84, viewer.projection, p);

                mdc.map
                .showUserLocation(lat, lon, mdc.location.current.accuracy)
                .centerAndZoom(p.y, p.x);
            });

            return this;
        },

        showUserLocation: function (lat, lon, radius) {
            LOG && console.log("map: show user location.");
            DETAIL && console.log([lat, lon, radius].join(", "));

            var loc, p = new Proj4js.Point(lon, lat);

            Proj4js.transform(wgs84, viewer.projection, p);
            loc = viewer.instance.toLeafletCoords(p.x, p.y);

            if (userRadius) {
                map.removeLayer(userRadius);
            }

            if (userMarker) {
                map.removeLayer(userMarker);
            }

            userRadius = new L.Circle(loc, radius, { color: "blue", fillColor: "blue", fillOpacity: 0.15 });
            userMarker = new L.Marker(loc).bindPopup(_("You are here"));

            map.addLayer(userRadius);
            map.addLayer(userMarker);

            return this;
        },

        hideUserLocation: function () {
            if (userRadius) {
                map.removeLayer(userRadius);
            }

            if (userMarker) {
                map.removeLayer(userMarker);
            }

            return this;
        }

    };

    onViewerInitializing = function () {
        LOG && console.log("map: viewer initalized.");
        map = this.instance.exposeLeaflet();
    };

    onPagebeforeshow = function () {
        $(window).on("orientationchange resize", resizeContentArea);
    };

    onPagebeforehide = function () {
        $(window).off("orientationchange resize", resizeContentArea);
        mdc.map.stopFollowing();
    };

    onPageshow = function () {
        if (mapToLoad) return;

        viewer.loading.done(function () {
            if (mode === "view") {
                viewer.select(true);
                mdc.map.followUser();
            } else {
                viewer.select(false);
            }
        });

        resizeContentArea();
    };

    onPagechange = function (evt, data) {
        var isMapPage = data.toPage === "#mapPage" ||
                data.toPage.is && data.toPage.is("#mapPage");

        if (!isMapPage) return;

        if (mapToLoad) {
            LOG && console.log("map: loading prepared map.");
            mdc.map.load(mapToLoad);
            mapToLoad = null;
            onPageshow();
            //  viewer.loading.done(function () {
            //     resizeContentArea();
            //     viewer.select(true);
            //     mdc.map.followUser();
            // });
        } else {
            resizeContentArea();
        }
    };

    bindButtonClickHandlers = function () {
        $("#mapMyLocationButton").click(function () {
            delay(mdc.map.centerOnUser, mdc.map);
            $("#mapMyLocationButton").removeClass("ui-btn-active");
        });
        $("#mapReloadButton").click(function () {
            delay(mdc.map.reload, mdc.map);
            $("#mapReloadButton").removeClass("ui-btn-active");
        });
        $("#mapPinpointAcceptButton").click(function () {
            pinpointDfrd && pinpointDfrd.resolve();
            $("#mapPinpointAcceptButton").removeClass("ui-btn-active");
        });
        $("#mapPinpointCancelButton").click(function () {
            pinpointDfrd && pinpointDfrd.reject();
            $("#mapPinpointCancelButton").removeClass("ui-btn-active");
        });
        $("#mapPinpointGPSButton").click(function () {
            if (pinpointDfrd && pinpointDfrd.state() === "pending") {
                setPinpointToGps();
            }
            $("#mapPinpointGPSButton").removeClass("ui-btn-active");
        });
    };

    resizeContentArea = function() {
        var content, contentHeight, footer, header, viewportHeight;

        LOG && console.log("map: resizeContentArea.");

        window.scroll(0, 0);

        header = $("#mapPage > :jqmData(role='header')");
        footer = $("#mapPage > :jqmData(role='footer')");
        content = $("#mapPage > :jqmData(role='content')");

        viewportHeight = $(window).height();
        contentHeight = viewportHeight - header.outerHeight() - footer.outerHeight() + 1;

        viewer.height(contentHeight).width($(window).width());
        map && map.invalidateSize();

        refreshScroller();
    };

    refreshScroller = function () {
        if (!infoTableScroller) {
            infoTableWrapper = $("#infoTableWrapper");
            infoTableScroller = new iScroll(infoTableWrapper[0]);
        }
        setTimeout(function () {
            infoTableWrapper.height($(window).height());
            infoTableScroller.refresh();
        }, 50);
    };

    onNewLocation = function (jqEvt, loc) {
        LOG && console.log("on new location: " + JSON.stringify(loc));
        mdc.map.showUserLocation(loc.latitude, loc.longitude, loc.accuracy);
    };

    setPinpointToGps = function () {
        var loc, p,
            setLoc = function (loc) {
                p = new Proj4js.Point(loc.longitude, loc.latitude);
                Proj4js.transform(wgs84, viewer.projection, p);
                loc = viewer.instance.toLeafletCoords(p.x, p.y);
                pinpointMarker && pinpointMarker.setLatLng(loc);
                mdc.map.centerAndZoom(p.y, p.x);
            };

        loc = mdc.location.current;
        if (loc && loc.accuracy !== 0 && ($.now() - loc.when.getTime()) < 120000)
        {
            // if there's a fresh gps loacation, use that
            setLoc(loc);
        } else {
            // if no fresh location, get gps coords
            showLoader();
            mdc.location.request().always(hideLoader).done(setLoc);
        }
    };

    onFeatureClick = function (feature) {
        LOG && console.log("map: feature click");
        DETAIL && console.log(JSON.stringify(feature));

        showInfo(feature.layerId, feature.featureId);
    };

    showInfo = function (layerId, featureId) {
        var info = $("#infoTable");

        showLoader();

        // get data
        mdc.rest.get("layers/" + layerId + "/features/" + featureId, { format: true })
        .always(hideLoader)
        // fill the info popup and display it
        .done(function (featureData) {
            var data = featureData.data || [],
                meta = featureData.meta,
                i, l, col;

            // check the meta array for system fields
            l = meta && meta.columns && meta.columns.length;
            if (l) {
                for (i = 0; i < l; i++) {
                    col = meta.columns[i];
                    switch (col.field) {
                        case "OWNER":
                            data[col.alias || "OWNER"] = featureData.__owner_username;
                            break;
                        case "CREATED":
                            data[col.alias || "CREATED"] = featureData.__created ?
                                                                formatTimestamp(featureData.__created * 1000) :
                                                                null;
                            break;
                        case "MODIFIED":
                            data[col.alias || "MODIFIED"] = featureData.__modified ?
                                                                formatTimestamp(featureData.__modified * 1000) :
                                                                null;
                            break;
                    }
                }
            }

            // remove existing data
            info.empty();

            // fill the list
            info.append($.map(data, formatDataRow)).listview("refresh");

            // create buttons
            $("#infoTableWrapper").find("[data-role=button]").button();

            // refresh panel contents
            $("#infoPopup")
            .trigger("updateLayout")
            .panel("open");

            // scroller
            refreshScroller();

        });
    };

    formatDataRow = function (val, key) {
        var photoRx = /(\w[\w\-\s]*?\.jpe?g)/ig,
            audioRx = /(\w[\w\-\s]*?\.mp3)/ig,
            photos = val && val.match && val.match(photoRx),
            recordings = val && val.match && val.match(audioRx),
            value = "";

        if (photos && photos.length) {
            value = getPhotoLink(photos);
        }

        if (recordings && recordings.length) {
            if (value) {
                value += "<br/>";
            }
            value += getAudioLink(recordings[0]);
        }

        if (value) {
            return $("<li/>").append(
                $("<div/>", { "class": "media-field-title", html: "<p><strong>" + key + ": </strong></p>" }),
                $("<div/>", { "class": "media-field-value", html: value }));
        }

        return $("<li><p><strong>" + key + ": </strong>" + val + "</p></li>");
    };

    getPhotoLink = function (filenames) {

        filenames = $.map(filenames, function (itm) {
            return itm.indexOf("/") === -1 ?
                mdc.rest.fsResourceUrl("uploads/" + itm, "image/jpeg") :
                itm;
        });

        return "<a class=\"mdc-photo-link\" data-role=\"button\" data-inline=\"true\" data-mini=\"true\" " +
               "href=\"" + filenames.join() + "\">" + (filenames.length > 1 ? _("View photos") : _("View photo")) + "</a>";
    };

    getAudioLink = function (filename) {
        return "<a class=\"mdc-audio-link\" data-role=\"button\" data-inline=\"true\" data-mini=\"true\" " +
               "href=\"" + mdc.rest.fsResourceUrl("uploads/" + filename, "audio/mpeg") + "\">" + _("Listen") + "</a>";
    };


}());