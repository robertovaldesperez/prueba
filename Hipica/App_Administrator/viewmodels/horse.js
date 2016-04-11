/* global define: false, ko: false */
/* jshint maxparams: 11 */
define([
    "core/i18n", "core/router", "core/authentication/securityContext", "core/util/stringUtils",
    "core/util/urlUtils", "core/util/validationUtils", "domain/horse/horseBroker",
    "domain/horse/horseImpl", "viewmodels/shell", "viewmodels/alerts"
],
    function horseViewModel(i18n, router, securityContext, stringUtils, urlUtils,
                                 validationUtils, horseBroker, horseImpl, shell,
                                 alerts) {
        "use strict";

        // state definition
        var viewModel = {}, currentEntity = ko.observable(horseImpl()), navs = {
            BASIC_DATA: "BASIC_DATA",
            IMAGES: "IMAGES"
        }, nav = ko.observable();

        // lifecycle definition
        function activate(athleteId, horseId) {
            currentEntity().athleteId = athleteId;
            if (athleteId && horseId) {
                // allways return a promise
                return loadEntityByHorseId(horseId).done(refreshNav);
            } else {
                refreshCurrentEntity();
                refreshNav();
            }
        }

        function refreshNav() {
            nav(navs.BASIC_DATA);
        }

        // behaviour definition
        function refreshCurrentEntity(data) {
            currentEntity(horseImpl(data));
        }

        function loadEntityByHorseId(id) {
            return horseBroker.findById(id).done(refreshCurrentEntity);
        }

        function save() {
            var promise;
            if (currentEntity().id) {
                promise = horseBroker.update(currentEntity());
            } else {
                promise = horseBroker.save(currentEntity());
            }
            return promise.done(refreshCurrentEntity);
        }

        // module revelation
        viewModel.i18n = i18n;
        viewModel.securityContext = securityContext;
        viewModel.validationUtils = validationUtils;
        viewModel.horseBroker = horseBroker;

        // state revelation
        viewModel.currentEntity = currentEntity;
        viewModel.navs = navs;
        viewModel.nav = nav;

        // lifecycle revelation
        viewModel.activate = activate;

        // behaviour revelation
        viewModel.save = save;

        return viewModel;
    });