/* global define: false, ko: false */
/* jshint maxparams: 11 */
define([
    "core/i18n", "core/router", "core/authentication/securityContext", "core/util/stringUtils", "core/util/urlUtils",
    "core/util/validationUtils", "domain/athlete/athleteBroker", "domain/competition/competitionBroker",
    "domain/competition/competitionImpl", "domain/competitionCategory/competitionCategoryBroker", "domain/file/fileBroker",
    "domain/horse/horseBroker", "domain/judge/judgeBroker", "domain/specialty/specialtyBroker", "viewmodels/shell",
    "viewmodels/alerts"
], function competitionViewModel(i18n, router, securityContext, stringUtils, urlUtils, validationUtils, athleteBroker,
    competitionBroker, competitionImpl, competitionCategoryBroker, fileBroker, horseBroker, judgeBroker, specialtyBroker,
    shell, alerts) {
    "use strict";

    // state definition
    var viewModel = {}, currentEntity = ko.observable(competitionImpl()),
        availableCategories = ko.observable(), availableSpecialties = ko.observable();

    // lifecycle definition
    function activate(id) {
        if (id) {
            // allways return a promise
            return $.when(loadEntityByCompetitionId(id), loadAvailableCategories(), loadAvailableSpecialties());
        } else {
            return $.when(loadAvailableCategories(), loadAvailableSpecialties()).done(function onSuccess() {
                return refreshCurrentEntity();
            });
        }
    }

    // behaviour definition
    function refreshCurrentEntity(data) {
        currentEntity(competitionImpl(data));
        currentEntity().address.valueHasMutated();
    }

    function loadEntityByCompetitionId(id) {
        return competitionBroker.findById(id).done(refreshCurrentEntity);
    }

    function refreshCategories(data) {
        availableCategories(data);
    }

    function loadAvailableCategories() {
        return competitionCategoryBroker.findAll().done(refreshCategories);
    }

    function refreshSpecialties(data) {
        availableSpecialties(data);
    }

    function loadAvailableSpecialties() {
        return specialtyBroker.findAll().done(refreshSpecialties);
    }

    // module revelation
    viewModel.i18n = i18n;
    viewModel.securityContext = securityContext;
    viewModel.validationUtils = validationUtils;
    viewModel.athleteBroker = athleteBroker;
    viewModel.competitionBroker = competitionBroker;
    viewModel.fileBroker = fileBroker;
    viewModel.horseBroker = horseBroker;
    viewModel.judgeBroker = judgeBroker;
    viewModel.specialtyBroker = specialtyBroker;

    // state revelation
    viewModel.currentEntity = currentEntity;
    viewModel.availableCategories = availableCategories;
    viewModel.availableSpecialties = availableSpecialties;

    // lifecycle revelation
    viewModel.activate = activate;

    // behaviour revelation

    return viewModel;
});