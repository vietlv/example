/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {
    var LOG = window.LOG, DETAIL = window.DETAIL,
        createFormItems;

    mdc.form = {

            setDebug: function (onoff) {
                if (typeof onoff === "boolean") {
                    LOG = !!onoff;
                    DETAIL = !!onoff;
                } else if (typeof onoff === "object") {
                        LOG = !!onoff.log;
                    DETAIL = !!onoff.detail;
                }
            },

            formTheme: "a",
            formContentTheme: "a",
            itemTheme: "g",
            itemContentTheme: "a",

            items: [],

            create: function (formDefinition, formMappings) {
                var formContainer;

                if (!formDefinition) {
                    LOG && console.log("form: can't create form, no form definition.");
                    return this;
                }

                LOG && console.log("form: Creating a new form.");
                DETAIL && console.log(JSON.stringify(formDefinition));

                // create all of the form items
                this.items = createFormItems(formDefinition.items, formMappings);

                // add location item if not present
                if (!$.grep(this.items, function (item) { return item instanceof mdc.LocationFormItem; }).length) {
                    this.items = [new mdc.LocationFormItem(_("Location"), "loc", true, true, true)].concat(this.items);
                }

                formContainer = $("<ul data-role='listview'></ul>", { id: "formContainer" })
                    .append($.map(this.items, function (itm) { return itm.render(); }));

                $("#customForm")
                .jqmData("inset", true)
                .append(formContainer)
                .trigger("create")
                // refresh radio buttons
                .find(".locationModeSelectCell input[type=radio]").checkboxradio("refresh");

                return this;
            },

            load: function () {
                var dfrd = new $.Deferred();
                mdc.user.form()
                .done(function (form) {
                    LOG && console.log("form: form loaded.");
                    DETAIL && console.log(JSON.stringify(form));

                    mdc.form.create(form.definition, form.mappings);
                    dfrd.resolve(mdc.form);
                })
                .fail(dfrd.reject);
                return dfrd.promise();
            },

            remove: function () {
                $("#customForm").empty();
                return this;
            },

            clear: function () {
                LOG && console.log("form: clearing form.");

                var i, k, itm;
                for (i = 0, k = this.items.length; i < k; i++) {
                    itm = this.items[i];
                    if (!itm.persistent) {
                        itm.clear();
                    }
                }
                return this;
            },

            focusOnItem: function (key) {
                var i, l, item;
                LOG && console.log("form: focusing on item: " + key);
                for (i = 0, l = this.items.length; i < l; i++) {
                    item = this.items[i];
                    if (item.key === key) {
                        item.focus();
                    }
                }
            }
    };

    createFormItems = function (items, mappings) {
        return $.map(items, function (item) {
            var name = item.name || item.key;

            if (mappings && mappings[name]) {
                item.name = mappings[name];
            }

            switch (item.type) {
            case "group":
                return new mdc.GroupFormItem(item.title || item.name, item.items, item.expanded, mappings);
            case "location":
                return new mdc.LocationFormItem(item.title || item.name, item.name || item.key, item.required, item.expanded, item.persistent);
            case "photo":
            case "photos":
                return new mdc.PhotosFormItem(item.title || item.name, item.name || item.key, item.target, item.required, item.expanded, item.persistent);
            case "audio":
            case "recording":
                return new mdc.RecordingFormItem(item.title || item.name, item.name || item.key, item.target, item.required, item.expanded, item.persistent);
            case "text":
                return new mdc.TextFormItem(item.title || item.name, item.name || item.key, item.value, item.required, item.expanded, item.persistent, item.multiline, item.autocomplete);
            case "hidden":
                return new mdc.HiddenFormItem(item.title || item.name, item.name || item.key, item.value, item.required, item.expanded, item.persistent);
            case "select":
                return new mdc.SelectFormItem(item.title || item.name, item.name || item.key, item.value, item.options, item.required, item.expanded, item.persistent);
            case "radio":
                return new mdc.RadioFormItem(item.title || item.name, item.name || item.key, item.value, item.options, item.required, item.expanded, item.persistent, item.orientation);
            case "number":
            case "numeric":
                return new mdc.NumericFormItem(item.title || item.name, item.name || item.key, item.value, item.min, item.max, item.required, item.expanded, item.persistent);
            default:
                if (item.type.indexOf("mdc") === 0) {
                    return new mdc.MdcFormItem(item.title || item.name, item.name || item.key, item.type);
                }
                throw { error: "Unknown form item type", clue: item.type };
            }
        });
    };

}());

