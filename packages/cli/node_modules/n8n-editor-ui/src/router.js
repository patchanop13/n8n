"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const ChangePasswordView_vue_1 = __importDefault(require("./views/ChangePasswordView.vue"));
const ErrorView_vue_1 = __importDefault(require("./views/ErrorView.vue"));
const ForgotMyPasswordView_vue_1 = __importDefault(require("./views/ForgotMyPasswordView.vue"));
const MainHeader_vue_1 = __importDefault(require("@/components/MainHeader/MainHeader.vue"));
const MainSidebar_vue_1 = __importDefault(require("@/components/MainSidebar.vue"));
const NodeView_vue_1 = __importDefault(require("@/views/NodeView.vue"));
const SettingsPersonalView_vue_1 = __importDefault(require("./views/SettingsPersonalView.vue"));
const SettingsUsersView_vue_1 = __importDefault(require("./views/SettingsUsersView.vue"));
const SettingsApiView_vue_1 = __importDefault(require("./views/SettingsApiView.vue"));
const SetupView_vue_1 = __importDefault(require("./views/SetupView.vue"));
const SigninView_vue_1 = __importDefault(require("./views/SigninView.vue"));
const SignupView_vue_1 = __importDefault(require("./views/SignupView.vue"));
const vue_router_1 = __importDefault(require("vue-router"));
const TemplatesCollectionView_vue_1 = __importDefault(require("@/views/TemplatesCollectionView.vue"));
const TemplatesWorkflowView_vue_1 = __importDefault(require("@/views/TemplatesWorkflowView.vue"));
const TemplatesSearchView_vue_1 = __importDefault(require("@/views/TemplatesSearchView.vue"));
const userHelpers_1 = require("./modules/userHelpers");
const constants_1 = require("./constants");
vue_1.default.use(vue_router_1.default);
function getTemplatesRedirect(store) {
    const isTemplatesEnabled = store.getters['settings/isTemplatesEnabled'];
    if (!isTemplatesEnabled) {
        return { name: constants_1.VIEWS.NOT_FOUND };
    }
    return false;
}
const router = new vue_router_1.default({
    mode: 'history',
    // @ts-ignore
    base: window.BASE_PATH === '/%BASE_PATH%/' ? '/' : window.BASE_PATH,
    routes: [
        {
            path: '/',
            name: constants_1.VIEWS.HOMEPAGE,
            meta: {
                getRedirect(store) {
                    return { name: constants_1.VIEWS.NEW_WORKFLOW };
                },
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn],
                    },
                },
            },
        },
        {
            path: '/collections/:id',
            name: constants_1.VIEWS.COLLECTION,
            components: {
                default: TemplatesCollectionView_vue_1.default,
                sidebar: MainSidebar_vue_1.default,
            },
            meta: {
                templatesEnabled: true,
                telemetry: {
                    getProperties(route, store) {
                        return {
                            collection_id: route.params.id,
                            wf_template_repo_session_id: store.getters['templates/currentSessionId'],
                        };
                    },
                },
                getRedirect: getTemplatesRedirect,
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn],
                    },
                },
            },
        },
        {
            path: '/execution/:id',
            name: constants_1.VIEWS.EXECUTION,
            components: {
                default: NodeView_vue_1.default,
                header: MainHeader_vue_1.default,
                sidebar: MainSidebar_vue_1.default,
            },
            meta: {
                nodeView: true,
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn],
                    },
                },
            },
        },
        {
            path: '/templates/:id',
            name: constants_1.VIEWS.TEMPLATE,
            components: {
                default: TemplatesWorkflowView_vue_1.default,
                sidebar: MainSidebar_vue_1.default,
            },
            meta: {
                templatesEnabled: true,
                getRedirect: getTemplatesRedirect,
                telemetry: {
                    getProperties(route, store) {
                        return {
                            template_id: route.params.id,
                            wf_template_repo_session_id: store.getters['templates/currentSessionId'],
                        };
                    },
                },
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn],
                    },
                },
            },
        },
        {
            path: '/templates/',
            name: constants_1.VIEWS.TEMPLATES,
            components: {
                default: TemplatesSearchView_vue_1.default,
                sidebar: MainSidebar_vue_1.default,
            },
            meta: {
                templatesEnabled: true,
                getRedirect: getTemplatesRedirect,
                telemetry: {
                    getProperties(route, store) {
                        return {
                            wf_template_repo_session_id: store.getters['templates/currentSessionId'],
                        };
                    },
                },
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn],
                    },
                },
            },
        },
        {
            path: '/workflow',
            name: constants_1.VIEWS.NEW_WORKFLOW,
            components: {
                default: NodeView_vue_1.default,
                header: MainHeader_vue_1.default,
                sidebar: MainSidebar_vue_1.default,
            },
            meta: {
                nodeView: true,
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn],
                    },
                },
            },
        },
        {
            path: '/workflow/:name',
            name: constants_1.VIEWS.WORKFLOW,
            components: {
                default: NodeView_vue_1.default,
                header: MainHeader_vue_1.default,
                sidebar: MainSidebar_vue_1.default,
            },
            meta: {
                nodeView: true,
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn],
                    },
                },
            },
        },
        {
            path: '/workflows/demo',
            name: constants_1.VIEWS.DEMO,
            components: {
                default: NodeView_vue_1.default,
            },
            meta: {
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn],
                    },
                },
            },
        },
        {
            path: '/workflows/templates/:id',
            name: constants_1.VIEWS.TEMPLATE_IMPORT,
            components: {
                default: NodeView_vue_1.default,
                header: MainHeader_vue_1.default,
                sidebar: MainSidebar_vue_1.default,
            },
            meta: {
                templatesEnabled: true,
                getRedirect: getTemplatesRedirect,
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn],
                    },
                },
            },
        },
        {
            path: '/signin',
            name: constants_1.VIEWS.SIGNIN,
            components: {
                default: SigninView_vue_1.default,
            },
            meta: {
                telemetry: {
                    pageCategory: 'auth',
                },
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedOut],
                    },
                },
            },
        },
        {
            path: '/signup',
            name: constants_1.VIEWS.SIGNUP,
            components: {
                default: SignupView_vue_1.default,
            },
            meta: {
                telemetry: {
                    pageCategory: 'auth',
                },
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedOut],
                    },
                },
            },
        },
        {
            path: '/setup',
            name: constants_1.VIEWS.SETUP,
            components: {
                default: SetupView_vue_1.default,
            },
            meta: {
                telemetry: {
                    pageCategory: 'auth',
                },
                permissions: {
                    allow: {
                        role: [userHelpers_1.ROLE.Default],
                    },
                    deny: {
                        um: false,
                    },
                },
            },
        },
        {
            path: '/forgot-password',
            name: constants_1.VIEWS.FORGOT_PASSWORD,
            components: {
                default: ForgotMyPasswordView_vue_1.default,
            },
            meta: {
                telemetry: {
                    pageCategory: 'auth',
                },
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedOut],
                    },
                },
            },
        },
        {
            path: '/change-password',
            name: constants_1.VIEWS.CHANGE_PASSWORD,
            components: {
                default: ChangePasswordView_vue_1.default,
            },
            meta: {
                telemetry: {
                    pageCategory: 'auth',
                },
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedOut],
                    },
                },
            },
        },
        {
            path: '/settings',
            redirect: '/settings/personal',
        },
        {
            path: '/settings/users',
            name: constants_1.VIEWS.USERS_SETTINGS,
            components: {
                default: SettingsUsersView_vue_1.default,
            },
            meta: {
                telemetry: {
                    pageCategory: 'settings',
                },
                permissions: {
                    allow: {
                        role: [userHelpers_1.ROLE.Default, userHelpers_1.ROLE.Owner],
                    },
                    deny: {
                        um: false,
                    },
                },
            },
        },
        {
            path: '/settings/personal',
            name: constants_1.VIEWS.PERSONAL_SETTINGS,
            components: {
                default: SettingsPersonalView_vue_1.default,
            },
            meta: {
                telemetry: {
                    pageCategory: 'settings',
                },
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn],
                    },
                    deny: {
                        role: [userHelpers_1.ROLE.Default],
                    },
                },
            },
        },
        {
            path: '/settings/api',
            name: constants_1.VIEWS.API_SETTINGS,
            components: {
                default: SettingsApiView_vue_1.default,
            },
            meta: {
                telemetry: {
                    pageCategory: 'settings',
                },
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn],
                    },
                    deny: {
                        api: false,
                    },
                },
            },
        },
        {
            path: '*',
            name: constants_1.VIEWS.NOT_FOUND,
            component: ErrorView_vue_1.default,
            props: {
                messageKey: 'error.pageNotFound',
                errorCode: 404,
                redirectTextKey: 'error.goBack',
                redirectPage: constants_1.VIEWS.HOMEPAGE,
            },
            meta: {
                nodeView: true,
                telemetry: {
                    disabled: true,
                },
                permissions: {
                    allow: {
                        loginStatus: [userHelpers_1.LOGIN_STATUS.LoggedIn, userHelpers_1.LOGIN_STATUS.LoggedOut],
                    },
                },
            },
        },
    ],
});
exports.default = router;
