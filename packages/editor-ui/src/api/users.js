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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitPersonalizationSurvey = exports.reinvite = exports.inviteUsers = exports.getUsers = exports.deleteUser = exports.updateCurrentUserPassword = exports.updateCurrentUser = exports.changePassword = exports.validatePasswordToken = exports.sendForgotPasswordEmail = exports.signup = exports.validateSignupToken = exports.skipOwnerSetup = exports.setupOwner = exports.logout = exports.login = exports.getCurrentUser = exports.loginCurrentUser = void 0;
const helpers_1 = require("./helpers");
function loginCurrentUser(context) {
    return (0, helpers_1.makeRestApiRequest)(context, 'GET', '/login');
}
exports.loginCurrentUser = loginCurrentUser;
function getCurrentUser(context) {
    return (0, helpers_1.makeRestApiRequest)(context, 'GET', '/me');
}
exports.getCurrentUser = getCurrentUser;
function login(context, params) {
    return (0, helpers_1.makeRestApiRequest)(context, 'POST', '/login', params);
}
exports.login = login;
function logout(context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, helpers_1.makeRestApiRequest)(context, 'POST', '/logout');
    });
}
exports.logout = logout;
function setupOwner(context, params) {
    return (0, helpers_1.makeRestApiRequest)(context, 'POST', '/owner', params);
}
exports.setupOwner = setupOwner;
function skipOwnerSetup(context) {
    return (0, helpers_1.makeRestApiRequest)(context, 'POST', '/owner/skip-setup');
}
exports.skipOwnerSetup = skipOwnerSetup;
function validateSignupToken(context, params) {
    return (0, helpers_1.makeRestApiRequest)(context, 'GET', '/resolve-signup-token', params);
}
exports.validateSignupToken = validateSignupToken;
function signup(context, params) {
    const { inviteeId } = params, props = __rest(params, ["inviteeId"]);
    return (0, helpers_1.makeRestApiRequest)(context, 'POST', `/users/${params.inviteeId}`, props);
}
exports.signup = signup;
function sendForgotPasswordEmail(context, params) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, helpers_1.makeRestApiRequest)(context, 'POST', '/forgot-password', params);
    });
}
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
function validatePasswordToken(context, params) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, helpers_1.makeRestApiRequest)(context, 'GET', '/resolve-password-token', params);
    });
}
exports.validatePasswordToken = validatePasswordToken;
function changePassword(context, params) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, helpers_1.makeRestApiRequest)(context, 'POST', '/change-password', params);
    });
}
exports.changePassword = changePassword;
function updateCurrentUser(context, params) {
    return (0, helpers_1.makeRestApiRequest)(context, 'PATCH', `/me`, params);
}
exports.updateCurrentUser = updateCurrentUser;
function updateCurrentUserPassword(context, params) {
    return (0, helpers_1.makeRestApiRequest)(context, 'PATCH', `/me/password`, params);
}
exports.updateCurrentUserPassword = updateCurrentUserPassword;
function deleteUser(context, { id, transferId }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, helpers_1.makeRestApiRequest)(context, 'DELETE', `/users/${id}`, transferId ? { transferId } : {});
    });
}
exports.deleteUser = deleteUser;
function getUsers(context) {
    return (0, helpers_1.makeRestApiRequest)(context, 'GET', '/users');
}
exports.getUsers = getUsers;
function inviteUsers(context, params) {
    return (0, helpers_1.makeRestApiRequest)(context, 'POST', '/users', params);
}
exports.inviteUsers = inviteUsers;
function reinvite(context, { id }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, helpers_1.makeRestApiRequest)(context, 'POST', `/users/${id}/reinvite`);
    });
}
exports.reinvite = reinvite;
function submitPersonalizationSurvey(context, params) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, helpers_1.makeRestApiRequest)(context, 'POST', '/me/survey', params);
    });
}
exports.submitPersonalizationSurvey = submitPersonalizationSurvey;
