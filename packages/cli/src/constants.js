"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/naming-convention */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_COOKIE_NAME = exports.RESPONSE_ERROR_MESSAGES = void 0;
const n8n_core_1 = require("n8n-core");
exports.RESPONSE_ERROR_MESSAGES = {
    NO_CREDENTIAL: 'Credential not found',
    NO_ENCRYPTION_KEY: n8n_core_1.RESPONSE_ERROR_MESSAGES.NO_ENCRYPTION_KEY,
};
exports.AUTH_COOKIE_NAME = 'n8n-auth';
