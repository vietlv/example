/*
 * GIS Cloud Mobile
 *
 */


(function () {

    if (!mdc || !mdc.ui) {
        return;
    }

    mdc.ui.relays = {

        create: function () {

            // login form
            this.loginRelay = new Relay({
                init: function () { this.form = $("#login"); },
                onActivation: function () { this.form.show(); },
                onDeactivation: function () { this.form.hide("fast"); },
                check: function () { return !mdc.user.isLoggedIn(); },
                triggers: [
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.user, eventName: "loggedIn" }
                ]
            });

            // login form
            this.loginFormRelay = new Relay({
                init: function () {
                    this.button = $("#logInButton");
                    this.textinputs = $("#username, #password");
                },
                onActivation: function () {
                    mdc.ui.enableButton(this.button);
                    this.textinputs.textinput("enable");
                },
                onDeactivation: function () {
                    mdc.ui.disableButton(this.button);
                    this.textinputs.textinput("disable");
                },
                check: function () { return !mdc.user.isLoggedIn() && mdc.net.isAvailable(); },
                triggers: [
                    { element: mdc.net, eventName: "online" },
                    { element: mdc.net, eventName: "offline" },
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.user, eventName: "loggedIn" }
                ]
            });

            // sign up button
            this.signupButtonRelay = new Relay({
                init: function () {
                    this.button = $("#signupButton");
                },
                onActivation: function () {
                    mdc.ui.enableButton(this.button);
                },
                onDeactivation: function () {
                    mdc.ui.disableButton(this.button);
                },
                check: function () { return !mdc.user.isLoggedIn() && mdc.net.isAvailable(); },
                triggers: [
                    { element: mdc.net, eventName: "online" },
                    { element: mdc.net, eventName: "offline" },
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.user, eventName: "loggedIn" }
                ]
            });

            // log out button
            this.logOutButtonRelay = new Relay({
                init: function () { this.button = $("#logOutButton"); },
                onActivation: function () { mdc.ui.enableButton(this.button); },
                onDeactivation: function () { mdc.ui.disableButton(this.button); },
                check: function () { return mdc.user.isLoggedIn(); },
                triggers: [
                    { element: mdc.user, eventName: "loggedIn" },
                    { element: mdc.user, eventName: "loggedOut" }
                ]
            });

            // custom form relay
            this.customFormRelay = new Relay({
                init: function () { this.form = $("#customForm"); },
                onActivation: function () { this.form.show(); },
                onDeactivation: function () { this.form.hide(); },
                check: function () { return mdc.storage.has("selectedLayerForm"); },
                triggers: [
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.user, eventName: "loggedIn" },
                    { element: mdc.user, eventName: "mapSelected" },
                    { element: mdc.user, eventName: "layerSelected" },
                    { element: mdc.user, eventName: "formSelected" },
                    { element: mdc.packages, eventName: "packageCreated" }
                ]
            });

            // custom form title relay
            this.customFormTitleRelay = new Relay({
                init: function () { this.formTitle = $("#formTitle"); },
                onActivation: function () {
                    var title, form = mdc.storage.value("selectedLayerForm");

                    if (form) {
                        title = form.definition ?
                            __(form.definition.title) || form.definition.name :
                            form.name || "&nbsp;";
                    } else {
                        title = "&nbsp;";
                    }

                    this.formTitle.html(title);
                },
                onDeactivation: function () { this.formTitle.html("&nbsp;"); },
                check: function () { return mdc.storage.has("selectedLayerForm"); },
                triggers: [
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.user, eventName: "loggedIn" },
                    { element: mdc.user, eventName: "formSelected" },
                    { element: mdc.packages, eventName: "packageCreated" }
                ]
            });

            // choose layer message relay
            this.chooseLayerMessageRelay = new Relay({
                init: function () { this.element = $("#chooseLayerMessage"); },
                onActivation: function () { this.element.show(); },
                onDeactivation: function () { this.element.hide(); },
                check: function () {
                    return mdc.user.isLoggedIn() && !mdc.storage.has("selectedLayerForm") &&
                        !mdc.storage.has("presetMap") && !mdc.storage.has("presetLayer");
                },
                triggers: [
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.user, eventName: "loggedIn" },
                    { element: mdc.user, eventName: "mapSelected" },
                    { element: mdc.user, eventName: "layerSelected" },
                    { element: mdc.user, eventName: "formSelected" }
                ]
            });

            // send button
            this.sendButtonRelay = new Relay({
                onActivation: function () { mdc.ui.sendButton.enable(); },
                onDeactivation: function () { mdc.ui.sendButton.disable(); },
                check: function () {
                    return mdc.user.isLoggedIn() && mdc.storage.has("selectedLayerForm");
                },
                triggers: [
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.packages, eventName: "packageCreated" }
                ]
            });

            // map button
            this.mapButtonRelay = new Relay({
                onActivation: function () { mdc.ui.mapButton.enable(); },
                onDeactivation: function () { mdc.ui.mapButton.disable(); },
                check: function () {
                    return mdc.user.isLoggedIn() && mdc.net.isAvailable() &&
                        mdc.storage.has("selectedMapId");
                },
                triggers: [
                    { element: mdc.net, eventName: "online" },
                    { element: mdc.net, eventName: "offline" },
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.user, eventName: "loggedIn" },
                    { element: mdc.user, eventName: "mapSelected" },
                    { element: mdc.map, eventName: "mapReady" }
                ]
            });

            // refresh maps button
            this.refreshMapsButtonRelay = new Relay({
                init: function () { this.button = $("#refreshMapsButton"); },
                onActivation: function () { mdc.ui.enableButton(this.button); },
                onDeactivation: function () { mdc.ui.disableButton(this.button); },
                check: function () {
                    return mdc.user.isLoggedIn() && mdc.net.isAvailable() &&
                        !mdc.storage.has("presetMap");
                },
                triggers: [
                    { element: mdc.user, eventName: "loggedIn" },
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.net, eventName: "online" },
                    { element: mdc.net, eventName: "offline" }
                ]
            });

            // refresh layers button
            this.refreshLayersButtonRelay = new Relay({
                init: function () { this.button = $("#refreshLayersButton"); },
                onActivation: function () { mdc.ui.enableButton(this.button); },
                onDeactivation: function () { mdc.ui.disableButton(this.button); },
                check: function () {
                    return mdc.user.isLoggedIn() && mdc.net.isAvailable() &&
                        !mdc.storage.has("presetLayer") && mdc.storage.has("selectedMapId");
                },
                triggers: [
                    { element: mdc.user, eventName: "loggedIn" },
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.user, eventName: "mapSelected" },
                    { element: mdc.net, eventName: "online" },
                    { element: mdc.net, eventName: "offline" }
                ]
            });

            // refresh form button
            this.refreshFormButtonRelay = new Relay({
                init: function () { this.button = $("#refreshFormButton"); },
                onActivation: function () { mdc.ui.enableButton(this.button); },
                onDeactivation: function () { mdc.ui.disableButton(this.button); },
                check: function () {
                    return mdc.user.isLoggedIn() && mdc.net.isAvailable() &&
                        mdc.storage.has("selectedLayerForm");
                },
                triggers: [
                    { element: mdc.user, eventName: "loggedIn" },
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.user, eventName: "formSelected" },
                    { element: mdc.user, eventName: "mapSelected" },
                    { element: mdc.user, eventName: "layerSelected" },
                    { element: mdc.net, eventName: "online" },
                    { element: mdc.net, eventName: "offline" }
                ]
            });

            // maps select
            this.mapsSelectRelay = new Relay({
                init: function () { this.select = $("#mapsSelect"); },
                onActivation: function () { mdc.ui.enableSelect(this.select); },
                onDeactivation: function () { mdc.ui.disableSelect(this.select); },
                check: function () {
                    return mdc.user.isLoggedIn() && mdc.net.isAvailable() &&
                        !mdc.storage.has("presetMap") && mdc.storage.has("userMaps");
                },
                triggers: [
                    { element: mdc.user, eventName: "loggedIn" },
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.user, eventName: "mapSelected" },
                    { element: mdc.user, eventName: "mapsLoaded" },
                    { element: mdc.net, eventName: "online" },
                    { element: mdc.net, eventName: "offline" }
                ]
            });

            // layers select
            this.layersSelectRelay = new Relay({
                init: function () { this.select = $("#layersSelect"); },
                onActivation: function () { mdc.ui.enableSelect(this.select); },
                onDeactivation: function () { mdc.ui.disableSelect(this.select); },
                check: function () {
                    return mdc.user.isLoggedIn() && mdc.net.isAvailable() &&
                        mdc.storage.has("selectedMapId") &&
                        !mdc.storage.has("presetLayer") && mdc.storage.has("userLayers");
                },
                triggers: [
                    { element: mdc.user, eventName: "loggedIn" },
                    { element: mdc.user, eventName: "loggedOut" },
                    { element: mdc.user, eventName: "mapSelected" },
                    { element: mdc.user, eventName: "layersLoaded" },
                    { element: mdc.net, eventName: "online" },
                    { element: mdc.net, eventName: "offline" }
                ]
            });

            // username display
            this.usernameDisplayRelay = new Relay({
                init: function () { this.elems = $("#logOutButton"); },
                onActivation: function () {
                    var text = "Log out " + mdc.user.data().username;
                    try {
                        this.elems.button("caption", text);
                    } catch (err) {
                        this.elems.html(text);
                    }
                },
                onDeactivation: function () {
                    var text = "Log out";
                    try {
                        this.elems.button("caption", text);
                    } catch (err) {
                        this.elems.html(text);
                    }
                },
                check: function () {
                    return mdc.user.isLoggedIn();
                },
                triggers: [
                    { element: mdc.user, eventName: "loggedIn" },
                    { element: mdc.user, eventName: "loggedOut" }
                ]
            });

            return this;
        },

        checkAll: function () {
            var i;

            for (i in this) {
                if (this.hasOwnProperty(i)) {
                    if (this[i] instanceof Relay) {
                        this[i].check();
                    }
                }
            }

            return this;
        }

    };

}());