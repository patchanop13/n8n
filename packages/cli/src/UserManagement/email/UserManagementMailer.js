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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstance = exports.UserManagementMailer = void 0;
/* eslint-disable import/no-cycle */
const fs_1 = require("fs");
const path_1 = require("path");
const __1 = require("../..");
const config = __importStar(require("../../../config"));
const NodeMailer_1 = require("./NodeMailer");
// TODO: make function fully async (remove sync functions)
function getTemplate(configKeyName, defaultFilename) {
    return __awaiter(this, void 0, void 0, function* () {
        const templateOverride = (yield __1.GenericHelpers.getConfigValue(`userManagement.emails.templates.${configKeyName}`));
        let template;
        if (templateOverride && (0, fs_1.existsSync)(templateOverride)) {
            template = (0, fs_1.readFileSync)(templateOverride, {
                encoding: 'utf-8',
            });
        }
        else {
            template = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, `templates/${defaultFilename}`), {
                encoding: 'utf-8',
            });
        }
        return template;
    });
}
function replaceStrings(template, data) {
    let output = template;
    const keys = Object.keys(data);
    keys.forEach((key) => {
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
        output = output.replace(regex, data[key]);
    });
    return output;
}
class UserManagementMailer {
    constructor() {
        // Other implementations can be used in the future.
        if (config.getEnv('userManagement.emails.mode') === 'smtp') {
            this.mailer = new NodeMailer_1.NodeMailer();
        }
    }
    verifyConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.mailer)
                return Promise.reject();
            return this.mailer.verifyConnection();
        });
    }
    invite(inviteEmailData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let template = yield getTemplate('invite', 'invite.html');
            template = replaceStrings(template, inviteEmailData);
            const result = yield ((_a = this.mailer) === null || _a === void 0 ? void 0 : _a.sendMail({
                emailRecipients: inviteEmailData.email,
                subject: 'You have been invited to n8n',
                body: template,
            }));
            // If mailer does not exist it means mail has been disabled.
            return result !== null && result !== void 0 ? result : { success: true };
        });
    }
    passwordReset(passwordResetData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let template = yield getTemplate('passwordReset', 'passwordReset.html');
            template = replaceStrings(template, passwordResetData);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const result = yield ((_a = this.mailer) === null || _a === void 0 ? void 0 : _a.sendMail({
                emailRecipients: passwordResetData.email,
                subject: 'n8n password reset',
                body: template,
            }));
            // If mailer does not exist it means mail has been disabled.
            return result !== null && result !== void 0 ? result : { success: true };
        });
    }
}
exports.UserManagementMailer = UserManagementMailer;
let mailerInstance;
function getInstance() {
    return __awaiter(this, void 0, void 0, function* () {
        if (mailerInstance === undefined) {
            mailerInstance = new UserManagementMailer();
            yield mailerInstance.verifyConnection();
        }
        return mailerInstance;
    });
}
exports.getInstance = getInstance;
