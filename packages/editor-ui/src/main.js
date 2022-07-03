"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require("./public_path");
const vue_1 = __importDefault(require("vue"));
require("./plugins");
require("prismjs");
require("prismjs/themes/prism.css");
require("vue-prism-editor/dist/VuePrismEditor.css");
require("vue-json-pretty/lib/styles.css");
require("./n8n-theme.scss");
require("@fontsource/open-sans/latin-400.css");
require("@fontsource/open-sans/latin-600.css");
require("@fontsource/open-sans/latin-700.css");
const App_vue_1 = __importDefault(require("@/App.vue"));
const router_1 = __importDefault(require("./router"));
const externalHooks_1 = require("./components/mixins/externalHooks");
const telemetry_1 = require("./plugins/telemetry");
const i18n_1 = require("./plugins/i18n");
const store_1 = require("./store");
vue_1.default.config.productionTip = false;
router_1.default.afterEach((to, from) => {
    (0, externalHooks_1.runExternalHook)('main.routeChange', store_1.store, { from, to });
});
vue_1.default.use(telemetry_1.TelemetryPlugin);
vue_1.default.use((vue) => (0, i18n_1.I18nPlugin)(vue, store_1.store));
new vue_1.default({
    router: router_1.default,
    store: store_1.store,
    render: h => h(App_vue_1.default),
}).$mount('#app');
if (process.env.NODE_ENV !== 'production') {
    // Make sure that we get all error messages properly displayed
    // as long as we are not in production mode
    window.onerror = (message, source, lineno, colno, error) => {
        if (message.toString().includes('ResizeObserver')) {
            // That error can apparently be ignored and can probably
            // not do anything about it anyway
            return;
        }
        console.error('error caught in main.ts'); // eslint-disable-line no-console
        console.error(message); // eslint-disable-line no-console
        console.error(error); // eslint-disable-line no-console
    };
}