//
// FormItem
//
(function () {

    mdc.FormItem = function (name, key, type, loadType, isRequired, isExpanded, isPersistent) {

        LOG && console.log("form: Creating a new FormItem.");
        DETAIL && console.log(JSON.stringify([name, key, type, loadType, isRequired, isExpanded, isPersistent]));

        this.name = name;
        this.key = key;
        this.type = type;
        this.loadType = loadType;
        this.required = isRequired;
        this.expanded = isExpanded;
        this.persistent = isPersistent;
        this.value = null;

    };

    mdc.FormItem.prototype = {
            render: function () {
                return $("<li data-role='fieldcontain'/>");
            },

            focus: function () {
                this.focusElement && this.focusElement.focus();
            }
    };

}());

//
// GroupFormItem
//
(function () {

    mdc.GroupFormItem = function (name, items, isExpanded, mappings) {

        LOG && console.log("form: Creating a new GroupFormItem.");
        DETAIL && console.log(JSON.stringify([name, $.map(items, function (itm) { return itm && itm.name; }), isExpanded]));

        this.name = name;
        this.expanded = isExpanded;

        this.items = mdc.form.createFormItems(items, mappings);

    };

    mdc.GroupFormItem.prototype = {

            render: function () {

                var container = $("<div data-role='collapsible'></div>")
                    .jqmData("mini", true)
                    .jqmData("theme", mdc.form.itemTheme)
                    .jqmData("content-theme", mdc.form.itemContentTheme)
                    .addClass("smaller-font"),

                    l = this.items.length - 1,

                    line = function () { return $("<div class=\"line\"/>"); },

                    renderedItems = $.map(this.items, function (itm, i) {
                        if (i < l) {
                            return itm.render(true).append(line());
                        } else {
                            return itm.render(true);
                        }
                    });

                if (this.name) {
                    container
                    .jqmData("collapsed", !this.expanded)
                    .append($("<h3/>").append(__(this.name)))
                    .append.apply(container, $.makeArray(renderedItems))
                    .collapsible();
                } else {
                    container
                    .append.apply(container, $.makeArray(renderedItems));
                }

                return container;

            },

            clear: function () {
                LOG && console.log("form: clearing group item.");

                $.each(this.items, function (i, item) {
                    if (!item.persistent) {
                        item.clear();
                    }
                });
            }

    };


}());


