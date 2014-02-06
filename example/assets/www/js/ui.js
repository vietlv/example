/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {
    var LOG = window.LOG, DETAIL = window.DETAIL,
        bindEvents, onOnline, onOffline, onLogIn, onLogOut, onQueuePopupBeforeOpen, getQueueListItem,
        getMapsSelectOptions, getLayersSelectOptions, sendPackage, onUse3GChange, onNetworkOnChange,
        refreshThumbsScroller, thumbsScroller, showPhoto, changePhoto, setPhotoSize, getPhotoThumbnail,
        showListenPopup, resizeAudio, stopAudio, queueCount, sending;

    mdc.ui = {

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

            mdc.map.init();

            if (mdc.net.isOnline()) {
                onOnline();
            } else {
                onOffline();
            }

            if (mdc.user.isLoggedIn()) {
                onLogIn();
            } else {
                onLogOut();
            }

            if (mdc.settings.value("networkOn") !== false) {
                $("#networkOn > option[value=on]").prop("selected", true);
            } else {
                $("#networkOn > option[value=off]").prop("selected", true);
            }

            if (mdc.settings.value("use3G") !== false) {
                $("#use3G > option[value=yes]").prop("selected", true);
            } else {
                $("#use3G > option[value=no]").prop("selected", true);
            }

            mdc.ui.queueList.refresh();
            mdc.ui.autocompletePopup.init();

            bindEvents();

            this.relays.create().checkAll();
        },

        signUp: function () {
            var form = $("#signupForm"),
                valid = form.parsley("validate"),
                signupButton = $("#signupButton"),
                username, email, password;

            $("#signupButton").removeClass("ui-btn-active");

            if (valid) {
                form.find("input").prop("disabled", true);
                mdc.ui.disableButton(signupButton);

                username = $("#signupUsername").val();
                email = $("#signupEmail").val();
                password = $("#signupPassword").val();

                // username = "neno" + randomInt(3);
                // email = username + "@gc.com";
                // password = "12345";

                mdc.user.signUp(username, email, password)
                .always(function () {
                    form.find("input").prop("disabled", false);
                    mdc.ui.enableButton(signupButton);
                })
                .fail(function (message) {
                    alert(message, 1000, 2);
                })
                .done(function () {
                    mdc.user.logIn(username, password);
                    alert(_("successful signup message"), 500, 1);
                });
            }
        },

        logIn: function () {
            var username = $("#username").val(),
                password = $("#password").val();

            $("#username, #password").textinput("disable");
            $("#logInButton").button("disable");

            $.mobile.loading("show");

            mdc.user.logIn(username, password)
            .fail(function (response) {
                LOG && console.log("ui: failed to log in.");

                if (response === "Invalid username or password") {
                    alert(_("bad login message"), 1000, 2);
                }
            })
            .always(function () {
                $.mobile.loading("hide");
                $("#username, #password").textinput("enable");
                $("#logInButton").button("enable");
            });
        },

        logOut: function () {
            $("#logInButton, #logOutButton").button("disable");

            $.mobile.loading("show");

            mdc.user.logOut()
            .fail(function () {
                $("#logOutButton").button("enable");
            })
            .always(function () { $.mobile.loading("hide"); });
        },

        sfdcLogin: function () {
            var url = "http://editor.giscloud.com/auth/sfdcoauth?authorize&redirect=/?blank",
                lastLoaded = "", sessid = false, error = false, dfrd = new $.Deferred(),
                onLoadStart = function (evt) { lastLoaded = evt.url; },
                onLoadError = function (evt) {
                    var code = evt.code || "?";

                    if (!evt.message) {
                        error = "Error " + code;
                    } else {
                        error = evt.message + " (" + code + ")";
                    }

                    win.close();
                },
                onLoadStop = function (evt) {
                    if (evt.url && evt.url === "https://editor.giscloud.com/?blank") {
                        win.executeScript({ code: "xxx = window.document.cookie.toString()" }, function (res) {
                            var cookie = res && res[0],
                                m = cookie && cookie.match(/PHPSESSID=([^;\s$]+)/i);
                            sessid = m && m[1];
                            win.close();
                        });
                    }
                },
                onExit = function () {
                    showLoader();

                    // detach inappbrowser event handlers
                    win.removeEventListener("loadstart", onLoadStart);
                    win.removeEventListener("loaderror", onLoadError);
                    win.removeEventListener("exit", onExit);
                    win.removeEventListener("loadstop", onLoadStop);

                    if (error) { alert(error); }

                    if (!sessid) {
                        dfrd.reject();
                    } else {
                        dfrd.resolve(sessid);
                    }
                },
                win = window.open(url, "_blank", "location=yes");

            // attach inappbrowser event handlers
            win.addEventListener("loadstart", onLoadStart);
            win.addEventListener("loaderror", onLoadError);
            win.addEventListener("exit", onExit);
            win.addEventListener("loadstop", onLoadStop);

            // handle outcome
            dfrd
            .always(hideLoader)
            .done(function (sessid) {
                showLoader();
                mdc.user
                .logIn(sessid)
                .always(hideLoader);
            })
            .fail(function (err) {
                if (err) {
                    alert({
                        title: "Salesforce login",
                        content: "Couldn't log in with Salesforce. Please try again."
                    }, 1000, 2);
                }
            });
        },

        refreshMaps: function () {
            mdc.user.maps(/* force refresh */ true)
            .done(this.displayMaps);
        },

        refreshLayers: function () {
            mdc.user.layers(/* force refresh */ true)
            .done(this.displayLayers);
        },

        refreshForm: function () {
            $.mobile.loading("show");
            // remove old package and form
            mdc.packages.destroyCurrent();
            mdc.form.remove();
            // load fresh form data
            mdc.user.form(true)
            .pipe(function () {
                // create a new form
                return mdc.form.load()
                    .done(function () {
                        // create a new package
                        mdc.packages.createNew();
                    });
            })
            .always(function () {
                $.mobile.loading("hide");
            });
        },

        displayMaps: function (mapsData) {
            var sel = $("#mapsSelect").empty()
                .append(getMapsSelectOptions(mapsData.data));

            try { sel.selectmenu("enable"); }
            catch (e) { sel.prop("disabled", false); }

            if (sel.selectmenu) {
                try { sel.selectmenu("refresh", true); }
                catch (e) { /* nada... */ }
            } else {
                sel.parent().trigger("create");
            }
        },

        displayLayers: function (layersData) {
            var sel;

            if (!layersData) {
                sel = $("#layersSelect").empty();
                try { sel.selectmenu("refresh"); }
                catch (e) {}
                return;
            }

            sel = $("#layersSelect").empty()
                .append(getLayersSelectOptions(layersData.data));

            try { sel.selectmenu("enable"); }
            catch (e) { sel.prop("disabled", false); }

            if (sel.selectmenu) {
                try { sel.selectmenu("refresh", true); }
                catch (e) { /* nada... */ }
            } else {
                sel.parent().trigger("create");
            }
        },

        saveSpace: function () {
            return $("body").width() < 320;
        },

        send: function () {
            var validationError;

            // prevent accidental button clicks
            if (sending) {
                return;
            }
            sending = true;
            mdc.ui.sendButton.disable();

            // get current package
            pack = mdc.packages.current();

            // check if the current package is full
            if (!pack.isFull()) {
                alert(_("package not full message", [pack.whatIsMissing().join(", ")]));
                sending = false;
                mdc.ui.sendButton.enable();
                return;
            }

            // check if there's a validation error
            validationError = pack.validationError();
            if (validationError) {
                alert({ title: validationError.name, content: validationError.message });
                sending = false;
                mdc.ui.sendButton.enable();
                mdc.form.focusOnItem(validationError.key);
                return;
            }

            // send!
            sendPackage(pack)
            // reenable sending
            .always(function () {
                $("#sendButton").removeClass("ui-btn-active");
                mdc.ui.sendButton.enable();
                sending = false;
            })
            // clear form on success
            .done(function () {
                mdc.form.clear();
                mdc.packages.createNew();
            });
        },

        autocompletePopup: (function () {
            var dfrd;

            function onCreate() {
                mdc.autocomplete.init($("#autocompleteWrapper"));
            }

            function onShow() {
                $("#autocompleteWrapper input[data-type=search]")
                .focus().click();
            }

            function onDone() {
                var value = mdc.autocomplete.value();

                if (dfrd) {
                    if (value != null) {
                        dfrd.resolve(value);
                    } else {
                        dfrd.reject();
                    }
                }
            }

            return {
                init: function () {
                    $("#autocompletePage").page({
                        "beforecreate": onCreate,
                        "show": onShow,
                        "beforehide": onDone
                    });
                    $(mdc.autocomplete).on("done", onDone);
                },

                show: function (autocompleteDef, name) {
                    if (dfrd && dfrd.state() === "pending") {
                        return null;
                    }

                    dfrd = new $.Deferred();
                    mdc.autocomplete.set(autocompleteDef, name);
                    $("#autocompletePage .ui-title").html(name);
                    $.mobile.changePage("#autocompletePage");

                    return dfrd;
                }
            };

        }()),

        queueList: {
            refresh: function () {
                var item, list = $("#queueList"),
                    queue = mdc.packages.queue,
                    queueLength = queue.length(),
                    i = queueLength - 1;

                LOG && console.log("ui: refreshing queue list.");

                // empty the list
                list.empty();

                if (queueLength === 0) {
                    // just add the 'queue empty' message
                    list.append($("<li><h5>" + _("queue is empty") + "</h5></li>"));
                } else {
                    // add a list item for each pending item
                    for (; i >= 0; i--) {
                        item = queue.item(i);
                        getQueueListItem(item).appendTo(list);
                    }
                }

                // refresh the listview
                list.listview ? list.listview("refresh") : list.parent().trigger("create");

                // update counter
                queueCount(queueLength);
            },

            show: function () {
                this.refresh();
                $("#queueButton").removeClass("ui-btn-active");
                $("#queuePage").popup("open", { positionTo: "window", transition: "slideup", tolerance: "5, 5" });
            },

            hide: function () {
                $("#queuePage").popup("hide");
            }
        },

        displayVersion: function (version, versionCode) {
            if (version && versionCode) {
                $("#appVersionDisplay")
                .text(_("device version message", [version, versionCode]));
            }
        },

        enableButton: function (button) {
            try { button.button("enable");}
            catch (e) { button.prop("disabled", false); }
        },

        disableButton: function (button) {
            try { button.button("disable");}
            catch (e) { button.prop("disabled", true); }
        },

        enableSelect: function (select) {
            try { select.selectmenu("enable");}
            catch (e) { select.prop("disabled", false); }
        },

        disableSelect: function (select) {
            try { select.selectmenu("disable");}
            catch (e) { select.prop("disabled", true); }
        },

        sendButton: {
            valueOf: function () { return $("#sendButton"); } ,
            disable: function () { $("#sendButton").addClass("ui-disabled"); },
            enable: function () { $("#sendButton").removeClass("ui-disabled"); }
        },

        mapButton: {
            valueOf: function () { return $(".mapButton"); } ,
            disable: function () { $(".mapButton").addClass("ui-disabled"); },
            enable: function () { $(".mapButton").removeClass("ui-disabled"); }
        }

    };

    bindEvents = function () {

        // online/offline events
        $(mdc.net).on({ "online": onOnline, "offline": onOffline });

        // queue events
        $(mdc).on("added.queue", mdc.ui.queueList.refresh);
        $(mdc).on("removed.queue", mdc.ui.queueList.refresh);
        $(mdc.packages.queue).on("itemSending", mdc.ui.queueList.refresh);
        $("#queuePage").on("popupbeforeposition", onQueuePopupBeforeOpen);

        // user events
        $(mdc.user).on({
            "loggedOut": onLogOut,
            "loggedIn": onLogIn,

            "mapSelected": function () {
                mdc.map.prepareMap(mdc.storage.value("selectedMapId"));
            },

            "layerSelected": function () {
                $.mobile.loading("show");

                mdc.ui.sendButton.disable();
                mdc.form
                .remove()
                .load()
                .done(function () {
                    $("#chooseLayerMessage").hide();
                    $("#customForm").show();
                    mdc.packages.createNew(mdc.form.items);
                })
                .always(function () { $.mobile.loading("hide"); });
            }
        });

        // settings page form events
        $("#mapsSelect").on("change", mdc.user.selectMap);
        $("#layersSelect").on("change", mdc.user.selectLayer);
        $("#use3G").on("change", onUse3GChange);
        $("#networkOn").on("change", onNetworkOnChange);

        // phonegap keyboard events
        document.addEventListener("hidekeyboard", onKeyboardHide, false);

        // login form keypress events
        $("#username, #password")
        .on("keypress", function (evt) {
            if (evt.which === 13) {
                evt.preventDefault();
                mdc.ui.logIn();
            }
        });

        // photo/audio item events
        $(document).on("click", ".mdc-photo-item", function (evt) {
            var url = $(this).attr("src");
            evt.preventDefault();
            showPhoto(url);
        });

        $(document).on("click", ".mdc-photo-link", function (evt) {
            var url = $(this).attr("href");
            evt.preventDefault();
            showPhoto(url);
        });

        $(document).on("click", ".mdc-audio-link", function (evt) {
            var url = $(this).attr("href");
            evt.preventDefault();
            showListenPopup(url);
        });

        $(document).on("click", "#thumbsContainer > img", function (evt) {
            var url = this.src;
            evt.preventDefault();
            changePhoto(url);
        });

        // listen popup events
        $("#listenPopup")
        .on("popupbeforeposition", resizeAudio)
        .on("popupafterclose", stopAudio);
    };

    onOnline = function () {
        if (!mdc.map.viewer.mapId) {
            if (mdc.storage.has("selectedMapId")) {
                LOG && console.log("ui: a map is already selected, initializing.");
                mdc.map.prepareMap(mdc.storage.value("selectedMapId"));
            }
        }
    };

    onOffline = function () {

    };

    onLogIn = function () {

        // is the form already loaded?
        if (mdc.storage.has("selectedLayerForm")) {
            mdc.form.load()
            .done(function () {
                mdc.packages.createNew(mdc.form.items);
                if (!$.mobile.activePage || !$.mobile.activePage.is("#mainPage")) {
                    $.mobile.changePage("#mainPage");
                }
            });
        } else {
            if (!mdc.storage.has("presetMap") &&
                !$.mobile.activePage || !$.mobile.activePage.is("#settingsPage")) {
                $.mobile.changePage("#settingsPage");
            }
        }

        // maps
        if (!mdc.storage.has("presetMap")) {
            mdc.user.maps().done(mdc.ui.displayMaps);
        }

        // layers
        if (!mdc.storage.has("presetLayer")) {
            mdc.user.layers().done(mdc.ui.displayLayers);
        }

    };

    onLogOut = function () {
        try {
            $("#mapsSelect").empty().selectmenu("refresh");
            $("#layersSelect").empty().selectmenu("refresh");
        } catch (e) { }

        mdc.form.remove();
        mdc.packages.destroyCurrent();
        $.mobile.changePage("#mainPage");
    };

    onNetworkOnChange = function () {
        var val = $("#networkOn").val();
        if (val === "on") {
            mdc.settings.value("networkOn", true);
            mdc.net.enable();
        } else {
            mdc.settings.value("networkOn", false);
            mdc.net.disable();
        }
    };

    onUse3GChange = function () {
        var val = $("#use3G").val();
        if (val === "yes") {
            mdc.settings.value("use3G", true);

        } else {
            mdc.settings.value("use3G", false);

        }
    };

    onQueuePopupBeforeOpen = function () {
        var popup = $(this),
            maxHeight = window.innerHeight * 0.9;

        // set max height
        if (popup.height() > maxHeight) {
            popup.height(maxHeight).css("overflow", "scroll");
        } else {
            popup.height("auto").css("overflow", "hidden");
        }
    };

    getQueueListItem = function (item) {
        var removeFunc = function () { mdc.packages.queue.removeItem(item.id); },
            content = [
                $("<a/>").append(
                    $("<h6/>", { text: _("queued") + " " + smartTime(item.created) }),
                    $("<p/>", { text: (item.status === mdc.queueStatus.SENDING) ?
                                        _("sending") : _("pending") })),
                $("<a/>", { title: _("delete"), click: removeFunc })
            ];
        return $("<li/>").append(content);
    };

    getMapsSelectOptions = function (maps) {
        var selectedId = mdc.storage.value("selectedMapId"),
            options = $.map(maps, function (map) {
                var opt = $("<option/>", { text: map.name, value: map.id });

                if (selectedId && selectedId === map.id) {
                    opt.prop("selected", true);
                }

                return opt;
            });

        return [$("<option/>", { text: "none", value: "null" })].concat(options);
    };

    getLayersSelectOptions = function (layers) {
        var selectedId = mdc.storage.value("selectedMapId") && mdc.storage.value("selectedLayerId"),
            options = $.map(layers, function (layer) {
                var source = JSON.parse(layer.source), opt;

                if (source.type === "pg" && layer.type === "point" ) {
                    opt = $("<option/>", { text: layer.name, value: layer.id });
                    if (selectedId && selectedId === layer.id) {
                        opt.prop("selected", true);
                    }
                    return opt;
                }
            });

        if (options.length) {
            return [$("<option/>", { text: _("none"), value: "null" })].concat(options);
        }
        return $("<option/>", { text: _("No selectable layers"), value: "null" });
    };

    showPhoto = function (target) {
        var thumbsContainer = $("#thumbsContainer"),
            urls = target.split(","),
            url = urls[0];

        if (urls.length > 1) {
            if ($.map(thumbsContainer.children("img"), function (img) { return img.src; }).join() !== target)
            {
                thumbsContainer
                .empty()
                .append($.map(urls, getPhotoThumbnail))
                .parent().show();

                refreshThumbsScroller();
            }
        } else {
            thumbsContainer.empty().parent().hide();
        }

        changePhoto(url);

        $(window).on("orientationchange", setPhotoSize);
        $(window).on("orientationchange", refreshThumbsScroller);
        $("#photoPage").one("pagebeforehide", function () {
            $(window).off("orientationchange", setPhotoSize);
        });

        $.mobile.changePage("#photoPage");
    };

    changePhoto = function (url) {
        var photoContainer = $("#photoContainer"),
            thumbs = $("#thumbsContainer").children(),
            img = photoContainer.find("img");

        if (img && img.length && img.attr("src") === url) {
            setPhotoSize(null, img);
            return;
        }

        photoContainer.empty();
        img = $("<img/>", { src: url });

        img.imgLoad(function () {
            var photo = $(this);
            setPhotoSize(null, photo);
            photo.appendTo($("#photoContainer"));
            refreshThumbsScroller();
            $.mobile.loading("hide");
        });

        thumbs.each(function (i, itm) {
            var img = $(itm);
            if (img.attr("src") === url) {
                img.addClass("thumb-active");
            } else {
                img.removeClass("thumb-active");
            }
        });
    };

    getPhotoThumbnail = function (url) {
        return $("<img/>", { src: url });
    };

    setPhotoSize = function (evt, photo) {
        var img = photo || $("#photoContainer > img"),
            thumbsHeight = $("#thumbsScrollWrapper").is(":visible") ? $("#thumbsScrollWrapper").outerHeight() : 0,
            headerHeight = $("#photoPage [data-role=header]").outerHeight() + thumbsHeight,
            containerWidth = $(window).width(),
            containerHeight = $(window).height() - headerHeight,
            imgWidth = img.length && img[0].naturalWidth,
            imgHeight = img.length && img[0].naturalHeight,
            ratio = img.length && (imgWidth / imgHeight),
            w, h, left, top;

        if (!ratio) {
            return;
        }

        if (imgWidth > containerWidth) {
            w = containerWidth;
            h = w / ratio;
        } else {
            w = imgWidth;
            h = imgHeight;
        }

        if (h > containerHeight) {
            h = containerHeight;
            w = h * ratio;
        }

        left = w >= containerWidth ? 0 : (containerWidth - w) / 2;
        top = h >= containerHeight ? headerHeight : (containerHeight - h) / 2 + headerHeight;

        img.width(w).height(h).css("top", top).css("left", left);
    };

    refreshThumbsScroller = function () {
        var thumbsScrollWrapper = $("#thumbsScrollWrapper"),
            scroller = $("#thumbsContainer"),
            winWidth = $(window).width(),
            width = 0;

        thumbsScrollWrapper.width($(window).width());

        scroller.find("img").each(function (i, img) {
            width += $(img).outerWidth() || 100;
        });

        width = Math.max(width, winWidth);
        scroller.width(width);

        if (!thumbsScroller) {
            thumbsScroller = new iScroll(
                thumbsScrollWrapper[0], {
                    vScroll: false,
                    vScrollbar: false,
                    hScrollbar: false
                });
        }

        setTimeout(function () {
            thumbsScroller.refresh();
        }, 200);
    };

    showListenPopup = function (url) {
        var listenPopup = $("#listenPopup"),
            content = listenPopup.find("[data-role=content]"),
            audio = $("#listenPopupAudio");

        if (!device.mock && device.platform === "Android" && device.version < 2.3) {
            content.empty();
            audio = $("<div/>", {
                id: "listenPopupAudio",
                text: "Sorry, not available on Android versions before 2.3."
            });
            content.append(audio);
        } else {
            audio.attr("src", url);
        }


        $(window).on("orientationchange", resizeAudio);
        listenPopup.one("popupafterclose", function () {
            $(window).off("orientationchange", resizeAudio);
        });

        listenPopup.popup("open", { positionTo: "window", tolerance: "5, 5" });
    };


    stopAudio = function () {
        var audio = $("#listenPopupAudio")[0];

        if (audio.pause) {
            audio.pause();
            audio.src = "";
        }
    };

    resizeAudio = function () {
        var winWidth = $(window).width();
            audio = $("#listenPopupAudio");

        audio.width(Math.max(winWidth * 0.7, 200));
    };

    sendPackage = function (pack) {
        var dfrd;

        if (true || mdc.settings.value("queueSend")) {
            // disable item value change if form is accidentally changed
            pack.lock();
            // get mdc info values
            pack.loadMdcItemValues();
            // queue package
            mdc.packages.queue.addItem(new mdc.QueueItem(pack));
            // show something for a sec
            $.mobile.loading("show");
            setTimeout(function () { $.mobile.loading("hide"); }, 1000);
            // return success
            return (new $.Deferred()).resolve();
        } else {
            // send now
            dfrd = pack.send();

            if (!dfrd) {
                alert("Error");
                return (new $.Deferred()).reject();
            }

            $.mobile.loading("show");

            return dfrd
                .always(function () {
                    $.mobile.loading("hide");
                })
                .done(function () {
                    // success!
                    alert(_("data sent message"), 200, 3);
                })
                .fail(function () {
                    alert(_("sending error message"), 1000, 2);
                });
        }
    };

    queueCount = function (n) {
        var qc = $(".queue-count"),
            visible = qc.is(":visible");

        DETAIL && console.log("ui: displaying queue count.");

        if (n === 0) {
            if (visible) {
                // remove the counter
                qc.slideUp("fast", function () { qc.html("&nbsp;"); });
            }
        } else {
            if (!visible) {
                qc.text(n);
                qc.slideDown("fast");
            } else {
                qc.slideUp("fast", function () {
                    qc.text(n);
                    qc.slideDown("fast");
                });
            }
        }
    };

    onKeyboardHide = function () {
        //$("#customForm input:focus").blur();
    };

}());