/* global define: false, ko: false */
/* jshint maxparams: 11 */
define([
    "core/i18n", "core/router", "core/authentication/securityContext", "core/util/stringUtils",
    "core/util/urlUtils", "core/util/validationUtils", "domain/horse/horseBroker",
    "domain/horse/horseImpl", "viewmodels/athlete", "viewmodels/alerts", "viewmodels/shell"
], function athleteHorseViewModel(i18n, router, securityContext, stringUtils, urlUtils, validationUtils,
    horseBroker, horseImpl, athleteViewModel, alerts, shell) {
    "use strict";

    // state definition
    var viewModel = $.extend(false, {}, athleteViewModel), superActivate = viewModel.activate,
        currentEntity = ko.observable(horseImpl()), superCurrentEntity = viewModel.currentEntity, navs = {
            BASIC_DATA: "BASIC_DATA",
            IMAGES: "IMAGES"
        }, nav = ko.observable(), superAvailableGenders = viewModel.availableGenders, availableGenders = [
            {
                value: "male",
                text: i18n.t("app:GENDER_MALE")
            }, {
                value: "female",
                text: i18n.t("app:GENDER_FEMALE")
            }
        ];

    // lifecycle definition
    function activate(horseId) {
        if (horseId) {
            // allways return a promise
            return $.when(superActivate().done(function onSuccess() {
                return loadEntityByHorseId(horseId);
            })).done(refreshNav);
        } else {
            return $.when(superActivate().done(function onSuccess() {
                refreshCurrentEntity();
                refreshNav();
            }));
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
        currentEntity().athleteId = superCurrentEntity().id;
        if (currentEntity().id) {
            promise = horseBroker.update(currentEntity());
        } else {
            promise = horseBroker.save(currentEntity());
        }
        return promise.done(refreshCurrentEntity).done(function success() {
            router.navigateToProfile();
        });
    }

    // module revelation
    viewModel.i18n = i18n;
    viewModel.router = router;
    viewModel.securityContext = securityContext;
    viewModel.validationUtils = validationUtils;
    viewModel.horseBroker = horseBroker;

    // state revelation
    viewModel.currentEntity = currentEntity;
    viewModel.superCurrentEntity = superCurrentEntity;
    viewModel.navs = navs;
    viewModel.nav = nav;
    viewModel.availableGenders = availableGenders;
    viewModel.superAvailableGenders = superAvailableGenders;

    // lifecycle revelation
    viewModel.activate = activate;

    // behaviour revelation
    viewModel.save = save;

    return viewModel;
});