//
// LocationFormItem
//
(function () {

    var showLocationData, changeMode, onNewLocation, onModeChange, showOnMap, pinpoint, inputLatLon, itemTable;

    mdc.LocationFormItem =
        construct(mdc.FormItem,

                function (name, key, isRequired, isExpanded, isPersistent) {

                    LOG && console.log("form: Creating a new LocationFormItem.");
                    DETAIL && console.log(JSON.stringify([name, key, isRequired, isExpanded, isPersistent]));

                    // call base constructor
                    this.base.ctor.call(this, name, key, "location", "immediate", !!isRequired, isExpanded, isPersistent);

                },

                {
                    render: function (isGroupItem) {

                        LOG && console.log("form: rendering a new LocationFormItem.");
                        DETAIL && console.log(JSON.stringify([this.name, this.key]));

                        this.container = this.base.render.call(this, isGroupItem);

                        this.table = itemTable.call(this);

                        this.autoData = this.table.find(".locationAutoModeDataCell");
                        this.pleaseWaitMessage = this.table.find(".locationAutoDataUnavailable");
                        this.autoLocationDisplay = this.table.find(".locationAutoData");
                        this.accuracyDisplay = this.table.find(".locationAccuracy");

                        this.manualData = this.table.find(".locationManualModeDataCell");
                        this.manualLat = this.table.find(".locationManualLat");
                        this.manualLon = this.table.find(".locationManualLon");

                        this.locationIsVisible = false;
                        this.mode = "auto";

                        this.container.append(this.table);

                        // bind to mdc.location and begin watching position
                        $(mdc.location).on("new", $.proxy(onNewLocation, this));
                        mdc.location.go();

                        return this.container;
                    },

                    clear: function () {
                        LOG && console.log("form: location form item doesn't need clearing");
                    }
                }

        );

    itemTable = function () {
        var uniq = uniqueId(),
            table = $("#locationFormItemTemplate").children().clone();

        // replace mode select radio button ids and set labels
        table.find(".locationModeSelectCell fieldset").children().each(function () {
            var elem = $(this);
            if (elem.is("label")) {
                elem.attr("for", elem.attr("for") + uniq);
            } else {
                elem.attr("id", elem.attr("id") + uniq);
            }
        });

        // check the auto mode selection
        table.find("input[type=radio][value=auto]").prop("checked", true);

        // bind mode change event
        table.find(".locModeRadio").on("change", $.proxy(onModeChange, this));

        // bind show on map button click
        table.find(".locationAutoShowOnMap").on("click", showOnMap);

        // bind pinpoint button click
        table.find(".locationManualPinpoint").on("click", $.proxy(pinpoint, this));

        // bind lat/lon fields change
        table.find("locationManualModeDataCell input[type=nuber]")
        .on("change", $.proxy(inputLatLon, this));

        return table;
    };

    onModeChange = function (evt) {
        var radio = $(evt.target);
        if (radio.is(":checked")) {
            changeMode.call(this, radio.val());
        }
    };

    onNewLocation = function (evt, loc) {
        showLocationData.call(this, loc);
        this.value = loc;
        $(this).triggerHandler("valueChange", [loc]);

        DEBUG && mdc.location.pause();
    };

    changeMode = function (mode) {
        this.mode = mode;
        if (mode === "auto") {
            this.manualData.hide();
            this.locationIsVisible = false;
            this.pleaseWaitMessage.show();
            this.autoLocationDisplay.hide();
            this.autoData.show();
            mdc.location.go();
        } else {
            mdc.location.pause();
            if (mdc.location.current) {
                mdc.location.set(mdc.location.current.latitude, mdc.location.current.longitude);
            } else {
                this.manualLat.val(null);
                this.manualLon.val(null);
            }
            this.autoData.hide();
            this.manualData.show();
        }
    };

    showLocationData = function (loc) {
        if (this.mode === "auto") {
            if (loc) {
                this.accuracyDisplay
                .html(_("Accuracy") + ": <strong> " + loc.accuracy + "m<strong>");

                if (!this.locationIsVisible) {
                    this.pleaseWaitMessage.hide();
                    this.autoLocationDisplay.show();
                    this.locationIsVisible = true;
                }
            } else {
                if (this.locationIsVisible) {
                    this.autoLocationDisplay.hide();
                    this.pleaseWaitMessage.show();
                    this.locationIsVisible = false;
                }
            }
        } else {
            // unbind change handler
            this.table.find("locationManualModeDataCell input[type=nuber]")
            .off("change", $.proxy(inputLatLon, this));

            if (loc) {
                this.manualLat.val(loc.latitude);
                this.manualLon.val(loc.longitude);
            } else {
                this.manualLat.val(null);
                this.manualLon.val(null);
            }

            // rebind change handler
            this.table.find("locationManualModeDataCell input[type=nuber]")
            .on("change", $.proxy(inputLatLon, this));
        }
    };

    showOnMap = function () {
        mdc.map.mode("view");
        $.mobile.changePage("#mapPage", { transition: "none" });
        mdc.map.centerOnUser();
    };

    inputLatLon = function () {
        var loc,
            lat = parseFloat(this.manualLat.val()),
            lon = parseFloat(this.manualLon.val());

        if (!isNaN(lat) && !isNaN(lon)) {
            loc = mdc.location.set(lat, lon, /* silent */ true);
            this.value = loc;
            $(this).triggerHandler("valueChange", [loc]);
        }
    };

    pinpoint = function () {
        mdc.map.mode("pinpoint");

        $.mobile.changePage("#mapPage", { transition: "none" });
        mdc.map.centerOnUser();

        mdc.map.pinpoint()
        .always(function () {
            console.log("pinpoint always");
            $.mobile.changePage("#mainPage", { transition: "none" });
            mdc.map.mode("view");
        })
        .done(function (lat, lon) {
            console.log("pinpoint", lat, lon);
            mdc.location.set(lat, lon);
        });
    };

}());


