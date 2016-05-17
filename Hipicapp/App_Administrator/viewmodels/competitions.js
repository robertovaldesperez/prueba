/* global _: false, define: false, ko: false */
/* jshint maxparams: 15, maxstatements: 40 */
define([
    "core/config", "core/i18n", "core/crud/findRequestImpl", "core/crud/pageImpl",
    "core/crud/pagerImpl", "core/crud/pageRequestImpl", "core/util/validationUtils",
    "domain/competition/competitionBroker", "domain/competition/competitionFilterImpl",
    "domain/competition/competitionSortImpl", "domain/competition/competitionImpl", "durandal/app",
    "viewmodels/alerts", "viewmodels/shell"
], function competitions(config, i18n, findRequestImpl, pageImpl, pagerImpl, pageRequestImpl,
    validationUtils, competitionBroker, competitionFilterImpl, competitionSortImpl, competitionImpl,
    app, alerts, shell) {
    "use strict";

    // state definition
    var viewModel = {}, PAGE_SIZE = config.PAGE_SIZE, PAGE_SIZES = config.PAGE_SIZES, nextFilter =
        ko.observable(competitionFilterImpl()), currentFilter = competitionFilterImpl(), currentSort =
        ko.observable(competitionSortImpl()), currentPage = ko.observable(pageImpl()), currentPager =
        ko.observable(pagerImpl()), currentPageSize = ko.observable(PAGE_SIZE);

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
            return competitionBroker.findBy(
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
        nextFilter(competitionFilterImpl());

        return search();
    }

    function sortByProperty(property) {
        currentSort().setFirstOrderByProperty(property);
        currentSort().getOrderByIndex(0).cycleOrder();

        return loadCurrentPage();
    }

    function deleteRow(competition) {
        app.showMessage(i18n.t('DELETE_MESSAGE_BOX_CONTENT'), i18n.t('DELETE_MESSAGE_BOX_TITLE'), [
            i18n.t('YES'), i18n.t('NO')
        ]).done(function hideMessage(answer) {
            if (answer === i18n.t('YES')) {
                competitionBroker.erase(competition).done(loadCurrentPage);
            }
        });
    }

    function getRowClass(row) {
        var rowClass = "";

        if (moment(row.endDate) < moment()) {
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

    function simulateScore(competition) {
        competitionBroker.simulateScore(competition).done(loadCurrentPage);
    }

    // module revelation
    viewModel.shell = shell;
    viewModel.i18n = i18n;
    viewModel.validationUtils = validationUtils;
    viewModel.competitionBroker = competitionBroker;

    // state revelation
    viewModel.nextFilter = nextFilter;
    viewModel.currentSort = currentSort;
    viewModel.currentPage = currentPage;
    viewModel.currentPager = currentPager;
    viewModel.currentPageSize = currentPageSize;
    viewModel.availablePageSizes = PAGE_SIZES;

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
    viewModel.simulateScore = simulateScore;

    // bind helpers
    viewModel.sortByName = _.partial(sortByProperty, competitionImpl.properties.NAME);
    viewModel.getOrderIconTitleForName = ko.computed(function getOrderIconTitleForName() {
        return currentSort().getOrderByProperty(competitionImpl.properties.NAME).getIconTitle();
    });
    viewModel.getOrderIconClassForName = ko.computed(function getOrderIconClassForName() {
        return currentSort().getOrderByProperty(competitionImpl.properties.NAME).getIconClass();
    });

    return viewModel;
});