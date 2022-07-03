"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userHelpers = void 0;
const userHelpers_1 = require("@/modules/userHelpers");
const vue_1 = __importDefault(require("vue"));
exports.userHelpers = vue_1.default.extend({
    methods: {
        canUserAccessRouteByName(name) {
            const { route } = this.$router.resolve({ name });
            return this.canUserAccessRoute(route);
        },
        canUserAccessCurrentRoute() {
            return this.canUserAccessRoute(this.$route);
        },
        canUserAccessRoute(route) {
            const permissions = route.meta && route.meta.permissions;
            const currentUser = this.$store.getters['users/currentUser'];
            const isUMEnabled = this.$store.getters['settings/isUserManagementEnabled'];
            const isPublicApiEnabled = this.$store.getters['settings/isPublicApiEnabled'];
            return permissions && (0, userHelpers_1.isAuthorized)(permissions, {
                currentUser,
                isUMEnabled,
                isPublicApiEnabled,
            });
        },
    },
});
