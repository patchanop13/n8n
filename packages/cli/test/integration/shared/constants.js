"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAPPING_TABLES = exports.DB_INITIALIZATION_TIMEOUT = exports.SMTP_TEST_TIMEOUT = exports.BOOTSTRAP_MYSQL_CONNECTION_NAME = exports.BOOTSTRAP_POSTGRES_CONNECTION_NAME = exports.MAPPING_TABLES_TO_CLEAR = exports.ROUTES_REQUIRING_AUTHORIZATION = exports.ROUTES_REQUIRING_AUTHENTICATION = exports.LOGGED_OUT_RESPONSE_BODY = exports.SUCCESS_RESPONSE_BODY = exports.AUTHLESS_ENDPOINTS = exports.PUBLIC_API_REST_PATH_SEGMENT = exports.REST_PATH_SEGMENT = void 0;
const config_1 = __importDefault(require("../../../config"));
exports.REST_PATH_SEGMENT = config_1.default.getEnv('endpoints.rest');
exports.PUBLIC_API_REST_PATH_SEGMENT = config_1.default.getEnv('publicApi.path');
exports.AUTHLESS_ENDPOINTS = [
    'healthz',
    'metrics',
    config_1.default.getEnv('endpoints.webhook'),
    config_1.default.getEnv('endpoints.webhookWaiting'),
    config_1.default.getEnv('endpoints.webhookTest'),
];
exports.SUCCESS_RESPONSE_BODY = {
    data: {
        success: true,
    },
};
exports.LOGGED_OUT_RESPONSE_BODY = {
    data: {
        loggedOut: true,
    },
};
/**
 * Routes requiring a valid `n8n-auth` cookie for a user, either owner or member.
 */
exports.ROUTES_REQUIRING_AUTHENTICATION = [
    'GET /me',
    'PATCH /me',
    'PATCH /me/password',
    'POST /me/survey',
    'POST /owner',
    'GET /non-existent',
];
/**
 * Routes requiring a valid `n8n-auth` cookie for an owner.
 */
exports.ROUTES_REQUIRING_AUTHORIZATION = [
    'POST /users',
    'GET /users',
    'DELETE /users/123',
    'POST /users/123/reinvite',
    'POST /owner',
    'POST /owner/skip-setup',
];
/**
 * Mapping tables link entities but, unlike `SharedWorkflow` and `SharedCredentials`,
 * have no entity representation. Therefore, mapping tables must be cleared
 * on truncation of any of the collections they link.
 */
exports.MAPPING_TABLES_TO_CLEAR = {
    Workflow: ['workflows_tags'],
    Tag: ['workflows_tags'],
};
/**
 * Name of the connection used for creating and dropping a Postgres DB
 * for each suite test run.
 */
exports.BOOTSTRAP_POSTGRES_CONNECTION_NAME = 'n8n_bs_postgres';
/**
 * Name of the connection (and database) used for creating and dropping a MySQL DB
 * for each suite test run.
 */
exports.BOOTSTRAP_MYSQL_CONNECTION_NAME = 'n8n_bs_mysql';
/**
 * Timeout (in milliseconds) to account for fake SMTP service being slow to respond.
 */
exports.SMTP_TEST_TIMEOUT = 30000;
/**
 * Timeout (in milliseconds) to account for DB being slow to initialize.
 */
exports.DB_INITIALIZATION_TIMEOUT = 30000;
/**
 * Mapping tables having no entity representation.
 */
exports.MAPPING_TABLES = {
    WorkflowsTags: 'workflows_tags',
};