//
// PhotosFormItem
//
(function () {
    var liTakePhoto, ulPhotosList,
        startPhoto, photoSuccess, photoError, addPhotoListItem, removePhoto, removePhotoListItem, photoFilenames;

    mdc.PhotosFormItem =
        construct(mdc.FormItem,

                function (name, key, target, isRequired, isExpanded, isPersistent) {

                    LOG && console.log("form: Creating a new PhotosFormItem.");
                    DETAIL && console.log(JSON.stringify([name, key, isRequired, isExpanded, isPersistent]));

                    // call base constructor
                    this.base.ctor.call(this, name, key, "photos", "file", !!isRequired, isExpanded, isPersistent);

                    this.target = target;
                    this.photos = {};

                },

                {
                    render: function (isGroupItem) {

                        LOG && console.log("form: rendering a new PhotosFormItem.");
                        DETAIL && console.log(JSON.stringify([this.name, this.key]));

                        this.container = this.base.render.call(this, isGroupItem);

                        this.photoList = ulPhotosList.call(this);
                        this.takePhotoBtn = liTakePhoto.call(this);

                        this.container
                        .append($("<div data-role='controlgroup'/>")
                            .append($("<legend/>", { html: this.name }))
                            .append($("<div/>").append(this.photoList)));

                        this.photoList.append(this.takePhotoBtn);

                        // var that = this;
                        // setTimeout(function () {
                        //     console.log("faking photo");
                        //     photoSuccess.call(that, "http://localhost/mdc/gclogo.png");
                        //     photoSuccess.call(that, "http://localhost/mdc/gclogo.png");
                        //     photoSuccess.call(that, "http://localhost/mdc/gclogo.png");
                        // }, 5000);

                        return this.container;
                    },

                    clear: function () {
                        LOG && console.log("form: clearing photos.");

                        var name;
                        // remove photo list items
                        for (name in this.photos) {
                            removePhotoListItem.call(this, name);
                        }

                        // delete the photos
                        this.photos = {};
                    }
                }

        );

    startPhoto = function () {

        LOG && console.log("form: taking photo.");

        mdc.media.takePhoto().then(
                $.proxy(photoSuccess, this),
                $.proxy(photoError, this)
        );
    };

    photoSuccess = function (data) {
        var photo;

        if (!data) {
            LOG && console.log("form: photo error.");
            return;
        }

        LOG && console.log("form: photo success.");
        DETAIL && console.log(JSON.stringify(data));

        if (typeof data === "string") {
            photo = {
                    name: data.substr(data.lastIndexOf("/") + 1),
                    fullPath: data.replace("file://localhost",""),
                    lastModifiedDate: $.now()
            };
        } else {
            photo = data[0];
        }

        if (photo.name.indexOf(".") > -1) {
            photo.name = photo.name.replace(/\./g, "");
        }

        this.photos[photo.name] = photo;
        addPhotoListItem.call(this, photo);

        $(this).trigger("valueChange", [photoFilenames(this.photos)]);
    };

    photoError = function (err) {

        LOG && console.log(err === "Canceled." ? "form: photo cancelled." : "form: photo error.");
        DETAIL && console.log(JSON.stringify(err));

    };

    removePhoto = function (evt) {

        LOG && console.log("form: remove photo.");
        DETAIL && console.log($(evt.currentTarget).jqmData("photoName"));

        var name = $(evt.currentTarget).jqmData("photoName");

        removePhotoListItem.call(this, name);
        delete this.photos[name];

        $(this).trigger("valueChange", [photoFilenames(this.photos)]);
    };

    addPhotoListItem = function (photo) {
        var that = this;
        $("<li/>", { id: "li" + photo.name }).append(
                $("<a/>", { href: "#" })
                    .append($("<img/>", {
                        src: photo.fullPath.charAt(0) === "/" ? "file://" + photo.fullPath : photo.fullPath,
                        "class": "mdc-photo-item"
                    }))
                    .append($("<h5/>").html(photo.name))
                    .append($("<p/>").html("@" + hoursAndMins(photo.lastModifiedDate))),
                $("<a/>", { href: "#" })
                    .attr("title", "Delete photo")
                    .addClass("mdc-remove-photo-button")
                    .jqmData("photoName", photo.name)
                    .click(function (evt) { delay(function () { removePhoto.call(that, evt); }, that); })
        ).insertBefore(this.takePhotoBtn);

        this.photoList.listview("refresh");


    };

    removePhotoListItem = function (evt) {
        if (typeof evt === "string") {
            $("#li" + evt).remove();
        } else {
            LOG && console.log(JSON.stringify(evt));
        }
        this.photoList.listview("refresh");
    };

    liTakePhoto = function () {
        var that = this;
        return $("<li/>")
                .jqmData("theme", "a")
                .jqmData("icon", "plus")
                .append($("<a/>", { href: "#", click: function () { delay(startPhoto, that); } }).html(_("Take photo")));
    };

    ulPhotosList = function () {
        return $("<ul data-role='listview'></ul>")
                .addClass("mdc-form-photo-list")
                .jqmData("theme", "a")
                .jqmData("splitTheme", "a")
                .jqmData("inset", true)
                .jqmData("split-icon", "minus");
    };

    photoFilenames = function (photos) {
        return $.map(photos, function (photo) { return photo.fullPath; });
    };

}());


