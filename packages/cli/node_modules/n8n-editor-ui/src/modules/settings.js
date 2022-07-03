"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../api/settings");
const vue_1 = __importDefault(require("vue"));
const constants_1 = require("@/constants");
const templates_1 = require("@/api/templates");
const api_keys_1 = require("@/api/api-keys");
const module = {
    namespaced: true,
    state: {
        settings: {},
        promptsData: {},
        userManagement: {
            enabled: false,
            showSetupOnFirstLoad: false,
            smtpSetup: false,
        },
        templatesEndpointHealthy: false,
        api: {
            enabled: false,
            latestVersion: 0,
            path: '/',
        },
    },
    getters: {
        versionCli(state) {
            return state.settings.versionCli;
        },
        isUserManagementEnabled(state) {
            return state.userManagement.enabled;
        },
        isPublicApiEnabled(state) {
            return state.api.enabled;
        },
        publicApiLatestVersion(state) {
            return state.api.latestVersion;
        },
        publicApiPath(state) {
            return state.api.path;
        },
        showSetupPage(state) {
            return state.userManagement.showSetupOnFirstLoad;
        },
        getPromptsData(state) {
            return state.promptsData;
        },
        isSmtpSetup(state) {
            return state.userManagement.smtpSetup;
        },
        isPersonalizationSurveyEnabled(state) {
            return state.settings.telemetry.enabled && state.settings.personalizationSurveyEnabled;
        },
        telemetry: (state) => {
            return state.settings.telemetry;
        },
        logLevel: (state) => {
            return state.settings.logLevel;
        },
        isTelemetryEnabled: (state) => {
            return state.settings.telemetry && state.settings.telemetry.enabled;
        },
        areTagsEnabled: (state) => {
            return state.settings.workflowTagsDisabled !== undefined ? !state.settings.workflowTagsDisabled : true;
        },
        isHiringBannerEnabled: (state) => {
            return state.settings.hiringBannerEnabled;
        },
        isTemplatesEnabled: (state) => {
            return Boolean(state.settings.templates && state.settings.templates.enabled);
        },
        isTemplatesEndpointReachable: (state) => {
            return state.templatesEndpointHealthy;
        },
        templatesHost: (state) => {
            return state.settings.templates.host;
        },
    },
    mutations: {
        setSettings(state, settings) {
            state.settings = settings;
            state.userManagement.enabled = settings.userManagement.enabled;
            state.userManagement.showSetupOnFirstLoad = !!settings.userManagement.showSetupOnFirstLoad;
            state.userManagement.smtpSetup = settings.userManagement.smtpSetup;
            state.api.enabled = settings.publicApi.enabled;
            state.api.latestVersion = settings.publicApi.latestVersion;
            state.api.path = settings.publicApi.path;
        },
        stopShowingSetupPage(state) {
            vue_1.default.set(state.userManagement, 'showSetupOnFirstLoad', false);
        },
        setPromptsData(state, promptsData) {
            vue_1.default.set(state, 'promptsData', promptsData);
        },
        setTemplatesEndpointHealthy(state) {
            state.templatesEndpointHealthy = true;
        },
    },
    actions: {
        getSettings(context) {
            return __awaiter(this, void 0, void 0, function* () {
                const settings = yield (0, settings_1.getSettings)(context.rootGetters.getRestApiContext);
                context.commit('setSettings', settings);
                // todo refactor to this store
                context.commit('setUrlBaseWebhook', settings.urlBaseWebhook, { root: true });
                context.commit('setEndpointWebhook', settings.endpointWebhook, { root: true });
                context.commit('setEndpointWebhookTest', settings.endpointWebhookTest, { root: true });
                context.commit('setSaveDataErrorExecution', settings.saveDataErrorExecution, { root: true });
                context.commit('setSaveDataSuccessExecution', settings.saveDataSuccessExecution, { root: true });
                context.commit('setSaveManualExecutions', settings.saveManualExecutions, { root: true });
                context.commit('setTimezone', settings.timezone, { root: true });
                context.commit('setExecutionTimeout', settings.executionTimeout, { root: true });
                context.commit('setMaxExecutionTimeout', settings.maxExecutionTimeout, { root: true });
                context.commit('setVersionCli', settings.versionCli, { root: true });
                context.commit('setInstanceId', settings.instanceId, { root: true });
                context.commit('setOauthCallbackUrls', settings.oauthCallbackUrls, { root: true });
                context.commit('setN8nMetadata', settings.n8nMetadata || {}, { root: true });
                context.commit('setDefaultLocale', settings.defaultLocale, { root: true });
                context.commit('versions/setVersionNotificationSettings', settings.versionNotifications, { root: true });
            });
        },
        fetchPromptsData(context) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!context.getters.isTelemetryEnabled) {
                    return;
                }
                try {
                    const instanceId = context.state.settings.instanceId;
                    const userId = context.rootGetters['users/currentUserId'];
                    const promptsData = yield (0, settings_1.getPromptsData)(instanceId, userId);
                    if (promptsData && promptsData.showContactPrompt) {
                        context.commit('ui/openModal', constants_1.CONTACT_PROMPT_MODAL_KEY, { root: true });
                    }
                    else if (promptsData && promptsData.showValueSurvey) {
                        context.commit('ui/openModal', constants_1.VALUE_SURVEY_MODAL_KEY, { root: true });
                    }
                    context.commit('setPromptsData', promptsData);
                }
                catch (e) {
                    return e;
                }
            });
        },
        submitContactInfo(context, email) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const instanceId = context.state.settings.instanceId;
                    const userId = context.rootGetters['users/currentUserId'];
                    return yield (0, settings_1.submitContactInfo)(instanceId, userId, email);
                }
                catch (e) {
                    return e;
                }
            });
        },
        submitValueSurvey(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const instanceId = context.state.settings.instanceId;
                    const userId = context.rootGetters['users/currentUserId'];
                    return yield (0, settings_1.submitValueSurvey)(instanceId, userId, params);
                }
                catch (e) {
                    return e;
                }
            });
        },
        testTemplatesEndpoint(context) {
            return __awaiter(this, void 0, void 0, function* () {
                const timeout = new Promise((_, reject) => setTimeout(() => reject(), 2000));
                yield Promise.race([(0, templates_1.testHealthEndpoint)(context.getters.templatesHost), timeout]);
                context.commit('setTemplatesEndpointHealthy', true);
            });
        },
        getApiKey(context) {
            return __awaiter(this, void 0, void 0, function* () {
                const { apiKey } = yield (0, api_keys_1.getApiKey)(context.rootGetters['getRestApiContext']);
                return apiKey;
            });
        },
        createApiKey(context) {
            return __awaiter(this, void 0, void 0, function* () {
                const { apiKey } = yield (0, api_keys_1.createApiKey)(context.rootGetters['getRestApiContext']);
                return apiKey;
            });
        },
        deleteApiKey(context) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, api_keys_1.deleteApiKey)(context.rootGetters['getRestApiContext']);
            });
        },
    },
};
exports.default = module;
