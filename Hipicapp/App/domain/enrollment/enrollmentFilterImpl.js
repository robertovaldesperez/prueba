/* global define: false*/
define(function enrollmentFilterImpl() {
    "use strict";

    return function enrollmentFilterImpl(athleteId) {
        var filter = {};

        filter.athleteId = ko.observable(athleteId);

        return filter;
    };
});