//
// RecordingFormItem
//
(function () {
    var btnRec, btnPlay, btnDelete, recording,
        record, togglePlay, deleteRecording, recordSuccess, recordError;

    mdc.RecordingFormItem =
        construct(mdc.FormItem,

                function (name, key, target, isRequired, isExpanded, isPersistent) {

                    LOG && console.log("form: Creating a new RecordingFormItem.");
                    DETAIL && console.log(JSON.stringify([name, key, isRequired, isExpanded, isPersistent]));

                    // call base constructor
                    this.base.ctor.call(this, name, key, "recording", "single_file", !!isRequired, isExpanded, isPersistent);

                    this.target = target;
                },

                {
                    render: function (isGroupItem) {

                        LOG && console.log("form: rendering a new RecordingFormItem.");
                        DETAIL && console.log(JSON.stringify([this.name, this.key]));

                        var buttons;

                        this.container = this.base.render.call(this, isGroupItem);

                        this.recordButton = btnRec.call(this);
                        this.playButton = btnPlay.call(this);
                        this.deleteButton = btnDelete.call(this);

                        buttons = $("<div data-role='controlgroup'></div>")
                        .jqmData("type", mdc.ui.saveSpace() ? "vertical": "horizontal")
                        .jqmData("mini", true)
                        .append($("<legend/>", { html: this.name }))
                        .append(this.recordButton, this.playButton, this.deleteButton);

                        this.container.append(buttons);

                        buttons.appendTo(this.container);

                        this.playButton.prop("disabled", true);
                        this.deleteButton.prop("disabled", true);

                        return this.container;
                    },

                    clear: function () {
                        LOG && console.log("form: clearing recording.");

                        this.value = null;
                        this.playButton.button("disable");
                        this.deleteButton.button("disable");
                    }
                }

        );

    record = function () {
        if (recording) {
            LOG && console.log("form: stopping audio capture.");

            mdc.media.recordStop();
        } else {
            LOG && console.log("form: starting audio capture.");

            recording = true;
            this.playButton.button("disable");
            this.deleteButton.button("disable");
            this.recordButton.button("caption", _("Stop"));

            mdc.media.recordAudio(30)
            .then($.proxy(recordSuccess, this), $.proxy(recordError, this));
        }
    };

    togglePlay = function () {
        var that = this;
        if (mdc.media.audioPlaying) {
            mdc.media.stopAudio();
        } else {
            that.playButton.button("caption", _("Stop"));
            mdc.media.playAudio(this.value)
            .always(function () {
                that.playButton.button("caption", _("Play"));
            });
        }
    };

    recordSuccess = function (data) {
        LOG && console.log("form: audio capture success.");
        DETAIL && console.log(JSON.stringify(data));

        this.value = data.src || data[0].fullPath || data;
        this.recordButton.button("caption", _("Record"));
        recording = false;

        if (!this.value) {
            this.playButton.button("disable");
            this.deleteButton.button("disable");
            alert("Error capturing audio", 1000, 2);
        } else {
            this.playButton.button("enable");
            this.deleteButton.button("enable");
        }

        $(this).trigger("valueChange", [this.value]);
    };

    recordError = function (err) {
        var oldval = this.value;

        LOG && console.log("form: audio capture error.");
        DETAIL && console.log(JSON.stringify(err));

        this.value = null;
        this.recordButton.button("caption", _("Record"));
        recording = false;

        if (oldval != null) {
            $(this).trigger("valueChange", [this.value]);
        }
    };

    deleteRecording = function () {
        if (recording) {
            LOG && console.log("form: stopping audio capture.");
            mdc.media.recordStop();
        }

        this.value = null;
        this.playButton.button("disable");
        this.deleteButton.button("disable");

        $(this).trigger("valueChange", [this.value]);
    };

    btnRec = function () {
        var that = this;
        return $("<button/>")
                .html(_("Record"))
                .click(function () { delay(record, that); })
                .append($("<div/>", { "class": "caption" }));
    };

    btnPlay = function () {
        var that = this;
        return $("<button/>")
                .html(_("Play"))
                .click(function () { delay(togglePlay, that); })
                .append($("<div/>", { "class": "caption" }));
    };

    btnDelete = function () {
        var that = this;
        return $("<button/>")
                .html(_("Delete"))
                .click(function () { delay(deleteRecording, that); })
                .append($("<div/>", { "class": "caption" }));
    };

}());

