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
const users_1 = require("@/api/users");
const vue_1 = __importDefault(require("vue"));
const userHelpers_1 = require("./userHelpers");
const isDefaultUser = (user) => Boolean(user && user.isPending && user.globalRole && user.globalRole.name === userHelpers_1.ROLE.Owner);
const isPendingUser = (user) => Boolean(user && user.isPending);
const module = {
    namespaced: true,
    state: {
        currentUserId: null,
        users: {},
    },
    mutations: {
        addUsers: (state, users) => {
            users.forEach((userResponse) => {
                const prevUser = state.users[userResponse.id] || {};
                const updatedUser = Object.assign(Object.assign({}, prevUser), userResponse);
                const user = Object.assign(Object.assign({}, updatedUser), { fullName: userResponse.firstName ? `${updatedUser.firstName} ${updatedUser.lastName || ''}` : undefined, isDefaultUser: isDefaultUser(updatedUser), isPendingUser: isPendingUser(updatedUser), isOwner: Boolean(updatedUser.globalRole && updatedUser.globalRole.name === userHelpers_1.ROLE.Owner) });
                vue_1.default.set(state.users, user.id, user);
            });
        },
        setCurrentUserId: (state, userId) => {
            state.currentUserId = userId;
        },
        clearCurrentUserId: (state) => {
            state.currentUserId = null;
        },
        deleteUser: (state, userId) => {
            vue_1.default.delete(state.users, userId);
        },
        setPersonalizationAnswers(state, answers) {
            if (!state.currentUserId) {
                return;
            }
            const user = state.users[state.currentUserId];
            if (!user) {
                return;
            }
            vue_1.default.set(user, 'personalizationAnswers', answers);
        },
    },
    getters: {
        allUsers(state) {
            return Object.values(state.users);
        },
        currentUserId(state) {
            return state.currentUserId;
        },
        currentUser(state) {
            return state.currentUserId ? state.users[state.currentUserId] : null;
        },
        getUserById(state) {
            return (userId) => state.users[userId];
        },
        canUserDeleteTags(state, getters, rootState, rootGetters) {
            const currentUser = getters.currentUser;
            const isUMEnabled = rootGetters['settings/isUserManagementEnabled'];
            return (0, userHelpers_1.isAuthorized)(userHelpers_1.PERMISSIONS.TAGS.CAN_DELETE_TAGS, { currentUser, isUMEnabled });
        },
        canUserAccessSidebarUserInfo(state, getters, rootState, rootGetters) {
            const currentUser = getters.currentUser;
            const isUMEnabled = rootGetters['settings/isUserManagementEnabled'];
            return (0, userHelpers_1.isAuthorized)(userHelpers_1.PERMISSIONS.PRIMARY_MENU.CAN_ACCESS_USER_INFO, { currentUser, isUMEnabled });
        },
        showUMSetupWarning(state, getters, rootState, rootGetters) {
            const currentUser = getters.currentUser;
            const isUMEnabled = rootGetters['settings/isUserManagementEnabled'];
            return (0, userHelpers_1.isAuthorized)(userHelpers_1.PERMISSIONS.USER_SETTINGS.VIEW_UM_SETUP_WARNING, { currentUser, isUMEnabled });
        },
        personalizedNodeTypes(state, getters) {
            const user = getters.currentUser;
            if (!user) {
                return [];
            }
            const answers = user.personalizationAnswers;
            if (!answers) {
                return [];
            }
            return (0, userHelpers_1.getPersonalizedNodeTypes)(answers);
        },
    },
    actions: {
        loginWithCookie(context) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, users_1.loginCurrentUser)(context.rootGetters.getRestApiContext);
                if (user) {
                    context.commit('addUsers', [user]);
                    context.commit('setCurrentUserId', user.id);
                }
            });
        },
        getCurrentUser(context) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, users_1.getCurrentUser)(context.rootGetters.getRestApiContext);
                if (user) {
                    context.commit('addUsers', [user]);
                    context.commit('setCurrentUserId', user.id);
                }
            });
        },
        loginWithCreds(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, users_1.login)(context.rootGetters.getRestApiContext, params);
                if (user) {
                    context.commit('addUsers', [user]);
                    context.commit('setCurrentUserId', user.id);
                }
            });
        },
        logout(context) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, users_1.logout)(context.rootGetters.getRestApiContext);
                context.commit('clearCurrentUserId');
            });
        },
        createOwner(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, users_1.setupOwner)(context.rootGetters.getRestApiContext, params);
                if (user) {
                    context.commit('addUsers', [user]);
                    context.commit('setCurrentUserId', user.id);
                    context.commit('settings/stopShowingSetupPage', null, { root: true });
                }
            });
        },
        validateSignupToken(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield (0, users_1.validateSignupToken)(context.rootGetters.getRestApiContext, params);
            });
        },
        signup(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, users_1.signup)(context.rootGetters.getRestApiContext, params);
                if (user) {
                    context.commit('addUsers', [user]);
                    context.commit('setCurrentUserId', user.id);
                }
            });
        },
        sendForgotPasswordEmail(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, users_1.sendForgotPasswordEmail)(context.rootGetters.getRestApiContext, params);
            });
        },
        validatePasswordToken(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, users_1.validatePasswordToken)(context.rootGetters.getRestApiContext, params);
            });
        },
        changePassword(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, users_1.changePassword)(context.rootGetters.getRestApiContext, params);
            });
        },
        updateUser(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield (0, users_1.updateCurrentUser)(context.rootGetters.getRestApiContext, params);
                context.commit('addUsers', [user]);
            });
        },
        updateCurrentUserPassword(context, { password, currentPassword }) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, users_1.updateCurrentUserPassword)(context.rootGetters.getRestApiContext, { newPassword: password, currentPassword });
            });
        },
        deleteUser(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, users_1.deleteUser)(context.rootGetters.getRestApiContext, params);
                context.commit('deleteUser', params.id);
            });
        },
        fetchUsers(context) {
            return __awaiter(this, void 0, void 0, function* () {
                const users = yield (0, users_1.getUsers)(context.rootGetters.getRestApiContext);
                context.commit('addUsers', users);
            });
        },
        inviteUsers(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                const users = yield (0, users_1.inviteUsers)(context.rootGetters.getRestApiContext, params);
                context.commit('addUsers', users.map(({ user }) => (Object.assign({ isPending: true }, user))));
                return users;
            });
        },
        reinviteUser(context, params) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, users_1.reinvite)(context.rootGetters.getRestApiContext, params);
            });
        },
        submitPersonalizationSurvey(context, results) {
            return __awaiter(this, void 0, void 0, function* () {
                yield (0, users_1.submitPersonalizationSurvey)(context.rootGetters.getRestApiContext, results);
                context.commit('setPersonalizationAnswers', results);
            });
        },
        showPersonalizationSurvey(context) {
            return __awaiter(this, void 0, void 0, function* () {
                const surveyEnabled = context.rootGetters['settings/isPersonalizationSurveyEnabled'];
                const currentUser = context.getters.currentUser;
                if (surveyEnabled && currentUser && !currentUser.personalizationAnswers) {
                    context.dispatch('ui/openModal', constants_1.PERSONALIZATION_MODAL_KEY, { root: true });
                }
            });
        },
        skipOwnerSetup(context) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    context.commit('settings/stopShowingSetupPage', null, { root: true });
                    yield (0, users_1.skipOwnerSetup)(context.rootGetters.getRestApiContext);
                }
                catch (error) { }
            });
        },
    },
};
exports.default = module;
