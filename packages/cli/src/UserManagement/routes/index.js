"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.addRoutes = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable import/no-cycle */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const n8n_workflow_1 = require("n8n-workflow");
const auth_1 = require("./auth");
const config = __importStar(require("../../../config"));
const constants_1 = require("../../constants");
const jwt_1 = require("../auth/jwt");
const me_1 = require("./me");
const users_1 = require("./users");
const passwordReset_1 = require("./passwordReset");
const owner_1 = require("./owner");
const UserManagementHelper_1 = require("../UserManagementHelper");
const __1 = require("../..");
function addRoutes(ignoredEndpoints, restEndpoint) {
    // needed for testing; not adding overhead since it directly returns if req.cookies exists
    this.app.use((0, cookie_parser_1.default)());
    const options = {
        jwtFromRequest: (req) => {
            var _a, _b;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return (_b = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[constants_1.AUTH_COOKIE_NAME]) !== null && _b !== void 0 ? _b : null;
        },
        secretOrKey: config.getEnv('userManagement.jwtSecret'),
    };
    passport_1.default.use(new passport_jwt_1.Strategy(options, function validateCookieContents(jwtPayload, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield (0, jwt_1.resolveJwtContent)(jwtPayload);
                return done(null, user);
            }
            catch (error) {
                n8n_workflow_1.LoggerProxy.debug('Failed to extract user from JWT payload', { jwtPayload });
                return done(null, false, { message: 'User not found' });
            }
        });
    }));
    this.app.use(passport_1.default.initialize());
    this.app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        if (
        // TODO: refactor me!!!
        // skip authentication for preflight requests
        req.method === 'OPTIONS' ||
            req.url === '/index.html' ||
            req.url === '/favicon.ico' ||
            req.url.startsWith('/css/') ||
            req.url.startsWith('/js/') ||
            req.url.startsWith('/fonts/') ||
            req.url.includes('.svg') ||
            req.url.startsWith(`/${restEndpoint}/settings`) ||
            req.url.startsWith(`/${restEndpoint}/login`) ||
            req.url.startsWith(`/${restEndpoint}/logout`) ||
            req.url.startsWith(`/${restEndpoint}/resolve-signup-token`) ||
            (0, UserManagementHelper_1.isPostUsersId)(req, restEndpoint) ||
            req.url.startsWith(`/${restEndpoint}/forgot-password`) ||
            req.url.startsWith(`/${restEndpoint}/resolve-password-token`) ||
            req.url.startsWith(`/${restEndpoint}/change-password`) ||
            req.url.startsWith(`/${restEndpoint}/oauth2-credential/callback`) ||
            req.url.startsWith(`/${restEndpoint}/oauth1-credential/callback`) ||
            (0, UserManagementHelper_1.isAuthExcluded)(req.url, ignoredEndpoints)) {
            return next();
        }
        // skip authentication if user management is disabled
        if ((0, UserManagementHelper_1.isUserManagementDisabled)()) {
            req.user = yield __1.Db.collections.User.findOneOrFail({}, {
                relations: ['globalRole'],
            });
            return next();
        }
        return passport_1.default.authenticate('jwt', { session: false })(req, res, next);
    }));
    this.app.use((req, res, next) => {
        // req.user is empty for public routes, so just proceed
        // owner can do anything, so proceed as well
        if (!req.user || ((0, UserManagementHelper_1.isAuthenticatedRequest)(req) && req.user.globalRole.name === 'owner')) {
            next();
            return;
        }
        // Not owner and user exists. We now protect restricted urls.
        const postRestrictedUrls = [`/${this.restEndpoint}/users`, `/${this.restEndpoint}/owner`];
        const getRestrictedUrls = [`/${this.restEndpoint}/users`];
        const trimmedUrl = req.url.endsWith('/') ? req.url.slice(0, -1) : req.url;
        if ((req.method === 'POST' && postRestrictedUrls.includes(trimmedUrl)) ||
            (req.method === 'GET' && getRestrictedUrls.includes(trimmedUrl)) ||
            (req.method === 'DELETE' &&
                new RegExp(`/${restEndpoint}/users/[^/]+`, 'gm').test(trimmedUrl)) ||
            (req.method === 'POST' &&
                new RegExp(`/${restEndpoint}/users/[^/]+/reinvite`, 'gm').test(trimmedUrl)) ||
            new RegExp(`/${restEndpoint}/owner/[^/]+`, 'gm').test(trimmedUrl)) {
            n8n_workflow_1.LoggerProxy.verbose('User attempted to access endpoint without authorization', {
                endpoint: `${req.method} ${trimmedUrl}`,
                userId: (0, UserManagementHelper_1.isAuthenticatedRequest)(req) ? req.user.id : 'unknown',
            });
            res.status(403).json({ status: 'error', message: 'Unauthorized' });
            return;
        }
        next();
    });
    // middleware to refresh cookie before it expires
    this.app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const cookieAuth = options.jwtFromRequest(req);
        if (cookieAuth && req.user) {
            const cookieContents = jsonwebtoken_1.default.decode(cookieAuth);
            if (cookieContents.exp * 1000 - Date.now() < 259200000) {
                // if cookie expires in < 3 days, renew it.
                yield (0, jwt_1.issueCookie)(res, req.user);
            }
        }
        next();
    }));
    auth_1.authenticationMethods.apply(this);
    owner_1.ownerNamespace.apply(this);
    me_1.meNamespace.apply(this);
    passwordReset_1.passwordResetNamespace.apply(this);
    users_1.usersNamespace.apply(this);
}
exports.addRoutes = addRoutes;
