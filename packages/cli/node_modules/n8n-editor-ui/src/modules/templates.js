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
const templates_1 = require("@/api/templates");
const vue_1 = __importDefault(require("vue"));
const TEMPLATES_PAGE_SIZE = 10;
function getSearchKey(query) {
    return JSON.stringify([query.search || '', [...query.categories].sort()]);
}
const module = {
    namespaced: true,
    state: {
        categories: {},
        collections: {},
        workflows: {},
        collectionSearches: {},
        workflowSearches: {},
        currentSessionId: '',
        previousSessionId: '',
    },
    getters: {
        allCategories(state) {
            return Object.values(state.categories).sort((a, b) => a.name > b.name ? 1 : -1);
        },
        getTemplateById(state) {
            return (id) => state.workflows[id];
        },
        getCollectionById(state) {
            return (id) => state.collections[id];
        },
        getCategoryById(state) {
            return (id) => state.categories[id];
        },
        getSearchedCollections(state) {
            return (query) => {
                const searchKey = getSearchKey(query);
                const search = state.collectionSearches[searchKey];
                if (!search) {
                    return null;
                }
                return search.collectionIds.map((collectionId) => state.collections[collectionId]);
            };
        },
        getSearchedWorkflows(state) {
            return (query) => {
                const searchKey = getSearchKey(query);
                const search = state.workflowSearches[searchKey];
                if (!search) {
                    return null;
                }
                return search.workflowIds.map((workflowId) => state.workflows[workflowId]);
            };
        },
        getSearchedWorkflowsTotal(state) {
            return (query) => {
                const searchKey = getSearchKey(query);
                const search = state.workflowSearches[searchKey];
                return search ? search.totalWorkflows : 0;
            };
        },
        isSearchLoadingMore(state) {
            return (query) => {
                const searchKey = getSearchKey(query);
                const search = state.workflowSearches[searchKey];
                return Boolean(search && search.loadingMore);
            };
        },
        isSearchFinished(state) {
            return (query) => {
                const searchKey = getSearchKey(query);
                const search = state.workflowSearches[searchKey];
                return Boolean(search && !search.loadingMore && search.totalWorkflows === search.workflowIds.length);
            };
        },
        currentSessionId(state) {
            return state.currentSessionId;
        },
        previousSessionId(state) {
            return state.previousSessionId;
        },
    },
    mutations: {
        addCategories(state, categories) {
            categories.forEach((category) => {
                vue_1.default.set(state.categories, category.id, category);
            });
        },
        addCollections(state, collections) {
            collections.forEach((collection) => {
                const workflows = (collection.workflows || []).map((workflow) => ({ id: workflow.id }));
                const cachedCollection = state.collections[collection.id] || {};
                vue_1.default.set(state.collections, collection.id, Object.assign(Object.assign(Object.assign({}, cachedCollection), collection), { workflows }));
            });
        },
        addWorkflows(state, workflows) {
            workflows.forEach((workflow) => {
                const cachedWorkflow = state.workflows[workflow.id] || {};
                vue_1.default.set(state.workflows, workflow.id, Object.assign(Object.assign({}, cachedWorkflow), workflow));
            });
        },
        addCollectionSearch(state, data) {
            const collectionIds = data.collections.map((collection) => collection.id);
            const searchKey = getSearchKey(data.query);
            vue_1.default.set(state.collectionSearches, searchKey, {
                collectionIds,
            });
        },
        addWorkflowsSearch(state, data) {
            const workflowIds = data.workflows.map((workflow) => workflow.id);
            const searchKey = getSearchKey(data.query);
            const cachedResults = state.workflowSearches[searchKey];
            if (!cachedResults) {
                vue_1.default.set(state.workflowSearches, searchKey, {
                    workflowIds,
                    totalWorkflows: data.totalWorkflows,
                });
                return;
            }
            vue_1.default.set(state.workflowSearches, searchKey, {
                workflowIds: [...cachedResults.workflowIds, ...workflowIds],
                totalWorkflows: data.totalWorkflows,
            });
        },
        setWorkflowSearchLoading(state, query) {
            const searchKey = getSearchKey(query);
            const cachedResults = state.workflowSearches[searchKey];
            if (!cachedResults) {
                return;
            }
            vue_1.default.set(state.workflowSearches[searchKey], 'loadingMore', true);
        },
        setWorkflowSearchLoaded(state, query) {
            const searchKey = getSearchKey(query);
            const cachedResults = state.workflowSearches[searchKey];
            if (!cachedResults) {
                return;
            }
            vue_1.default.set(state.workflowSearches[searchKey], 'loadingMore', false);
        },
        resetSessionId(state) {
            state.previousSessionId = state.currentSessionId;
            state.currentSessionId = '';
        },
        setSessionId(state) {
            if (!state.currentSessionId) {
                state.currentSessionId = `templates-${Date.now()}`;
            }
        },
    },
    actions: {
        getTemplateById(context, templateId) {
            return __awaiter(this, void 0, void 0, function* () {
                const apiEndpoint = context.rootGetters['settings/templatesHost'];
                const versionCli = context.rootGetters['versionCli'];
                const response = yield (0, templates_1.getTemplateById)(apiEndpoint, templateId, { 'n8n-version': versionCli });
                const template = Object.assign(Object.assign({}, response.workflow), { full: true });
                context.commit('addWorkflows', [template]);
                return template;
            });
        },
        getCollectionById(context, collectionId) {
            return __awaiter(this, void 0, void 0, function* () {
                const apiEndpoint = context.rootGetters['settings/templatesHost'];
                const versionCli = context.rootGetters['versionCli'];
                const response = yield (0, templates_1.getCollectionById)(apiEndpoint, collectionId, { 'n8n-version': versionCli });
                const collection = Object.assign(Object.assign({}, response.collection), { full: true });
                context.commit('addCollections', [collection]);
                context.commit('addWorkflows', response.collection.workflows);
                return context.getters.getCollectionById(collectionId);
            });
        },
        getCategories(context) {
            return __awaiter(this, void 0, void 0, function* () {
                const cachedCategories = context.getters.allCategories;
                if (cachedCategories.length) {
                    return cachedCategories;
                }
                const apiEndpoint = context.rootGetters['settings/templatesHost'];
                const versionCli = context.rootGetters['versionCli'];
                const response = yield (0, templates_1.getCategories)(apiEndpoint, { 'n8n-version': versionCli });
                const categories = response.categories;
                context.commit('addCategories', categories);
                return categories;
            });
        },
        getCollections(context, query) {
            return __awaiter(this, void 0, void 0, function* () {
                const cachedResults = context.getters.getSearchedCollections(query);
                if (cachedResults) {
                    return cachedResults;
                }
                const apiEndpoint = context.rootGetters['settings/templatesHost'];
                const versionCli = context.rootGetters['versionCli'];
                const response = yield (0, templates_1.getCollections)(apiEndpoint, query, { 'n8n-version': versionCli });
                const collections = response.collections;
                context.commit('addCollections', collections);
                context.commit('addCollectionSearch', { query, collections });
                collections.forEach((collection) => context.commit('addWorkflows', collection.workflows));
                return collections;
            });
        },
        getWorkflows(context, query) {
            return __awaiter(this, void 0, void 0, function* () {
                const cachedResults = context.getters.getSearchedWorkflows(query);
                if (cachedResults) {
                    return cachedResults;
                }
                const apiEndpoint = context.rootGetters['settings/templatesHost'];
                const versionCli = context.rootGetters['versionCli'];
                const payload = yield (0, templates_1.getWorkflows)(apiEndpoint, Object.assign(Object.assign({}, query), { skip: 0, limit: TEMPLATES_PAGE_SIZE }), { 'n8n-version': versionCli });
                context.commit('addWorkflows', payload.workflows);
                context.commit('addWorkflowsSearch', Object.assign(Object.assign({}, payload), { query }));
                return context.getters.getSearchedWorkflows(query);
            });
        },
        getMoreWorkflows(context, query) {
            return __awaiter(this, void 0, void 0, function* () {
                if (context.getters.isSearchLoadingMore(query) && !context.getters.isSearchFinished(query)) {
                    return [];
                }
                const cachedResults = context.getters.getSearchedWorkflows(query) || [];
                const apiEndpoint = context.rootGetters['settings/templatesHost'];
                context.commit('setWorkflowSearchLoading', query);
                try {
                    const payload = yield (0, templates_1.getWorkflows)(apiEndpoint, Object.assign(Object.assign({}, query), { skip: cachedResults.length, limit: TEMPLATES_PAGE_SIZE }));
                    context.commit('setWorkflowSearchLoaded', query);
                    context.commit('addWorkflows', payload.workflows);
                    context.commit('addWorkflowsSearch', Object.assign(Object.assign({}, payload), { query }));
                    return context.getters.getSearchedWorkflows(query);
                }
                catch (e) {
                    context.commit('setWorkflowSearchLoaded', query);
                    throw e;
                }
            });
        },
        getWorkflowTemplate: (context, templateId) => __awaiter(void 0, void 0, void 0, function* () {
            const apiEndpoint = context.rootGetters['settings/templatesHost'];
            const versionCli = context.rootGetters['versionCli'];
            return yield (0, templates_1.getWorkflowTemplate)(apiEndpoint, templateId, { 'n8n-version': versionCli });
        }),
    },
};
exports.default = module;
