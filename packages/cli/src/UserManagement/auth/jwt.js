"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/no-cycle */
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
exports.issueCookie = exports.resolveJwt = exports.resolveJwtContent = exports.issueJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const __1 = require("../..");
const constants_1 = require("../../constants");
const config = __importStar(require("../../../config"));
function issueJWT(user) {
    const { id, email, password } = user;
    const expiresIn = 7 * 86400000; // 7 days
    const payload = {
        id,
        email,
        password: password !== null && password !== void 0 ? password : null,
    };
    if (password) {
        payload.password = (0, crypto_1.createHash)('sha256')
            .update(password.slice(password.length / 2))
            .digest('hex');
    }
    const signedToken = jsonwebtoken_1.default.sign(payload, config.getEnv('userManagement.jwtSecret'), {
        expiresIn: expiresIn / 1000 /* in seconds */,
    });
    return {
        token: signedToken,
        expiresIn,
    };
}
exports.issueJWT = issueJWT;
function resolveJwtContent(jwtPayload) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield __1.Db.collections.User.findOne(jwtPayload.id, {
            relations: ['globalRole'],
        });
        let passwordHash = null;
        if (user === null || user === void 0 ? void 0 : user.password) {
            passwordHash = (0, crypto_1.createHash)('sha256')
                .update(user.password.slice(user.password.length / 2))
                .digest('hex');
        }
        if (!user || jwtPayload.password !== passwordHash || user.email !== jwtPayload.email) {
            // When owner hasn't been set up, the default user
            // won't have email nor password (both equals null)
            throw new Error('Invalid token content');
        }
        return user;
    });
}
exports.resolveJwtContent = resolveJwtContent;
function resolveJwt(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const jwtPayload = jsonwebtoken_1.default.verify(token, config.getEnv('userManagement.jwtSecret'));
        return resolveJwtContent(jwtPayload);
    });
}
exports.resolveJwt = resolveJwt;
function issueCookie(res, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const userData = issueJWT(user);
        res.cookie(constants_1.AUTH_COOKIE_NAME, userData.token, { maxAge: userData.expiresIn, httpOnly: true });
    });
}
exports.issueCookie = issueCookie;