//
// TextFormItem
//
(function () {

    var autocompleteInput, autocompleteInputOnClick, textField, fieldWrap, onValueChanged;

    mdc.TextFormItem =
        construct(mdc.FormItem,

                function (name, key, initVal, isRequired, isExpanded, isPersistent, isMultiline, autocomplete) {

                    LOG && console.log("form: Creating a new TextFormItem.");
                    DETAIL && console.log(JSON.stringify([name, key, isRequired, isExpanded, isPersistent, isMultiline]));

                    // call base constructor
                    this.base.ctor.call(this, name, key, "text", "immediate", !!isRequired, isExpanded, isPersistent, isMultiline);
                    this.isMultiline = isMultiline;
                    this.autocomplete = autocomplete;
                    this.initVal = (initVal == null) ? null : initVal;
                    this.value = initVal;
                },

                {
                    render: function (isGroupItem) {
                        LOG && console.log("form: rendering a new TextFormItem.");
                        DETAIL && console.log(JSON.stringify([this.name, this.key]));

                        this.container = this.base.render.call(this, isGroupItem);

                        if (this.autocomplete) {
                            this.autocompleteInput = autocompleteInput.call(this, this.autocomplete);
                            this.container
                            .append(fieldWrap.call(this, this.autocompleteInput))
                            .on("click focus", "input", $.proxy(autocompleteInputOnClick, this));
                        } else {
                            this.textarea = textField.call(this, this.isMultiline);
                            this.container.append(fieldWrap.call(this, this.textarea));
                        }

                        return this.container;
                    },

                    clear: function () {
                        LOG && console.log("form: clearing text item.");

                        this.value = this.initVal;

                        if (this.autocomplete) {
                            this.autocompleteInput.val("");
                        } else {
                            this.textarea.val((this.value == null) ? "" : this.value);
                        }
                    }
                }
        );

    autocompleteInput = function () {
        return $("<input/>", { type: "search", id: "autocomplete_" + this.key, name: "autocomplete_" + this.key });
    };

    autocompleteInputOnClick = function (evt) {
        var that = this, dfrd;

        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();

        dfrd = mdc.ui.autocompletePopup
           .show(this.autocomplete, this.name);

        if (!dfrd) {
            return;
        }

        dfrd.done(function (value) {
            $(evt.target).val(value);
            onValueChanged.call(that, value);
        });
    };

    textField = function (multiline) {
        var el = multiline ?
            $("<textarea/>", { id: "textarea_" + this.key, name: "textarea_" + this.key  }) :
            $("<input/>", { type: "text", id: "textarea_" + this.key, name: "textarea_" + this.key });
        return el.val(this.value).change($.proxy(onValueChanged, this));
    };

    fieldWrap = function (el) {
        return [$("<label/>", { "for": el.attr("id") }).html(__(this.name)), el];
    };

    onValueChanged = function (val) {
        if (val !== undefined && typeof val === "string") {
            this.value = val;
        } else {
            this.value = this.textarea.val();
        }
        $(this).triggerHandler("valueChange", [this.value]);
    };

}());

//
// MdcFormItem
//
(function () {

    var hiddenField;

    mdc.MdcFormItem =
        construct(mdc.FormItem,

                function (name, key, itemType) {

                    LOG && console.log("form: Creating a new MdcFormItem.");
                    DETAIL && console.log(JSON.stringify([key, itemType]));

                    // call base constructor
                    this.base.ctor.call(this, name, key, itemType, "immediate", false, false, false);
                },

                {
                    render: function () {
                        LOG && console.log("form: rendering a new MdcFormItem.");
                        DETAIL && console.log(JSON.stringify([this.name, this.key, this.type]));

                        this.hidden = hiddenField.call(this);

                        return this.hidden;
                    },

                    clear: function () {
                        LOG && console.log("form: clearing mdc item.");

                        this.value = null;
                        this.hidden.val("");
                    }
                }
        );

    hiddenField = function () {
        var itemId = this.type + "_" + this.key;
        return $("<input/>", { type: "hidden", id: itemId, name: itemId });
    };

}());

