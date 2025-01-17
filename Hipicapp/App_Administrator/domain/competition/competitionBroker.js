/* global amplify: false, define: false, require: false */
/* jshint maxstatements: 35 */
define([
    "core/broker", "core/cacheImpl", "core/util/urlUtils", "domain/judge/judgeBroker"
], function competitionBroker(brokerUtils, cacheImpl, urlUtils, judgeBroker) {
    "use strict";

    var broker = {}, CACHE_NAME = "competitions", CACHE = cacheImpl(CACHE_NAME);

    // cache definition
    /* jshint camelcase: false */
    amplify.request_original.cache[CACHE_NAME] = CACHE;

    // request definition
    amplify.request.define("competitions/findBy", brokerUtils.REQUEST_TYPE, brokerUtils
        .getReadOnlyRequestSettings(brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS,
                brokerUtils.requestMappings.FIND), brokerUtils.verb.POST, CACHE_NAME));

    amplify.request.define("competitions/findById", brokerUtils.REQUEST_TYPE, brokerUtils
        .getReadOnlyRequestSettings(brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS,
                brokerUtils.requestMappings.GET, brokerUtils.requestMappings.ID), brokerUtils.verb.GET, CACHE_NAME));

    amplify.request.define("competitions/findLast", brokerUtils.REQUEST_TYPE, brokerUtils
        .getReadOnlyRequestSettings(brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS,
                brokerUtils.requestMappings.FIND_LAST), brokerUtils.verb.GET, CACHE_NAME));

    amplify.request.define("competitions/save", brokerUtils.REQUEST_TYPE, brokerUtils
        .getWriteRequestSettings(brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS, brokerUtils.requestMappings.SAVE), brokerUtils.verb.POST));

    amplify.request.define("competitions/update", brokerUtils.REQUEST_TYPE, brokerUtils
        .getWriteRequestSettings(brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS, brokerUtils.requestMappings.UPDATE), brokerUtils.verb.PUT));

    amplify.request.define("competitions/simulateScore", brokerUtils.REQUEST_TYPE, brokerUtils
        .getWriteRequestSettings(brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS, brokerUtils.requestMappings.SIMULATE_SCORE), brokerUtils.verb.POST));

    amplify.request.define("competitions/erase", brokerUtils.REQUEST_TYPE, brokerUtils
        .getWriteRequestSettings(brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS, brokerUtils.requestMappings.DELETE), brokerUtils.verb.DELETE));

    amplify.request.define("competitions/assignAllJudges", brokerUtils.REQUEST_TYPE,
        brokerUtils.getWriteRequestSettings(brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS,
                brokerUtils.requestMappings.COMPETITION_ID,
                brokerUtils.requestMappings.ASSIGNALLJUDGES), brokerUtils.verb.POST));

    amplify.request.define("competitions/assignAllJudgesById", brokerUtils.REQUEST_TYPE,
        brokerUtils
            .getWriteRequestSettings(brokerUtils.requestMappings.BACKEND +
                urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS,
                    brokerUtils.requestMappings.COMPETITION_ID,
                    brokerUtils.requestMappings.ASSIGNALLJUDGESBYPAGE),
                brokerUtils.verb.POST));

    amplify.request.define("competitions/assignAllJudgesByFilter",
        brokerUtils.REQUEST_TYPE, brokerUtils.getWriteRequestSettings(
            brokerUtils.requestMappings.BACKEND +
                urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS,
                    brokerUtils.requestMappings.COMPETITION_ID,
                    brokerUtils.requestMappings.ASSIGNALLJUDGESBYFILTER),
            brokerUtils.verb.POST));

    amplify.request.define("competitions/unassignAllJudges", brokerUtils.REQUEST_TYPE,
        brokerUtils.getWriteRequestSettings(brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS,
                brokerUtils.requestMappings.COMPETITION_ID,
                brokerUtils.requestMappings.UNASSIGNALLJUDGES), brokerUtils.verb.POST));

    amplify.request.define("competitions/unassignAllJudgesById", brokerUtils.REQUEST_TYPE,
        brokerUtils.getWriteRequestSettings(brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS,
                brokerUtils.requestMappings.COMPETITION_ID,
                brokerUtils.requestMappings.UNASSIGNALLJUDGESBYPAGE),
            brokerUtils.verb.POST));

    amplify.request.define("competitions/unassignAllJudgesByFilter",
        brokerUtils.REQUEST_TYPE, brokerUtils.getWriteRequestSettings(
            brokerUtils.requestMappings.BACKEND +
                urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS,
                    brokerUtils.requestMappings.COMPETITION_ID,
                    brokerUtils.requestMappings.UNASSIGNALLJUDGESBYFILTER),
            brokerUtils.verb.POST));

    amplify.request.define("competitions/assignUnassignJudge", brokerUtils.REQUEST_TYPE,
        brokerUtils.getWriteRequestSettings(brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS,
                brokerUtils.requestMappings.COMPETITION_ID,
                brokerUtils.requestMappings.JUDGE_ID,
                brokerUtils.requestMappings.ASSIGNUNASSIGNJUDGE), brokerUtils.verb.POST));

    function findBy(findRequest) {
        return amplify.request("competitions/findBy", findRequest);
    }

    function findById(id) {
        return amplify.request("competitions/findById", {
            id: id
        });
    }

    function findLast() {
        return amplify.request("competitions/findLast");
    }

    function save(entity) {
        return amplify.request("competitions/save", entity).always(CACHE.evict);
    }

    function update(entity) {
        return amplify.request("competitions/update", entity).always(CACHE.evict);
    }

    function simulateScore(entity) {
        return amplify.request("competitions/simulateScore", entity).always(CACHE.evict);
    }

    function erase(entity) {
        return amplify.request("competitions/erase", entity).always(CACHE.evict);
    }

    function assignAllJudges(competitionId) {

        return amplify.request("competitions/assignAllJudges", {
            competitionId: competitionId
        }).always(judgeBroker.evictCache).always(CACHE.evict);
    }

    function assignAllJudgesById(id, judgesId) {

        return amplify.request("competitions/assignAllJudgesById", {
            competitionId: id,
            judgesId: judgesId
        }).always(judgeBroker.evictCache).always(CACHE.evict);
    }

    function assignAllJudgesByFilter(id, find) {

        return amplify.request("competitions/assignAllJudgesByFilter", {
            competitionId: id,
            filter: find.filter
        }).always(judgeBroker.evictCache).always(CACHE.evict);
    }

    function unassignAllJudges(competitionId) {

        return amplify.request("competitions/unassignAllJudges", {
            competitionId: competitionId
        }).always(judgeBroker.evictCache).always(CACHE.evict);
    }

    function unassignAllJudgesById(id, judgesId) {

        return amplify.request("competitions/unassignAllJudgesById", {
            competitionId: id,
            judgesId: judgesId
        }).always(judgeBroker.evictCache).always(CACHE.evict);
    }

    function unassignAllJudgesByFilter(id, find) {

        return amplify.request("competitions/unassignAllJudgesByFilter", {
            competitionId: id,
            filter: find.filter
        }).always(judgeBroker.evictCache).always(CACHE.evict);
    }

    function assignUnassignJudge(id, entity) {

        return amplify.request("competitions/assignUnassignJudge", {
            competitionId: id,
            judgeId: entity.id
        }).always(judgeBroker.evictCache).always(CACHE.evict);
    }

    function getListUrl() {
        return brokerUtils.HASH_CHAR + urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS);
    }

    function getDetailUrlById(competitionId) {
        return brokerUtils.HASH_CHAR +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITION, competitionId);
    }

    function getImagesUrlById(competitionId) {
        return brokerUtils.HASH_CHAR +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITION, competitionId,
                brokerUtils.requestMappings.IMAGES);
    }

    function getJudgesUrlById(competitionId) {
        return brokerUtils.HASH_CHAR +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITION, competitionId,
                brokerUtils.requestMappings.JUDGES);
    }

    function getFileuploadUrlById(entityId) {
        return brokerUtils.requestMappings.BACKEND +
            urlUtils.joinPath(brokerUtils.requestMappings.COMPETITIONS,
                brokerUtils.requestMappings.UPLOAD, entityId);
    }

    function evictCache() {
        CACHE.evict();
    }

    broker.evictCache = evictCache;

    // request revelation
    broker.findBy = findBy;
    broker.save = save;
    broker.update = update;
    broker.simulateScore = simulateScore;
    broker.erase = erase;
    broker.findById = findById;
    broker.findLast = findLast;

    broker.assignAllJudges = assignAllJudges;
    broker.assignAllJudgesById = assignAllJudgesById;
    broker.assignAllJudgesByFilter = assignAllJudgesByFilter;
    broker.unassignAllJudges = unassignAllJudges;
    broker.unassignAllJudgesById = unassignAllJudgesById;
    broker.unassignAllJudgesByFilter = unassignAllJudgesByFilter;
    broker.assignUnassignJudge = assignUnassignJudge;

    broker.getListUrl = getListUrl;
    broker.getDetailUrlById = getDetailUrlById;
    broker.getImagesUrlById = getImagesUrlById;
    broker.getJudgesUrlById = getJudgesUrlById;
    broker.getFileuploadUrlById = getFileuploadUrlById;

    return broker;
});