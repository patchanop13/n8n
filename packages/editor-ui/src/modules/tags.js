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
const tags_1 = require("../api/tags");
const vue_1 = __importDefault(require("vue"));
const module = {
    namespaced: true,
    state: {
        tags: {},
        isLoading: false,
        fetchedAll: false,
        fetchedUsageCount: false,
    },
    mutations: {
        setLoading: (state, isLoading) => {
            state.isLoading = isLoading;
        },
        setAllTags: (state, tags) => {
            state.tags = tags
                .reduce((accu, tag) => {
                accu[tag.id] = tag;
                return accu;
            }, {});
            state.fetchedAll = true;
        },
        upsertTags(state, tags) {
            tags.forEach((tag) => {
                const tagId = tag.id;
                const currentTag = state.tags[tagId];
                if (currentTag) {
                    const newTag = Object.assign(Object.assign({}, currentTag), tag);
                    vue_1.default.set(state.tags, tagId, newTag);
                }
                else {
                    vue_1.default.set(state.tags, tagId, tag);
                }
            });
        },
        deleteTag(state, id) {
            vue_1.default.delete(state.tags, id);
        },
    },
    getters: {
        allTags(state) {
            return Object.values(state.tags)
                .sort((a, b) => a.name.localeCompare(b.name));
        },
        isLoading: (state) => {
            return state.isLoading;
        },
        hasTags: (state) => {
            return Object.keys(state.tags).length > 0;
        },
        getTagById: (state) => {
            return (id) => state.tags[id];
        },
    },
    actions: {
        fetchAll: (context, params) => __awaiter(void 0, void 0, void 0, function* () {
            const { force = false, withUsageCount = false } = params || {};
            if (!force && context.state.fetchedAll && context.state.fetchedUsageCount === withUsageCount) {
                return Object.values(context.state.tags);
            }
            context.commit('setLoading', true);
            const tags = yield (0, tags_1.getTags)(context.rootGetters.getRestApiContext, Boolean(withUsageCount));
            context.commit('setAllTags', tags);
            context.commit('setLoading', false);
            return tags;
        }),
        create: (context, name) => __awaiter(void 0, void 0, void 0, function* () {
            const tag = yield (0, tags_1.createTag)(context.rootGetters.getRestApiContext, { name });
            context.commit('upsertTags', [tag]);
            return tag;
        }),
        rename: (context, { id, name }) => __awaiter(void 0, void 0, void 0, function* () {
            const tag = yield (0, tags_1.updateTag)(context.rootGetters.getRestApiContext, id, { name });
            context.commit('upsertTags', [tag]);
            return tag;
        }),
        delete: (context, id) => __awaiter(void 0, void 0, void 0, function* () {
            const deleted = yield (0, tags_1.deleteTag)(context.rootGetters.getRestApiContext, id);
            if (deleted) {
                context.commit('deleteTag', id);
                context.commit('removeWorkflowTagId', id, { root: true });
            }
            return deleted;
        }),
    },
};
exports.default = module;