//
// HiddenFormItem
//
(function () {

    var hiddenField, onValueChanged;

    mdc.HiddenFormItem =
        construct(mdc.FormItem,

                function (name, key, initVal, isRequired, isExpanded, isPersistent) {

                    LOG && console.log("form: Creating a new HiddenFormItem.");
                    DETAIL && console.log(JSON.stringify([name, key, isRequired, isExpanded, isPersistent]));

                    // call base constructor
                    this.base.ctor.call(this, name, key, "hidden", "immediate", !!isRequired, isExpanded, isPersistent);
                    this.initVal = (initVal == null) ? null : initVal;
                    this.value = (initVal == null) ? null : initVal;
                },

                {
                    render: function () {
                        LOG && console.log("form: rendering a new HiddenFormItem.");
                        DETAIL && console.log(JSON.stringify([this.name, this.key]));

                        this.hidden = hiddenField.call(this);

                        return this.hidden;
                    },

                    clear: function () {
                        LOG && console.log("form: clearing hidden item.");

                        this.value = this.initVal;
                        this.hidden.val((this.value == null) ? "" : this.value);
                    }
                }
        );

    hiddenField = function () {
        var el = $("<input/>", { type: "hidden", id: "hidden_" + this.key, name: "hidden_" + this.key });
        return el.val(this.value).change($.proxy(onValueChanged, this));
    };

    onValueChanged = function () {
        this.value = this.hidden.val();
        $(this).triggerHandler("valueChange", [this.value]);
    };

}());

//
// SelectFormItem
//
(function () {

    var select, fieldWrap, onValueChanged;

    mdc.SelectFormItem =
        construct(mdc.FormItem,

            function (name, key, initVal, options, isRequired, isExpanded, isPersistent) {

                LOG && console.log("form: Creating a new SelectFormItem.");
                DETAIL && console.log(JSON.stringify([name, key, options, isRequired, isExpanded, isPersistent]));

                // call base constructor
                this.base.ctor.call(this, name, key, "select", "immediate", !!isRequired, isExpanded, isPersistent);

                this.options = options;
                this.initVal = (initVal == null) ? null : initVal;
                this.value = initVal;

            },

            {
                render: function (isGroupItem) {
                    LOG && console.log("form: rendering a new SelectFormItem.");
                    DETAIL && console.log(JSON.stringify([this.name, this.key, this.options]));

                    this.container = this.base.render.call(this, isGroupItem);

                    this.select = select.call(this);
                    this.container.append(fieldWrap.call(this, this.select));

                    return this.container;
                },

                clear: function () {
                    LOG && console.log("form: clearing select item.");

                    if (this.initVal == null) {
                        this.value = null;
                        this.select.val(null).change(); // triggering the 'change' event handles element UI
                    } else {
                        this.value = this.initVal;
                        this.select.val(this.initVal).change();
                    }
                }
            }
        );

    select = function () {
        var i, k, j, l, itm, itmm, grp, sel, opt;

        sel = $("<select/>", { id: "select_" + this.key, name: "select_" + this.key })
                .append($("<option/>", { val: "" }).html(_("Please choose")))
                .change($.proxy(onValueChanged, this));

        for (i = 0, k = this.options.length; i < k; i++) {
            itm = this.options[i];
            if (itm.items) {
                grp = $("<optgroup/>", { label: __(itm.title) });
                sel.append(grp);
                for (j = 0, l = itm.items.length; j < l; j++) {
                    itmm =  itm.items[j];
                    grp.append($("<option/>", { value: itmm.value }).html(__(itmm.title)));
                }

            } else {
                opt = $("<option/>", { value: itm.value }).html(__(itm.title));
                sel.append(opt);
            }
        }

        (this.value != null) && sel.val(this.value);

        return sel;
    };

    fieldWrap = function (el) {
        return [$("<label/>", { "for": el.attr("id"), html: __(this.name) }), el];
    };

    onValueChanged = function () {
        this.value = this.select.val() || null;
        $(this).triggerHandler("valueChange", [this.value]);
    };

}());

