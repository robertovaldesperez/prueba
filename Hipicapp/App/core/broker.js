/* global $: false, amplify: false, define: false, ko: false */
define(["core/authentication/securityContext", "core/i18n", "core/util/csrfUtils",
    "core/exceptionHandler", "plugins/router", "viewmodels/alerts"
], function brokerUtils(securityContext, i18n, csrfUtils, exceptionHandler, router, alerts) {
    "use strict";

    var utils = {}, HASH_CHAR = "#", requestMappings = {
        BACKEND: "api",
        AUTHENTICATION: "authentication",
        ID: "{id}",
        EMAIL: "{userName}",
        KEY: "{key}",
        CLASSIFICATION: "classification",
        PERSONAL_INFORMATION: "personal-information",
        USERS: "users",
        USER: "user",
        JUDGES: "judges",
        JUDGE: "judge",
        ATHLETES: "athletes",
        ATHLETE: "athlete",
        ATHLETE_ID: "{athleteId}",
        HORSES: "horses",
        HORSE: "horse",
        COMPETITION_ID: "{competitionId}",
        COMPETITIONS: "competitions",
        COMPETITION: "competition",
        COMPETITION_CATEGORIES: "competitionCategories",
        COMPETITION_CATEGORY: "competitionCategory",
        CATEGORIES: "categories",
        CATEGORY: "category",
        BANNERS: "banners",
        BANNER: "banner",
        SPECIALTIES: "specialties",
        SPECIALTY: "specialty",
        SPECIALTY_ID: "{specialtyId}",
        HANDLERS: "Handlers/AjaxFileUploaderHandler.upload",
        URL_TITLE: "{urlTitle}",
        TOKEN: "token",
        SETUP: "setup",
        GET: "get",
        GET_BY_CURRENT_USER: "getByCurrentUser",
        ADULT_RANKINGS_BY_SPECIALTY_ID: "adultRankingsBySpecialtyId",
        FULL_ADULT_RANKINGS_BY_SPECIALTY_ID: "fullAdultRankingsBySpecialtyId",
        FIND_NEXT_BY_SPECIALTY_ID: "findNextBySpecialtyId",
        FIND_VISIBLE_BY_SPECIALTY_ID: "findVisibleBySpecialtyId",
        LOGIN: "login",
        LOGOUT: "logout",
        UPLOAD: "upload",
        FIND: "find",
        FIND_ALL: "findAll",
        FIND_BY_CURRENT_USER: "findByCurrentUser",
        FIND_INSCRIPTIONS: "findInscriptions",
        FIND_SEMINARY: "findSeminary",
        FINDWITHASSIGNMENT: "findByWithAssignment",
        ASSIGNALLJUDGES: "assignAllJudges",
        ASSIGNALLJUDGESBYPAGE: "assignAllJudgesById",
        ASSIGNALLJUDGESBYFILTER: "assignAllJudgesByFilter",
        UNASSIGNALLJUDGES: "unassignAllJudges",
        UNASSIGNALLJUDGESBYPAGE: "unassignAllJudgesById",
        UNASSIGNALLJUDGESBYFILTER: "unassignAllJudgesByFilter",
        ASSIGNUNASSIGNJUDGE: "assignUnassignJudge",
        HAS_ENROLLED: "hasEnrolled",
        FILES: "files",
        FILE: "file",
        DOWNLOAD: "download",
        DOWNLOAD_ADVANCE_PROGRAM: "downloadAdvanceProgram",
        SIMULATE_SCORE: "simulateScore",
        INSCRIPTION: "inscription",
        IMAGES: "images",
        PHOTO: "photo",
        SIGN_IN: "signIn",
        REGISTER: "register",
        RESET_PASSWORD: "resetPassword",
        CHECK_TICKET: "checkTicket",
        UPDATE_PASSWORD: "updatePassword",
        ENABLE: "enable",
        DISABLE: "disable",
        SAVE: "save",
        UPDATE: "update",
        DELETE: "delete"
    }, REQUEST_TYPE = "ajax", verb = {
        HEAD: "HEAD",
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        DELETE: "DELETE"
    }, CONTENT_TYPE = "application/json; charset=utf-8", DATA_TYPE = "json", DEFAULT_CACHE_TIMEOUT =
        3, EXCEPTION_HANDLER_DECODER = "exceptionHandler", requestCount = ko.observable(0);

    /*ko.mapping.defaultOptions().ignore = [
        "getIconTitle", "getIconClass"
    ];*/

    amplify.subscribe("request.ajax.preprocess", function ajaxSetup(defnSettings, settings, ajaxSettings) {
        ajaxSettings.cache = false;
    });

    amplify.subscribe("request.before.ajax", function incrementRequestCount() {
        requestCount(requestCount() + 1);
    });

    function doBefore(xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + securityContext.getAuthenticationToken());

        return csrfUtils.appendXsrfToXhr(xhr) && csrfUtils.appendCsrfToXhr(xhr);
    }

    function beforeWrite(xhr) {
        xhr.readonly = false;

        return doBefore(xhr);
    }

    function beforeRead(xhr) {
        xhr.readonly = true;

        return doBefore(xhr);
    }

    function beforeLogin(xhr) {
        xhr.login = true;

        return doBefore(xhr);
    }

    function dataMap(data) {
        return _.isEmpty(data) ? undefined : ko.toJSON(data);
    }

    function entityDataMap(data) {
        return ko.toJSON({ d: data });
    }
    /* jshint camelcase: false */
    amplify.request_original.decoders.exceptionHandler =
        function handler(data, status, xhr, success, error) {
            requestCount(requestCount() - 1);

            csrfUtils.extractCsrfFromXhr(xhr);

            if (status === "success") {
                handleOk(data, status, xhr, success, error);
            } else if (xhr.status === 400 && data.error !== "401") {
                handleBadRequest(data, status, xhr, success, error);
            } else if (xhr.status === 401 || xhr.status === 403 || (data && (data.error === "401" || data.error === "403"))) {
                handleUnauthorized(data, status, xhr, success, error);
            } else if (xhr.status === 409) {
                handleConflict(data, status, xhr, success, error);
            } else if (xhr.status === 500) {
                handleInternalServerError(data, status, xhr, success, error);
            } else if (status !== "nocontent") {
                $("html").html(xhr.responseText);
            }
        };

    function handleOk(data, status, xhr, success, error) {
        success(data, status);
        if (!(xhr.readonly)) {
            alerts.success(i18n.t("SUCCESS_ALERT_TEXT"));
        }
    }

    function handleBadRequest(data, status, xhr, success, error) {
        error(data, status);
        exceptionHandler.handle(data, status);
    }

    function handleUnauthorized(data, status, xhr, success, error) {
        error(data, status);
        securityContext.clear();

        if (xhr.login) {
            exceptionHandler.handle({
                exceptionType: "Hipicapp_Service_Exceptions_BadCredentialsException"
            }, "error");
        } else {
            exceptionHandler.handle({
                exceptionType: "Hipicapp_Service_Exceptions_AccessDeniedException"
            }, "error");
            router.navigate("");
            router.reloadCurrentLocation();
        }
    }

    function handleConflict(data, status, xhr, success, error) {
        error(data, status);
        securityContext.clear();
        if (xhr.login || !xhr.authentication) {
            /*exceptionHandler
                .handle({
                    status: "fail",
                    data: {
                        key: "org.springframework.security.web.authentication.session.SessionAuthenticationException"
                    }
                });*/
        }
    }

    function handleInternalServerError(data, status, xhr, success, error) {
        error(data, status);
        exceptionHandler.handle(data, status);
    }

    function getReadOnlyRequestSettings(url, verb, cacheName) {
        return {
            url: url,
            beforeSend: beforeRead,
            type: verb,
            contentType: CONTENT_TYPE,
            dataType: DATA_TYPE,
            cache: {
                type: cacheName,
                expires: DEFAULT_CACHE_TIMEOUT
            },
            dataMap: dataMap,
            decoder: EXCEPTION_HANDLER_DECODER
        };
    }

    function getWriteRequestSettings(url, verb) {
        return {
            url: url,
            beforeSend: beforeWrite,
            type: verb,
            contentType: CONTENT_TYPE,
            dataType: DATA_TYPE,
            dataMap: dataMap,
            decoder: EXCEPTION_HANDLER_DECODER
        };
    }

    function getLoginRequestSettings(url, verb) {
        return {
            url: url,
            beforeSend: beforeLogin,
            contentType: CONTENT_TYPE,
            dataType: DATA_TYPE,
            type: verb,
            decoder: EXCEPTION_HANDLER_DECODER
        };
    }

    utils.HASH_CHAR = HASH_CHAR;
    utils.requestMappings = requestMappings;
    utils.REQUEST_TYPE = REQUEST_TYPE;
    utils.verb = verb;
    utils.CONTENT_TYPE = CONTENT_TYPE;
    utils.DATA_TYPE = DATA_TYPE;
    utils.EXCEPTION_HANDLER_DECODER = EXCEPTION_HANDLER_DECODER;
    utils.requestCount = requestCount;

    utils.DATA_MAP_CALLBACK = dataMap;
    utils.getLoginRequestSettings = getLoginRequestSettings;
    utils.getReadOnlyRequestSettings = getReadOnlyRequestSettings;
    utils.getWriteRequestSettings = getWriteRequestSettings;

    return utils;
});