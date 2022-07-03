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
Object.defineProperty(exports, "__esModule", { value: true });
const versions_1 = require("@/api/versions");
const module = {
    namespaced: true,
    state: {
        versionNotificationSettings: {
            enabled: false,
            endpoint: '',
            infoUrl: '',
        },
        nextVersions: [],
        currentVersion: undefined,
    },
    getters: {
        hasVersionUpdates(state) {
            return state.nextVersions.length > 0;
        },
        nextVersions(state) {
            return state.nextVersions;
        },
        currentVersion(state) {
            return state.currentVersion;
        },
        areNotificationsEnabled(state) {
            return state.versionNotificationSettings.enabled;
        },
        infoUrl(state) {
            return state.versionNotificationSettings.infoUrl;
        },
    },
    mutations: {
        setVersions(state, { versions, currentVersion }) {
            state.nextVersions = versions.filter((version) => version.name !== currentVersion);
            state.currentVersion = versions.find((version) => version.name === currentVersion);
        },
        setVersionNotificationSettings(state, settings) {
            state.versionNotificationSettings = settings;
        },
    },
    actions: {
        fetchVersions(context) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const { enabled, endpoint } = context.state.versionNotificationSettings;
                    if (enabled && endpoint) {
                        const currentVersion = context.rootState.versionCli;
                        const instanceId = context.rootState.instanceId;
                        const versions = yield (0, versions_1.getNextVersions)(endpoint, currentVersion, instanceId);
                        context.commit('setVersions', { versions, currentVersion });
                    }
                }
                catch (e) {
                }
            });
        },
    },
};
exports.default = module;