//
//RadioFormItem
//
(function () {

    var radio, onValueChanged;

    mdc.RadioFormItem =
        construct(mdc.FormItem,

            function (name, key, initVal, options, isRequired, isExpanded, isPersistent, orientation) {

                LOG && console.log("form: Creating a new RadioFormItem.");
                DETAIL && console.log(JSON.stringify([name, key, options, isRequired, isExpanded, isPersistent, orientation]));

                // call base constructor
                this.base.ctor.call(this, name, key, "radio", "immediate", !!isRequired, isExpanded, isPersistent);

                this.options = options;
                this.orientation = orientation || "vertical";
                this.initVal = (initVal == null) ? null : initVal;
                this.value = initVal;

            },

            {
                render: function (isGroupItem) {

                    LOG && console.log("form: rendering a new RadioFormItem.");
                    DETAIL && console.log(JSON.stringify([this.name, this.key, this.options, this.orientation]));

                    this.container = this.base.render.call(this, isGroupItem);

                    this.radio = radio.call(this);
                    this.radio.appendTo(this.container);

                    return this.container;
                },

                clear: function () {
                    LOG && console.log("form: clearing radio item.");

                    if (this.initVal == null) {
                        this.value = null;
                        this.radio
                        .find(":checked").prop("checked", false); // this clears the selection
                    } else {
                        this.value = this.initVal;
                        this.radio
                        .find("[value=" + this.initVal + "]").prop("checked", true); // this clears the selection
                    }
                    this.radio.find("[type=radio]").checkboxradio("refresh"); // this handles element UI
                }
            }
        );

    radio = function () {
        var that = this,
           id = "radio_" + this.key,
           fieldset = (this.orientation === "horizontal") ?
                   $("<fieldset data-role='controlgroup' data-type='horizontal'></fieldset>") :
                   $("<fieldset data-role='controlgroup' data-type='vertical'></fieldset>");

        fieldset
        .jqmData("mini", true)
        .append($("<legend/>", { html: __(this.name) }))
        .append($.map(this.options, function (item, i) {
            var radioId = id + "_" + i;
            return [
                $("<input/>", { type: "radio", id: radioId, name: id, value: item.value })
                .prop("checked", item.value === that.value)
                .change($.proxy(onValueChanged, that)),
                $("<label/>", { "for": radioId, text: __(item.title) })
            ];
        }));

       return fieldset;
    };

    onValueChanged = function () {
        var name = ("radio_" + this.key).replace(/'/, "\\'");
        this.value = $(this.radio)
            .find("[name='" + name + "']:checked")
            .val();

        $(this).triggerHandler("valueChange", [this.value]);
    };

}());

//
//NumericFormItem
//
(function () {

    var numberField, fieldWrap, onValueChanged;

    mdc.NumericFormItem =
        construct(mdc.FormItem,

            function (name, key, initVal, min, max, isRequired, isExpanded, isPersistent) {

                LOG && console.log("form: Creating a new NumericFormItem.");
                DETAIL && console.log(JSON.stringify([name, key, min, max, initVal, isRequired, isExpanded, isPersistent]));

                // call base constructor
                this.base.ctor.call(this, name, key, "numeric", "immediate", !!isRequired, isExpanded, isPersistent);

                this.min = min;
                this.max = max;
                this.initVal = (initVal == null) ? min : initVal;

                this.selector = "#slider_" + this.key;
                this.value = this.initVal;
                $(this).triggerHandler("valueChange", [this.value]);

            },

            {
                render: function (isGroupItem) {

                    LOG && console.log("form: rendering a new NumericFormItem.");
                    DETAIL && console.log(JSON.stringify([this.name, this.key, this.min, this.max, this.initVal]));

                    this.container = this.base.render.call(this, isGroupItem);

                    this.numberField = numberField.call(this);
                    this.focusElement = this.numberField;

                    this.container.append(fieldWrap.call(this, this.numberField));

                    return this.container;
                },

                clear: function () {
                    LOG && console.log("form: clearing numeric item.");

                    this.value = this.initVal;
                    $(this.numberField).val((this.value == null) ? null : this.value);
                }
            }
        );

    numberField = function () {
        return $("<input/>", { type: "number", id: "number_" + this.key, name: "number_" + this.key })
            .change($.proxy(onValueChanged, this));
    };

    fieldWrap = function (el) {
        return [$("<label/>", { "for": el.attr("id") }).html(__(this.name)), el];
    };

    onValueChanged = function () {
        this.value = this.numberField.val();
        $(this).triggerHandler("valueChange", [this.value]);
    };

}());