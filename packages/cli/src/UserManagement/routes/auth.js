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
exports.authenticationMethods = void 0;
const __1 = require("../..");
const constants_1 = require("../../constants");
const jwt_1 = require("../auth/jwt");
const UserManagementHelper_1 = require("../UserManagementHelper");
const config = require("../../../config");
function authenticationMethods() {
    /**
     * Log in a user.
     *
     * Authless endpoint.
     */
    this.app.post(`/${this.restEndpoint}/login`, __1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
        if (!req.body.email) {
            throw new Error('Email is required to log in');
        }
        if (!req.body.password) {
            throw new Error('Password is required to log in');
        }
        let user;
        try {
            user = yield __1.Db.collections.User.findOne({
                email: req.body.email,
            }, {
                relations: ['globalRole'],
            });
        }
        catch (error) {
            throw new Error('Unable to access database.');
        }
        if (!user || !user.password || !(yield (0, UserManagementHelper_1.compareHash)(req.body.password, user.password))) {
            // password is empty until user signs up
            const error = new Error('Wrong username or password. Do you have caps lock on?');
            // @ts-ignore
            error.httpStatusCode = 401;
            throw error;
        }
        yield (0, jwt_1.issueCookie)(res, user);
        return (0, UserManagementHelper_1.sanitizeUser)(user);
    })));
    /**
     * Manually check the `n8n-auth` cookie.
     */
    this.app.get(`/${this.restEndpoint}/login`, __1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        // Manually check the existing cookie.
        const cookieContents = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[constants_1.AUTH_COOKIE_NAME];
        let user;
        if (cookieContents) {
            // If logged in, return user
            try {
                user = yield (0, jwt_1.resolveJwt)(cookieContents);
                if (!config.get('userManagement.isInstanceOwnerSetUp')) {
                    res.cookie(constants_1.AUTH_COOKIE_NAME, cookieContents);
                }
                return (0, UserManagementHelper_1.sanitizeUser)(user);
            }
            catch (error) {
                res.clearCookie(constants_1.AUTH_COOKIE_NAME);
            }
        }
        if (config.get('userManagement.isInstanceOwnerSetUp')) {
            const error = new Error('Not logged in');
            // @ts-ignore
            error.httpStatusCode = 401;
            throw error;
        }
        try {
            user = yield __1.Db.collections.User.findOneOrFail({ relations: ['globalRole'] });
        }
        catch (error) {
            throw new Error('No users found in database - did you wipe the users table? Create at least one user.');
        }
        if (user.email || user.password) {
            throw new Error('Invalid database state - user has password set.');
        }
        yield (0, jwt_1.issueCookie)(res, user);
        return (0, UserManagementHelper_1.sanitizeUser)(user);
    })));
    /**
     * Log out a user.
     *
     * Authless endpoint.
     */
    this.app.post(`/${this.restEndpoint}/logout`, __1.ResponseHelper.send((_, res) => __awaiter(this, void 0, void 0, function* () {
        res.clearCookie(constants_1.AUTH_COOKIE_NAME);
        return {
            loggedOut: true,
        };
    })));
}
exports.authenticationMethods = authenticationMethods;
