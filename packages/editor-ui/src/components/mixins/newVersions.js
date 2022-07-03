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
exports.newVersions = void 0;
const vue_typed_mixins_1 = __importDefault(require("vue-typed-mixins"));
const showMessage_1 = require("./showMessage");
const constants_1 = require("@/constants");
exports.newVersions = (0, vue_typed_mixins_1.default)(showMessage_1.showMessage).extend({
    methods: {
        checkForNewVersions() {
            return __awaiter(this, void 0, void 0, function* () {
                const enabled = this.$store.getters['versions/areNotificationsEnabled'];
                if (!enabled) {
                    return;
                }
                yield this.$store.dispatch('versions/fetchVersions');
                const currentVersion = this.$store.getters['versions/currentVersion'];
                const nextVersions = this.$store.getters['versions/nextVersions'];
                if (currentVersion && currentVersion.hasSecurityIssue && nextVersions.length) {
                    const fixVersion = currentVersion.securityIssueFixVersion;
                    let message = `Please update to latest version.`;
                    if (fixVersion) {
                        message = `Please update to version ${fixVersion} or higher.`;
                    }
                    message = `${message} <a class="primary-color">More info</a>`;
                    this.$showToast({
                        title: 'Critical update available',
                        message,
                        onClick: () => {
                            this.$store.dispatch('ui/openModal', constants_1.VERSIONS_MODAL_KEY);
                        },
                        closeOnClick: true,
                        customClass: 'clickable',
                        type: 'warning',
                        duration: 0,
                    });
                }
            });
        },
    },
});
