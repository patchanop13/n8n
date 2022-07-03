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
exports.NodeMailer = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const nodemailer_1 = require("nodemailer");
const n8n_workflow_1 = require("n8n-workflow");
const config = __importStar(require("../../../config"));
class NodeMailer {
    constructor() {
        this.transport = (0, nodemailer_1.createTransport)({
            host: config.getEnv('userManagement.emails.smtp.host'),
            port: config.getEnv('userManagement.emails.smtp.port'),
            secure: config.getEnv('userManagement.emails.smtp.secure'),
            auth: {
                user: config.getEnv('userManagement.emails.smtp.auth.user'),
                pass: config.getEnv('userManagement.emails.smtp.auth.pass'),
            },
        });
    }
    verifyConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = config.getEnv('userManagement.emails.smtp.host');
            const user = config.getEnv('userManagement.emails.smtp.auth.user');
            const pass = config.getEnv('userManagement.emails.smtp.auth.pass');
            return new Promise((resolve, reject) => {
                this.transport.verify((error) => {
                    if (!error) {
                        resolve();
                        return;
                    }
                    const message = [];
                    if (!host)
                        message.push('SMTP host not defined (N8N_SMTP_HOST).');
                    if (!user)
                        message.push('SMTP user not defined (N8N_SMTP_USER).');
                    if (!pass)
                        message.push('SMTP pass not defined (N8N_SMTP_PASS).');
                    reject(new Error(message.length ? message.join(' ') : error.message));
                });
            });
        });
    }
    sendMail(mailData) {
        return __awaiter(this, void 0, void 0, function* () {
            let sender = config.getEnv('userManagement.emails.smtp.sender');
            const user = config.getEnv('userManagement.emails.smtp.auth.user');
            if (!sender && user.includes('@')) {
                sender = user;
            }
            try {
                yield this.transport.sendMail({
                    from: sender,
                    to: mailData.emailRecipients,
                    subject: mailData.subject,
                    text: mailData.textOnly,
                    html: mailData.body,
                });
                n8n_workflow_1.LoggerProxy.verbose(`Email sent successfully to the following recipients: ${mailData.emailRecipients.toString()}`);
            }
            catch (error) {
                n8n_workflow_1.LoggerProxy.error('Failed to send email', { recipients: mailData.emailRecipients, error });
                return {
                    success: false,
                    error,
                };
            }
            return { success: true };
        });
    }
}
exports.NodeMailer = NodeMailer;
