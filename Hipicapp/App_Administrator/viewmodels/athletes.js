/* global _: false, define: false, ko: false */
/* jshint maxparams: 15, maxstatements: 40 */
define([
    "core/config", "core/i18n", "core/crud/findRequestImpl", "core/crud/pageImpl",
    "core/crud/pagerImpl", "core/crud/pageRequestImpl", "core/util/validationUtils",
    "domain/athlete/athleteBroker", "domain/athlete/athleteFilterImpl",
    "domain/athlete/athleteSortImpl", "domain/athlete/athleteImpl", "durandal/app",
    "viewmodels/alerts", "viewmodels/shell"
], function athletes(config, i18n, findRequestImpl, pageImpl, pagerImpl, pageRequestImpl,
    validationUtils, athleteBroker, athleteFilterImpl, athleteSortImpl, athleteImpl, app, alerts, shell) {
    "use strict";

    // state definition
    var viewModel = {}, PAGE_SIZE = config.PAGE_SIZE, PAGE_SIZES = config.PAGE_SIZES, nextFilter =
        ko.observable(athleteFilterImpl()), currentFilter = athleteFilterImpl(), currentSort =
        ko.observable(athleteSortImpl()), currentPage = ko.observable(pageImpl()), currentPager =
        ko.observable(pagerImpl()), currentPageSize = ko.observable(PAGE_SIZE), availableGenders = {
            "male": i18n.t("app:GENDER_MALE"), "female": i18n.t("app:GENDER_FEMALE")
        };

    // lifecycle definition
    function activate() {
        // allways return a promise
        return loadCurrentPage();
    }

    // behaviour definition
    function refreshCurrentPage(data) {
        currentPage(pageImpl(data));
        currentPager(pagerImpl(data));
    }

    function loadPageByIndex(index, totalElements) {
        if (index === 0 || index > 0 && index < currentPage().totalPages) {
            return athleteBroker.findBy(
                findRequestImpl(currentFilter, pageRequestImpl(index, currentPageSize, currentSort,
                    totalElements))).done(refreshCurrentPage);
        }
    }

    function loadFirstPage() {
        return loadPageByIndex(0);
    }

    function loadCurrentPage() {
        return loadPageByIndex(currentPage().number, currentPage().totalPages);
    }

    function loadLastPage() {
        return loadPageByIndex(currentPage().totalPages - 1);
    }

    function search() {
        // deep copy next filter
        currentFilter = $.extend(true, {}, nextFilter());

        return loadFirstPage();
    }

    function clearFilter() {
        nextFilter(athleteFilterImpl());

        return search();
    }

    function sortByProperty(property) {
        currentSort().setFirstOrderByProperty(property);
        currentSort().getOrderByIndex(0).cycleOrder();

        return loadCurrentPage();
    }

    function deleteRow(athlete) {
        app.showMessage(i18n.t('DELETE_MESSAGE_BOX_CONTENT'), i18n.t('DELETE_MESSAGE_BOX_TITLE'), [
            i18n.t('YES'), i18n.t('NO')
        ]).done(function hideMessage(answer) {
            if (answer === i18n.t('YES')) {
                athleteBroker.erase(athlete).done(loadCurrentPage);
            }
        });
    }

    function getRowClass(row) {
        var rowClass = "";

        if (!row.user || !row.user.enabled) {
            rowClass = "danger";
        }/* else if (row.userType === userImpl.userType.CLIENT) {
            rowClass = "warning";
        } else if (row.userType === userImpl.userType.CONSUMER) {
            rowClass = "success";
        } else if (row.userType === userImpl.userType.USER) {
            rowClass = "info";
        }*/

        return rowClass;
    }

    // module revelation
    viewModel.shell = shell;
    viewModel.i18n = i18n;
    viewModel.validationUtils = validationUtils;
    viewModel.athleteBroker = athleteBroker;

    // state revelation
    viewModel.nextFilter = nextFilter;
    viewModel.currentSort = currentSort;
    viewModel.currentPage = currentPage;
    viewModel.currentPager = currentPager;
    viewModel.currentPageSize = currentPageSize;
    viewModel.availablePageSizes = PAGE_SIZES;
    viewModel.availableGenders = availableGenders;

    // lifecycle revelation
    viewModel.activate = activate;

    // behaviour revelation
    viewModel.refreshCurrentPage = refreshCurrentPage;
    viewModel.loadPageByIndex = loadPageByIndex;
    viewModel.loadFirstPage = loadFirstPage;
    viewModel.loadCurrentPage = loadCurrentPage;
    viewModel.loadLastPage = loadLastPage;
    viewModel.search = search;
    viewModel.clearFilter = clearFilter;
    viewModel.deleteRow = deleteRow;
    viewModel.getRowClass = getRowClass;

    // bind helpers
    viewModel.sortByName = _.partial(sortByProperty, athleteImpl.properties.NAME);
    viewModel.getOrderIconTitleForName = ko.computed(function getOrderIconTitleForName() {
        return currentSort().getOrderByProperty(athleteImpl.properties.NAME).getIconTitle();
    });
    viewModel.getOrderIconClassForName = ko.computed(function getOrderIconClassForName() {
        return currentSort().getOrderByProperty(athleteImpl.properties.NAME).getIconClass();
    });

    viewModel.sortBySurnames = _.partial(sortByProperty, athleteImpl.properties.SURNAMES);
    viewModel.getOrderIconTitleForSurnames = ko.computed(function getOrderIconTitleForSurnames() {
        return currentSort().getOrderByProperty(athleteImpl.properties.SURNAMES).getIconTitle();
    });
    viewModel.getOrderIconClassForSurnames = ko.computed(function getOrderIconClassForSurnames() {
        return currentSort().getOrderByProperty(athleteImpl.properties.SURNAMES).getIconClass();
    });

    viewModel.sortByFederation = _.partial(sortByProperty, athleteImpl.properties.FEDERATION);
    viewModel.getOrderIconTitleForFederation = ko.computed(function getOrderIconTitleForFederation() {
        return currentSort().getOrderByProperty(athleteImpl.properties.FEDERATION).getIconTitle();
    });
    viewModel.getOrderIconClassForFederation = ko.computed(function getOrderIconClassForFederation() {
        return currentSort().getOrderByProperty(athleteImpl.properties.FEDERATION).getIconClass();
    });

    /*viewModel.sortByBirthDate = _.partial(sortByProperty, athleteImpl.properties.BIRTH_DATE);
    viewModel.getOrderIconTitleForBirthDate = ko.computed(function getOrderIconTitleForBirthDate() {
        return currentSort().getOrderByProperty(athleteImpl.properties.BIRTH_DATE).getIconTitle();
    });
    viewModel.getOrderIconClassForBirthDate = ko.computed(function getOrderIconClassForBirthDate() {
        return currentSort().getOrderByProperty(athleteImpl.properties.BIRTH_DATE).getIconClass();
    });*/

    return viewModel;
});