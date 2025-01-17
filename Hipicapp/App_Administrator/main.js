﻿requirejs.config({
    paths: {
        'text': '../Scripts/text',
        'i18next': '../Scripts/i18next',
        'i18n': '../Scripts/require-i18next',
        'async': '../Scripts/async',
        'durandal': '../Scripts/durandal',
        'plugins': '../Scripts/durandal/plugins',
        'transitions': '../Scripts/durandal/transitions'
    },
    i18next: {
        ns: "app",
        fallbackLng: "es",
        detectLngQS: "locale",
        lowerCaseLng: true,
        useCookie: false,
        resGetPath: "__lng__/__ns__.json",
        supportedLngs: {
            es: [
                "app"
            ]
        }
    }
});

define('jquery', function () { return jQuery; });
define('knockout', ko);
define('gmaps', ['async!https://maps.google.com/maps/api/js?key=AIzaSyBdhF5Dy-TepU3vwbWsbIP8RGsIJW72Dhg&signed_in=true&libraries=places'],
    function () {
        console.log('Google maps loaded');
        return window.google.maps;
    });

define([
    "bindings/addressBinding", "bindings/compareBinding", "bindings/datetimepickerValueBinding",
    "bindings/epochAfterBinding", "bindings/epochFutureBinding", "bindings/epochValueBinding",
    "bindings/fileuploadBinding", "bindings/iCheckBinding", "bindings/imageHolderBinding", "bindings/popoverBinding",
    "core/authentication/authenticationBroker", "core/authentication/securityContext", "durandal/system",
    "durandal/app", "durandal/viewLocator", "durandal/binder", "i18n!nls", "core/router"
], function (addressBinding, compareBinding, datetimepickerValueBinding, epochAfterBinding, epochFutureBinding,
    epochValueBinding, fileuploadBinding, iCheckBinding, imageHolderBinding, popoverBinding, authenticationBroker,
    securityContext, system, app, viewLocator, binder, i18n, router) {
    // Fast click
    FastClick.attach(document.body);

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    var i18NOptions = {
        detectFromHeaders: false,
        lng: window.navigator.userLanguage || window.navigator.language || 'es-ES',
        //lng: 'es-ES',
        fallbackLang: 'es',
        ns: 'app',
        resGetPath: '__lng__/__ns__.json',
        useCookie: false
    };

    moment.locale("es");

    // setup knockout
    // custom binding handlers
    ko.bindingHandlers.address = addressBinding;
    ko.bindingHandlers.compare = compareBinding;
    ko.bindingHandlers.datetimepickerValue = datetimepickerValueBinding;
    ko.bindingHandlers.epochAfter = epochAfterBinding;
    ko.bindingHandlers.epochFuture = epochFutureBinding;
    ko.bindingHandlers.epochValue = epochValueBinding;
    ko.bindingHandlers.fileupload = fileuploadBinding;
    ko.bindingHandlers.iCheck = iCheckBinding;
    ko.bindingHandlers.imageHolder = imageHolderBinding;
    ko.bindingHandlers.popover = popoverBinding;

    app.title = 'Hipicapp';

    app.configurePlugins({
        router: true,
        dialog: true
    });

    app.start().then(function () {
        i18n.init(i18NOptions, function () {
            //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
            //Look for partial views in a 'views' folder in the root.
            viewLocator.useConvention();

            //Call localization on view before binding...
            binder.binding = function (obj, view) {
                $(view).i18n();
            };

            //Show the app by setting the root view model for our application with a transition.
            //app.adaptToDevice();

            // shell
            authenticationBroker.setup();
            if (securityContext.isAuthenticated()) {
                app.setRoot("viewmodels/shell", "entrance");
            } else {
                app.setRoot("viewmodels/login", "entrance");
            }
        });
    });
});