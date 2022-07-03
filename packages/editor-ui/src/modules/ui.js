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
const constants_1 = require("@/constants");
const vue_1 = __importDefault(require("vue"));
const module = {
    namespaced: true,
    state: {
        modals: {
            [constants_1.ABOUT_MODAL_KEY]: {
                open: false,
            },
            [constants_1.CHANGE_PASSWORD_MODAL_KEY]: {
                open: false,
            },
            [constants_1.CONTACT_PROMPT_MODAL_KEY]: {
                open: false,
            },
            [constants_1.CREDENTIAL_EDIT_MODAL_KEY]: {
                open: false,
                mode: '',
                activeId: null,
            },
            [constants_1.CREDENTIAL_LIST_MODAL_KEY]: {
                open: false,
            },
            [constants_1.CREDENTIAL_SELECT_MODAL_KEY]: {
                open: false,
            },
            [constants_1.DELETE_USER_MODAL_KEY]: {
                open: false,
                activeId: null,
            },
            [constants_1.DUPLICATE_MODAL_KEY]: {
                open: false,
            },
            [constants_1.PERSONALIZATION_MODAL_KEY]: {
                open: false,
            },
            [constants_1.INVITE_USER_MODAL_KEY]: {
                open: false,
            },
            [constants_1.TAGS_MANAGER_MODAL_KEY]: {
                open: false,
            },
            [constants_1.WORKFLOW_OPEN_MODAL_KEY]: {
                open: false,
            },
            [constants_1.VALUE_SURVEY_MODAL_KEY]: {
                open: false,
            },
            [constants_1.VERSIONS_MODAL_KEY]: {
                open: false,
            },
            [constants_1.WORKFLOW_SETTINGS_MODAL_KEY]: {
                open: false,
            },
            [constants_1.EXECUTIONS_MODAL_KEY]: {
                open: false,
            },
            [constants_1.WORKFLOW_ACTIVE_MODAL_KEY]: {
                open: false,
            },
        },
        modalStack: [],
        sidebarMenuCollapsed: true,
        isPageLoading: true,
        currentView: '',
        ndv: {
            sessionId: '',
            input: {
                displayMode: 'table',
            },
            output: {
                displayMode: 'table',
            },
        },
        mainPanelPosition: 0.5,
    },
    getters: {
        areExpressionsDisabled(state) {
            return state.currentView === constants_1.VIEWS.DEMO;
        },
        isVersionsOpen: (state) => {
            return state.modals[constants_1.VERSIONS_MODAL_KEY].open;
        },
        isModalOpen: (state) => {
            return (name) => state.modals[name].open;
        },
        isModalActive: (state) => {
            return (name) => state.modalStack.length > 0 && name === state.modalStack[0];
        },
        getModalActiveId: (state) => {
            return (name) => state.modals[name].activeId;
        },
        getModalMode: (state) => {
            return (name) => state.modals[name].mode;
        },
        sidebarMenuCollapsed: (state) => state.sidebarMenuCollapsed,
        ndvSessionId: (state) => state.ndv.sessionId,
        getPanelDisplayMode: (state) => {
            return (panel) => state.ndv[panel].displayMode;
        },
        inputPanelDispalyMode: (state) => state.ndv.input.displayMode,
        outputPanelDispalyMode: (state) => state.ndv.output.displayMode,
        mainPanelPosition: (state) => state.mainPanelPosition,
    },
    mutations: {
        setMode: (state, params) => {
            const { name, mode } = params;
            vue_1.default.set(state.modals[name], 'mode', mode);
        },
        setActiveId: (state, params) => {
            const { name, id } = params;
            vue_1.default.set(state.modals[name], 'activeId', id);
        },
        openModal: (state, name) => {
            vue_1.default.set(state.modals[name], 'open', true);
            state.modalStack = [name].concat(state.modalStack);
        },
        closeModal: (state, name) => {
            vue_1.default.set(state.modals[name], 'open', false);
            state.modalStack = state.modalStack.filter((openModalName) => {
                return name !== openModalName;
            });
        },
        closeAllModals: (state) => {
            Object.keys(state.modals).forEach((name) => {
                if (state.modals[name].open) {
                    vue_1.default.set(state.modals[name], 'open', false);
                }
            });
            state.modalStack = [];
        },
        toggleSidebarMenuCollapse: (state) => {
            state.sidebarMenuCollapsed = !state.sidebarMenuCollapsed;
        },
        setCurrentView: (state, currentView) => {
            state.currentView = currentView;
        },
        setNDVSessionId: (state) => {
            vue_1.default.set(state.ndv, 'sessionId', `ndv-${Math.random().toString(36).slice(-8)}`);
        },
        resetNDVSessionId: (state) => {
            vue_1.default.set(state.ndv, 'sessionId', '');
        },
        setPanelDisplayMode: (state, params) => {
            vue_1.default.set(state.ndv[params.pane], 'displayMode', params.mode);
        },
        setMainPanelRelativePosition(state, relativePosition) {
            state.mainPanelPosition = relativePosition;
        },
    },
    actions: {
        openModal: (context, modalKey) => __awaiter(void 0, void 0, void 0, function* () {
            context.commit('openModal', modalKey);
        }),
        openDeleteUserModal: (context, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            context.commit('setActiveId', { name: constants_1.DELETE_USER_MODAL_KEY, id });
            context.commit('openModal', constants_1.DELETE_USER_MODAL_KEY);
        }),
        openExisitngCredential: (context, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            context.commit('setActiveId', { name: constants_1.CREDENTIAL_EDIT_MODAL_KEY, id });
            context.commit('setMode', { name: constants_1.CREDENTIAL_EDIT_MODAL_KEY, mode: 'edit' });
            context.commit('openModal', constants_1.CREDENTIAL_EDIT_MODAL_KEY);
        }),
        openNewCredential: (context, { type }) => __awaiter(void 0, void 0, void 0, function* () {
            context.commit('setActiveId', { name: constants_1.CREDENTIAL_EDIT_MODAL_KEY, id: type });
            context.commit('setMode', { name: constants_1.CREDENTIAL_EDIT_MODAL_KEY, mode: 'new' });
            context.commit('openModal', constants_1.CREDENTIAL_EDIT_MODAL_KEY);
        }),
    },
};
exports.default = module;
