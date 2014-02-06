/*
 * GIS Cloud Mobile
 *
 */

window.mdc = window.mdc || {};

// from: http://jquerymobile.com/test/docs/pages/phonegap.html
// "We've heard reports that webviews on some platforms, like BlackBerry, support cross-domain loading, but that jQuery core incorrectly sets $.support.cors value to false which disables cross-domain $.ajax() requests and will cause the page or assets to fail to load.
$.support.cors = true;

$(document).bind("mobileinit", function () {

    $.mobile.loadingMessage = "&nbsp;";
    $.mobile.selectmenu.prototype.options.nativeMenu = true;
    $.mobile.pushStateEnabled = false; // also from http://jquerymobile.com/test/docs/pages/phonegap.html
    $.mobile.page.prototype.options.backBtnTheme = "a";
    $.mobile.page.prototype.options.backBtnText = _("Back");

});