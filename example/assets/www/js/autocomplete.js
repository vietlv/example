/*
 * GIS Cloud Mobile
 *
 */

if (!window.mdc) { window.mdc = {}; }

(function () {

    var LOG = window.LOG, DETAIL = window.DETAIL,
        value, list, container;

    mdc.autocomplete = {

        setDebug: function (onoff) {
            if (typeof onoff === "boolean") {
                LOG = !!onoff;
                DETAIL = !!onoff;
            } else if (typeof onoff === "object") {
                LOG = !!onoff.log;
                DETAIL = !!onoff.detail;
            }
        },

        init: function (el) {
            container = el;
            return this;
        },

        set: function (defn, name) {
            name = name || "";

            container.empty();

            list = $("<ul/>")
                .jqmData("role", "listview")
                .jqmData("filterPlaceholder", name)
                .jqmData("filter", true)
                .jqmData("filterReveal", true)
                .jqmData("filterTheme", "a");

            value = null;

            if (defn.data) {
                list
                .append($.map(defn.data, autocompleteItem))
                .appendTo(container)
                .listview();
            } else {
                list
                .appendTo(container)
                .listview({
                    "beforefilter": getBeforeFilterHandler(defn)
                });
            }

            return this;
        },

        value: function (val) {
            if (val === undefined) {
                return value;
            }

            value = val;

            return this;
        }
    };

    function getBeforeFilterHandler(defn) {
        var handler;

        if (defn.rest) {

            handler = function (e, data) {
                var term = $(data.input).val(),
                    minLength = defn.minTermLength || 3;

                if (term.length >= minLength) {
                    displayLoader();
                    mdc.rest.get(insertTerm(defn.rest, term))
                    .done(function (response) { displayRestData(response, defn); })
                    .fail(displayCouldNotGetData);
                }

            };

        } else if (defn.layer) {

            handler = function (e, data) {
                var term = $(data.input).val(),
                    minLength = defn.minTermLength || 2,
                    layerId = (defn.layer === "auto") ?
                        mdc.storage.value("selectedLayerId") : defn.layer,
                    url = "layers/" + layerId + "/features?format";

                if (defn.queryExpression) {
                    url += "&where=" + insertTerm(defn.queryExpression, term);
                }

                if (term.length >= minLength) {
                    displayLoader();
                    mdc.rest.get(url)
                    .done(function (response) { displayRestData(response, defn); })
                    .fail(displayCouldNotGetData);
                }
            };

        }

        return handler;
    }

    function displayRestData(response, defn) {
        list
        .html("")
        .append($.map(response[defn.dataNode || "data"], function (itm) {
            if (defn.labelExpression) {
                return autocompleteItem({
                    value: insertData(defn.valueExpression, itm),
                    title: insertData(defn.labelExpression, itm)
                });
            }
            return autocompleteItem(insertData(defn.valueExpression, itm));
        }))
        .listview("refresh")
        .trigger( "updatelayout");
    }

    function displayCouldNotGetData() {
        list
        .html("")
        .append($("<li>")
            .append($("<a/>", { href: "#"})
                .html("Could not find any data. <br/>" +
                      "Click here to accept what has been manual entered.")
                .click(acceptManualEntry)))
        .listview("refresh")
        .trigger( "updatelayout");
    }

    function displayLoader() {
        list
        .html("<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'>&nbsp;</span></div></li>")
        .listview("refresh")
        .trigger( "updatelayout");
    }

    function autocompleteItem(val) {
        var title, value, item;

        if (typeof val === "string") {
            value = val;
            title = val;
        } else {
            value = val.value;
            title = val.title;
        }

        item = $("<li/>")
            .append($("<a/>", { href: "#", text: title }))
            .data("value", value)
            .click(autocompleteItemOnclick);

        return item;
    }

    function autocompleteItemOnclick() {
        var item = $(this);
            val = item.data("value");
        value = val;
        window.history.back();
        $(mdc.autocomplete).triggerHandler("done");
    }

    function acceptManualEntry() {
        var val = container.find(".ui-input-text").val();
        value = val;
        window.history.back();
        $(mdc.autocomplete).triggerHandler("done");
    }

    function insertTerm(str, term) {
        return str.replace("${term}", term);
    }

    function insertData(str, data) {
        return str.replace(
            /\$\{([^}]+?)\}/g,
            function (match, prop) {
                if (prop === "ID") {
                    return data.__id;
                }
                return getProperty(prop, data);
            }
        );
    }

    function getProperty(prop, obj) {
        var chain, cur;

        if (obj == null) { return null; }

        chain = prop.split(".");

        if (chain.length === 1) {
            return obj[prop];
        }

        chain.reverse();
        cur = obj[chain.pop()];
        while (cur != null && chain.length) {
            cur = cur[chain.pop()];
        }

        return cur;
    }

}());