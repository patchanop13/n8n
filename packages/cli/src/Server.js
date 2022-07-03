"use strict";
/* eslint-disable @typescript-eslint/no-unnecessary-boolean-literal-compare */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable new-cap */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable import/no-cycle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable id-denylist */
/* eslint-disable no-console */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-await-in-loop */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.externalHooks = void 0;
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const lodash_1 = __importStar(require("lodash"));
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_history_api_fallback_1 = __importDefault(require("connect-history-api-fallback"));
const os_1 = __importDefault(require("os"));
// eslint-disable-next-line import/no-extraneous-dependencies
const client_oauth2_1 = __importDefault(require("client-oauth2"));
const oauth_1_0a_1 = __importDefault(require("oauth-1.0a"));
const csrf_1 = __importDefault(require("csrf"));
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const crypto_1 = require("crypto");
// IMPORTANT! Do not switch to anther bcrypt library unless really necessary and
// tested with all possible systems like Windows, Alpine on ARM, FreeBSD, ...
const bcryptjs_1 = require("bcryptjs");
const n8n_core_1 = require("n8n-core");
const n8n_workflow_1 = require("n8n-workflow");
const basic_auth_1 = __importDefault(require("basic-auth"));
const compression_1 = __importDefault(require("compression"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
// @ts-ignore
const google_timezones_json_1 = __importDefault(require("google-timezones-json"));
const parseurl_1 = __importDefault(require("parseurl"));
const querystring_1 = __importDefault(require("querystring"));
const prom_client_1 = __importDefault(require("prom-client"));
const Queue = __importStar(require("./Queue"));
const _1 = require(".");
const config_1 = __importDefault(require("../config"));
const TagHelpers = __importStar(require("./TagHelpers"));
const InternalHooksManager_1 = require("./InternalHooksManager");
const TagEntity_1 = require("./databases/entities/TagEntity");
const WorkflowEntity_1 = require("./databases/entities/WorkflowEntity");
const WorkflowHelpers_1 = require("./WorkflowHelpers");
const TranslationHelpers_1 = require("./TranslationHelpers");
const WebhookHelpers_1 = require("./WebhookHelpers");
const UserManagement_1 = require("./UserManagement");
const jwt_1 = require("./UserManagement/auth/jwt");
const GenericHelpers_1 = require("./GenericHelpers");
const SharedWorkflow_1 = require("./databases/entities/SharedWorkflow");
const constants_1 = require("./constants");
const credentials_api_1 = require("./api/credentials.api");
const UserManagementHelper_1 = require("./UserManagement/UserManagementHelper");
const PublicApi_1 = require("./PublicApi");
require('body-parser-xml')(body_parser_1.default);
exports.externalHooks = (0, _1.ExternalHooks)();
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.endpointWebhook = config_1.default.getEnv('endpoints.webhook');
        this.endpointWebhookWaiting = config_1.default.getEnv('endpoints.webhookWaiting');
        this.endpointWebhookTest = config_1.default.getEnv('endpoints.webhookTest');
        this.defaultWorkflowName = config_1.default.getEnv('workflows.defaultName');
        this.defaultCredentialsName = config_1.default.getEnv('credentials.defaultName');
        this.saveDataErrorExecution = config_1.default.get('executions.saveDataOnError');
        this.saveDataSuccessExecution = config_1.default.get('executions.saveDataOnSuccess');
        this.saveManualExecutions = config_1.default.get('executions.saveDataManualExecutions');
        this.executionTimeout = config_1.default.get('executions.timeout');
        this.maxExecutionTimeout = config_1.default.get('executions.maxTimeout');
        this.payloadSizeMax = config_1.default.get('endpoints.payloadSizeMax');
        this.timezone = config_1.default.get('generic.timezone');
        this.restEndpoint = config_1.default.get('endpoints.rest');
        this.publicApiEndpoint = config_1.default.get('publicApi.path');
        this.activeWorkflowRunner = _1.ActiveWorkflowRunner.getInstance();
        this.testWebhooks = _1.TestWebhooks.getInstance();
        this.push = _1.Push.getInstance();
        this.activeExecutionsInstance = _1.ActiveExecutions.getInstance();
        this.waitTracker = (0, _1.WaitTracker)();
        this.protocol = config_1.default.getEnv('protocol');
        this.sslKey = config_1.default.getEnv('ssl_key');
        this.sslCert = config_1.default.getEnv('ssl_cert');
        this.externalHooks = exports.externalHooks;
        this.presetCredentialsLoaded = false;
        this.endpointPresetCredentials = config_1.default.getEnv('credentials.overwrite.endpoint');
        const urlBaseWebhook = _1.WebhookHelpers.getWebhookBaseUrl();
        const telemetrySettings = {
            enabled: config_1.default.getEnv('diagnostics.enabled'),
        };
        if (telemetrySettings.enabled) {
            const conf = config_1.default.getEnv('diagnostics.config.frontend');
            const [key, url] = conf.split(';');
            if (!key || !url) {
                n8n_workflow_1.LoggerProxy.warn('Diagnostics frontend config is invalid');
                telemetrySettings.enabled = false;
            }
            telemetrySettings.config = { key, url };
        }
        this.frontendSettings = {
            endpointWebhook: this.endpointWebhook,
            endpointWebhookTest: this.endpointWebhookTest,
            saveDataErrorExecution: this.saveDataErrorExecution,
            saveDataSuccessExecution: this.saveDataSuccessExecution,
            saveManualExecutions: this.saveManualExecutions,
            executionTimeout: this.executionTimeout,
            maxExecutionTimeout: this.maxExecutionTimeout,
            timezone: this.timezone,
            urlBaseWebhook,
            urlBaseEditor: (0, UserManagementHelper_1.getInstanceBaseUrl)(),
            versionCli: '',
            oauthCallbackUrls: {
                oauth1: `${urlBaseWebhook}${this.restEndpoint}/oauth1-credential/callback`,
                oauth2: `${urlBaseWebhook}${this.restEndpoint}/oauth2-credential/callback`,
            },
            versionNotifications: {
                enabled: config_1.default.getEnv('versionNotifications.enabled'),
                endpoint: config_1.default.getEnv('versionNotifications.endpoint'),
                infoUrl: config_1.default.getEnv('versionNotifications.infoUrl'),
            },
            instanceId: '',
            telemetry: telemetrySettings,
            personalizationSurveyEnabled: config_1.default.getEnv('personalization.enabled') && config_1.default.getEnv('diagnostics.enabled'),
            defaultLocale: config_1.default.getEnv('defaultLocale'),
            userManagement: {
                enabled: (0, UserManagementHelper_1.isUserManagementEnabled)(),
                showSetupOnFirstLoad: config_1.default.getEnv('userManagement.disabled') === false &&
                    config_1.default.getEnv('userManagement.isInstanceOwnerSetUp') === false &&
                    config_1.default.getEnv('userManagement.skipInstanceOwnerSetup') === false,
                smtpSetup: (0, UserManagementHelper_1.isEmailSetUp)(),
            },
            publicApi: {
                enabled: config_1.default.getEnv('publicApi.disabled') === false,
                latestVersion: 1,
                path: config_1.default.getEnv('publicApi.path'),
            },
            workflowTagsDisabled: config_1.default.getEnv('workflowTagsDisabled'),
            logLevel: config_1.default.getEnv('logs.level'),
            hiringBannerEnabled: config_1.default.getEnv('hiringBanner.enabled'),
            templates: {
                enabled: config_1.default.getEnv('templates.enabled'),
                host: config_1.default.getEnv('templates.host'),
            },
        };
    }
    /**
     * Returns the current epoch time
     *
     * @returns {number}
     * @memberof App
     */
    getCurrentDate() {
        return new Date();
    }
    /**
     * Returns the current settings for the frontend
     */
    getSettingsForFrontend() {
        // refresh user management status
        Object.assign(this.frontendSettings.userManagement, {
            enabled: (0, UserManagementHelper_1.isUserManagementEnabled)(),
            showSetupOnFirstLoad: config_1.default.getEnv('userManagement.disabled') === false &&
                config_1.default.getEnv('userManagement.isInstanceOwnerSetUp') === false &&
                config_1.default.getEnv('userManagement.skipInstanceOwnerSetup') === false,
        });
        return this.frontendSettings;
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            const enableMetrics = config_1.default.getEnv('endpoints.metrics.enable');
            let register;
            if (enableMetrics) {
                const prefix = config_1.default.getEnv('endpoints.metrics.prefix');
                register = new prom_client_1.default.Registry();
                register.setDefaultLabels({ prefix });
                prom_client_1.default.collectDefaultMetrics({ register });
            }
            this.versions = yield _1.GenericHelpers.getVersions();
            this.frontendSettings.versionCli = this.versions.cli;
            this.frontendSettings.instanceId = yield n8n_core_1.UserSettings.getInstanceId();
            yield this.externalHooks.run('frontend.settings', [this.frontendSettings]);
            const excludeEndpoints = config_1.default.getEnv('security.excludeEndpoints');
            const ignoredEndpoints = [
                'healthz',
                'metrics',
                this.endpointWebhook,
                this.endpointWebhookTest,
                this.endpointPresetCredentials,
            ];
            if (!config_1.default.getEnv('publicApi.disabled')) {
                ignoredEndpoints.push(this.publicApiEndpoint);
            }
            // eslint-disable-next-line prefer-spread
            ignoredEndpoints.push.apply(ignoredEndpoints, excludeEndpoints.split(':'));
            // eslint-disable-next-line no-useless-escape
            const authIgnoreRegex = new RegExp(`^\/(${(0, lodash_1.default)(ignoredEndpoints).compact().join('|')})\/?.*$`);
            // Check for basic auth credentials if activated
            const basicAuthActive = config_1.default.getEnv('security.basicAuth.active');
            if (basicAuthActive) {
                const basicAuthUser = (yield _1.GenericHelpers.getConfigValue('security.basicAuth.user'));
                if (basicAuthUser === '') {
                    throw new Error('Basic auth is activated but no user got defined. Please set one!');
                }
                const basicAuthPassword = (yield _1.GenericHelpers.getConfigValue('security.basicAuth.password'));
                if (basicAuthPassword === '') {
                    throw new Error('Basic auth is activated but no password got defined. Please set one!');
                }
                const basicAuthHashEnabled = (yield _1.GenericHelpers.getConfigValue('security.basicAuth.hash'));
                let validPassword = null;
                this.app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    // Skip basic auth for a few listed endpoints or when instance owner has been setup
                    if (authIgnoreRegex.exec(req.url) ||
                        config_1.default.getEnv('userManagement.isInstanceOwnerSetUp')) {
                        return next();
                    }
                    const realm = 'n8n - Editor UI';
                    const basicAuthData = (0, basic_auth_1.default)(req);
                    if (basicAuthData === undefined) {
                        // Authorization data is missing
                        return _1.ResponseHelper.basicAuthAuthorizationError(res, realm, 'Authorization is required!');
                    }
                    if (basicAuthData.name === basicAuthUser) {
                        if (basicAuthHashEnabled) {
                            if (validPassword === null &&
                                (yield (0, bcryptjs_1.compare)(basicAuthData.pass, basicAuthPassword))) {
                                // Password is valid so save for future requests
                                validPassword = basicAuthData.pass;
                            }
                            if (validPassword === basicAuthData.pass && validPassword !== null) {
                                // Provided hash is correct
                                return next();
                            }
                        }
                        else if (basicAuthData.pass === basicAuthPassword) {
                            // Provided password is correct
                            return next();
                        }
                    }
                    // Provided authentication data is wrong
                    return _1.ResponseHelper.basicAuthAuthorizationError(res, realm, 'Authorization data is wrong!');
                }));
            }
            // Check for and validate JWT if configured
            const jwtAuthActive = config_1.default.getEnv('security.jwtAuth.active');
            if (jwtAuthActive) {
                const jwtAuthHeader = (yield _1.GenericHelpers.getConfigValue('security.jwtAuth.jwtHeader'));
                if (jwtAuthHeader === '') {
                    throw new Error('JWT auth is activated but no request header was defined. Please set one!');
                }
                const jwksUri = (yield _1.GenericHelpers.getConfigValue('security.jwtAuth.jwksUri'));
                if (jwksUri === '') {
                    throw new Error('JWT auth is activated but no JWK Set URI was defined. Please set one!');
                }
                const jwtHeaderValuePrefix = (yield _1.GenericHelpers.getConfigValue('security.jwtAuth.jwtHeaderValuePrefix'));
                const jwtIssuer = (yield _1.GenericHelpers.getConfigValue('security.jwtAuth.jwtIssuer'));
                const jwtNamespace = (yield _1.GenericHelpers.getConfigValue('security.jwtAuth.jwtNamespace'));
                const jwtAllowedTenantKey = (yield _1.GenericHelpers.getConfigValue('security.jwtAuth.jwtAllowedTenantKey'));
                const jwtAllowedTenant = (yield _1.GenericHelpers.getConfigValue('security.jwtAuth.jwtAllowedTenant'));
                // eslint-disable-next-line no-inner-declarations
                function isTenantAllowed(decodedToken) {
                    if (jwtNamespace === '' || jwtAllowedTenantKey === '' || jwtAllowedTenant === '') {
                        return true;
                    }
                    for (const [k, v] of Object.entries(decodedToken)) {
                        if (k === jwtNamespace) {
                            for (const [kn, kv] of Object.entries(v)) {
                                if (kn === jwtAllowedTenantKey && kv === jwtAllowedTenant) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }
                // eslint-disable-next-line consistent-return
                this.app.use((req, res, next) => {
                    if (authIgnoreRegex.exec(req.url)) {
                        return next();
                    }
                    let token = req.header(jwtAuthHeader);
                    if (token === undefined || token === '') {
                        return _1.ResponseHelper.jwtAuthAuthorizationError(res, 'Missing token');
                    }
                    if (jwtHeaderValuePrefix !== '' && token.startsWith(jwtHeaderValuePrefix)) {
                        token = token.replace(`${jwtHeaderValuePrefix} `, '').trimLeft();
                    }
                    const jwkClient = (0, jwks_rsa_1.default)({ cache: true, jwksUri });
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    function getKey(header, callback) {
                        jwkClient.getSigningKey(header.kid, (err, key) => {
                            // eslint-disable-next-line @typescript-eslint/no-throw-literal
                            if (err)
                                throw _1.ResponseHelper.jwtAuthAuthorizationError(res, err.message);
                            const signingKey = key.publicKey || key.rsaPublicKey;
                            callback(null, signingKey);
                        });
                    }
                    const jwtVerifyOptions = {
                        issuer: jwtIssuer !== '' ? jwtIssuer : undefined,
                        ignoreExpiration: false,
                    };
                    jsonwebtoken_1.default.verify(token, getKey, jwtVerifyOptions, (err, decoded) => {
                        if (err) {
                            _1.ResponseHelper.jwtAuthAuthorizationError(res, 'Invalid token');
                        }
                        else if (!isTenantAllowed(decoded)) {
                            _1.ResponseHelper.jwtAuthAuthorizationError(res, 'Tenant not allowed');
                        }
                        else {
                            next();
                        }
                    });
                });
            }
            // ----------------------------------------
            // Public API
            // ----------------------------------------
            if (!config_1.default.getEnv('publicApi.disabled')) {
                const { apiRouters, apiLatestVersion } = yield (0, PublicApi_1.loadPublicApiVersions)(this.publicApiEndpoint);
                this.app.use(...apiRouters);
                this.frontendSettings.publicApi.latestVersion = apiLatestVersion;
            }
            // Parse cookies for easier access
            this.app.use((0, cookie_parser_1.default)());
            // Get push connections
            this.app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                if (req.url.indexOf(`/${this.restEndpoint}/push`) === 0) {
                    if (req.query.sessionId === undefined) {
                        next(new Error('The query parameter "sessionId" is missing!'));
                        return;
                    }
                    if ((0, UserManagementHelper_1.isUserManagementEnabled)()) {
                        try {
                            const authCookie = (_b = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[constants_1.AUTH_COOKIE_NAME]) !== null && _b !== void 0 ? _b : '';
                            yield (0, jwt_1.resolveJwt)(authCookie);
                        }
                        catch (error) {
                            res.status(401).send('Unauthorized');
                            return;
                        }
                    }
                    this.push.add(req.query.sessionId, req, res);
                    return;
                }
                next();
            }));
            // Compress the response data
            this.app.use((0, compression_1.default)());
            // Make sure that each request has the "parsedUrl" parameter
            this.app.use((req, res, next) => {
                req.parsedUrl = (0, parseurl_1.default)(req);
                // @ts-ignore
                req.rawBody = Buffer.from('', 'base64');
                next();
            });
            // Support application/json type post data
            this.app.use(body_parser_1.default.json({
                limit: `${this.payloadSizeMax}mb`,
                verify: (req, res, buf) => {
                    // @ts-ignore
                    req.rawBody = buf;
                },
            }));
            // Support application/xml type post data
            this.app.use(
            // @ts-ignore
            body_parser_1.default.xml({
                limit: `${this.payloadSizeMax}mb`,
                xmlParseOptions: {
                    normalize: true,
                    normalizeTags: true,
                    explicitArray: false, // Only put properties in array if length > 1
                },
                verify: (req, res, buf) => {
                    // @ts-ignore
                    req.rawBody = buf;
                },
            }));
            this.app.use(body_parser_1.default.text({
                limit: `${this.payloadSizeMax}mb`,
                verify: (req, res, buf) => {
                    // @ts-ignore
                    req.rawBody = buf;
                },
            }));
            // Make sure that Vue history mode works properly
            this.app.use((0, connect_history_api_fallback_1.default)({
                rewrites: [
                    {
                        from: new RegExp(
                        // eslint-disable-next-line no-useless-escape
                        `^\/(${this.restEndpoint}|healthz|metrics|css|js|${this.endpointWebhook}|${this.endpointWebhookTest})\/?.*$`),
                        to: (context) => {
                            return context.parsedUrl.pathname.toString();
                        },
                    },
                ],
            }));
            // support application/x-www-form-urlencoded post data
            this.app.use(body_parser_1.default.urlencoded({
                limit: `${this.payloadSizeMax}mb`,
                extended: false,
                verify: (req, res, buf) => {
                    // @ts-ignore
                    req.rawBody = buf;
                },
            }));
            if (process.env.NODE_ENV !== 'production') {
                this.app.use((req, res, next) => {
                    // Allow access also from frontend when developing
                    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
                    res.header('Access-Control-Allow-Credentials', 'true');
                    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, sessionid');
                    next();
                });
            }
            // eslint-disable-next-line consistent-return
            this.app.use((req, res, next) => {
                if (!_1.Db.isInitialized) {
                    const error = new _1.ResponseHelper.ResponseError('Database is not ready!', undefined, 503);
                    return _1.ResponseHelper.sendErrorResponse(res, error);
                }
                next();
            });
            // ----------------------------------------
            // User Management
            // ----------------------------------------
            yield UserManagement_1.userManagementRouter.addRoutes.apply(this, [ignoredEndpoints, this.restEndpoint]);
            this.app.use(`/${this.restEndpoint}/credentials`, credentials_api_1.credentialsController);
            // ----------------------------------------
            // Healthcheck
            // ----------------------------------------
            // Does very basic health check
            this.app.get('/healthz', (req, res) => __awaiter(this, void 0, void 0, function* () {
                n8n_workflow_1.LoggerProxy.debug('Health check started!');
                const connection = (0, typeorm_1.getConnectionManager)().get();
                try {
                    if (!connection.isConnected) {
                        // Connection is not active
                        throw new Error('No active database connection!');
                    }
                    // DB ping
                    yield connection.query('SELECT 1');
                }
                catch (err) {
                    n8n_workflow_1.LoggerProxy.error('No Database connection!', err);
                    const error = new _1.ResponseHelper.ResponseError('No Database connection!', undefined, 503);
                    return _1.ResponseHelper.sendErrorResponse(res, error);
                }
                // Everything fine
                const responseData = {
                    status: 'ok',
                };
                n8n_workflow_1.LoggerProxy.debug('Health check completed successfully!');
                _1.ResponseHelper.sendSuccessResponse(res, responseData, true, 200);
            }));
            // ----------------------------------------
            // Metrics
            // ----------------------------------------
            if (enableMetrics) {
                this.app.get('/metrics', (req, res) => __awaiter(this, void 0, void 0, function* () {
                    const response = yield register.metrics();
                    res.setHeader('Content-Type', register.contentType);
                    _1.ResponseHelper.sendSuccessResponse(res, response, true, 200);
                }));
            }
            // ----------------------------------------
            // Workflow
            // ----------------------------------------
            // Creates a new workflow
            this.app.post(`/${this.restEndpoint}/workflows`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                delete req.body.id; // delete if sent
                const newWorkflow = new WorkflowEntity_1.WorkflowEntity();
                Object.assign(newWorkflow, req.body);
                yield (0, GenericHelpers_1.validateEntity)(newWorkflow);
                yield this.externalHooks.run('workflow.create', [newWorkflow]);
                const { tags: tagIds } = req.body;
                if ((tagIds === null || tagIds === void 0 ? void 0 : tagIds.length) && !config_1.default.getEnv('workflowTagsDisabled')) {
                    newWorkflow.tags = yield _1.Db.collections.Tag.findByIds(tagIds, {
                        select: ['id', 'name'],
                    });
                }
                yield _1.WorkflowHelpers.replaceInvalidCredentials(newWorkflow);
                let savedWorkflow;
                yield (0, typeorm_1.getConnection)().transaction((transactionManager) => __awaiter(this, void 0, void 0, function* () {
                    savedWorkflow = yield transactionManager.save(newWorkflow);
                    const role = yield _1.Db.collections.Role.findOneOrFail({
                        name: 'owner',
                        scope: 'workflow',
                    });
                    const newSharedWorkflow = new SharedWorkflow_1.SharedWorkflow();
                    Object.assign(newSharedWorkflow, {
                        role,
                        user: req.user,
                        workflow: savedWorkflow,
                    });
                    yield transactionManager.save(newSharedWorkflow);
                }));
                if (!savedWorkflow) {
                    n8n_workflow_1.LoggerProxy.error('Failed to create workflow', { userId: req.user.id });
                    throw new _1.ResponseHelper.ResponseError('Failed to save workflow');
                }
                if (tagIds && !config_1.default.getEnv('workflowTagsDisabled')) {
                    savedWorkflow.tags = TagHelpers.sortByRequestOrder(savedWorkflow.tags, {
                        requestOrder: tagIds,
                    });
                }
                yield this.externalHooks.run('workflow.afterCreate', [savedWorkflow]);
                void InternalHooksManager_1.InternalHooksManager.getInstance().onWorkflowCreated(req.user.id, newWorkflow, false);
                const { id } = savedWorkflow, rest = __rest(savedWorkflow, ["id"]);
                return Object.assign({ id: id.toString() }, rest);
            })));
            // Reads and returns workflow data from an URL
            this.app.get(`/${this.restEndpoint}/workflows/from-url`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                if (req.query.url === undefined) {
                    throw new _1.ResponseHelper.ResponseError(`The parameter "url" is missing!`, undefined, 400);
                }
                if (!/^http[s]?:\/\/.*\.json$/i.exec(req.query.url)) {
                    throw new _1.ResponseHelper.ResponseError(`The parameter "url" is not valid! It does not seem to be a URL pointing to a n8n workflow JSON file.`, undefined, 400);
                }
                const data = yield request_promise_native_1.default.get(req.query.url);
                let workflowData;
                try {
                    workflowData = JSON.parse(data);
                }
                catch (error) {
                    throw new _1.ResponseHelper.ResponseError(`The URL does not point to valid JSON file!`, undefined, 400);
                }
                // Do a very basic check if it is really a n8n-workflow-json
                if (workflowData === undefined ||
                    workflowData.nodes === undefined ||
                    !Array.isArray(workflowData.nodes) ||
                    workflowData.connections === undefined ||
                    typeof workflowData.connections !== 'object' ||
                    Array.isArray(workflowData.connections)) {
                    throw new _1.ResponseHelper.ResponseError(`The data in the file does not seem to be a n8n workflow JSON file!`, undefined, 400);
                }
                return workflowData;
            })));
            // Returns workflows
            this.app.get(`/${this.restEndpoint}/workflows`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                let workflows = [];
                const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
                const query = {
                    select: ['id', 'name', 'active', 'createdAt', 'updatedAt'],
                    relations: ['tags'],
                };
                if (config_1.default.getEnv('workflowTagsDisabled')) {
                    delete query.relations;
                }
                if (req.user.globalRole.name === 'owner') {
                    workflows = yield _1.Db.collections.Workflow.find(Object.assign(query, {
                        where: filter,
                    }));
                }
                else {
                    const shared = yield _1.Db.collections.SharedWorkflow.find({
                        relations: ['workflow'],
                        where: (0, WorkflowHelpers_1.whereClause)({
                            user: req.user,
                            entityType: 'workflow',
                        }),
                    });
                    if (!shared.length)
                        return [];
                    workflows = yield _1.Db.collections.Workflow.find(Object.assign(query, {
                        where: Object.assign({ id: (0, typeorm_1.In)(shared.map(({ workflow }) => workflow.id)) }, filter),
                    }));
                }
                return workflows.map((workflow) => {
                    const { id } = workflow, rest = __rest(workflow, ["id"]);
                    return Object.assign({ id: id.toString() }, rest);
                });
            })));
            this.app.get(`/${this.restEndpoint}/workflows/new`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                var _c;
                const requestedName = req.query.name && req.query.name !== '' ? req.query.name : this.defaultWorkflowName;
                const name = yield _1.GenericHelpers.generateUniqueName(requestedName, 'workflow');
                const onboardingFlowEnabled = !config_1.default.getEnv('workflows.onboardingFlowDisabled') &&
                    !((_c = req.user.settings) === null || _c === void 0 ? void 0 : _c.isOnboarded) &&
                    (yield (0, WorkflowHelpers_1.isBelowOnboardingThreshold)(req.user));
                return { name, onboardingFlowEnabled };
            })));
            // Returns a specific workflow
            this.app.get(`/${this.restEndpoint}/workflows/:id`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const { id: workflowId } = req.params;
                let relations = ['workflow', 'workflow.tags'];
                if (config_1.default.getEnv('workflowTagsDisabled')) {
                    relations = relations.filter((relation) => relation !== 'workflow.tags');
                }
                const shared = yield _1.Db.collections.SharedWorkflow.findOne({
                    relations,
                    where: (0, WorkflowHelpers_1.whereClause)({
                        user: req.user,
                        entityType: 'workflow',
                        entityId: workflowId,
                    }),
                });
                if (!shared) {
                    n8n_workflow_1.LoggerProxy.info('User attempted to access a workflow without permissions', {
                        workflowId,
                        userId: req.user.id,
                    });
                    throw new _1.ResponseHelper.ResponseError(`Workflow with ID "${workflowId}" could not be found.`, undefined, 404);
                }
                const _d = shared.workflow, { id } = _d, rest = __rest(_d, ["id"]);
                return Object.assign({ id: id.toString() }, rest);
            })));
            // Updates an existing workflow
            this.app.patch(`/${this.restEndpoint}/workflows/:id`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const { id: workflowId } = req.params;
                const updateData = new WorkflowEntity_1.WorkflowEntity();
                const _e = req.body, { tags } = _e, rest = __rest(_e, ["tags"]);
                Object.assign(updateData, rest);
                const shared = yield _1.Db.collections.SharedWorkflow.findOne({
                    relations: ['workflow'],
                    where: (0, WorkflowHelpers_1.whereClause)({
                        user: req.user,
                        entityType: 'workflow',
                        entityId: workflowId,
                    }),
                });
                if (!shared) {
                    n8n_workflow_1.LoggerProxy.info('User attempted to update a workflow without permissions', {
                        workflowId,
                        userId: req.user.id,
                    });
                    throw new _1.ResponseHelper.ResponseError(`Workflow with ID "${workflowId}" could not be found to be updated.`, undefined, 404);
                }
                // check credentials for old format
                yield _1.WorkflowHelpers.replaceInvalidCredentials(updateData);
                yield this.externalHooks.run('workflow.update', [updateData]);
                if (shared.workflow.active) {
                    // When workflow gets saved always remove it as the triggers could have been
                    // changed and so the changes would not take effect
                    yield this.activeWorkflowRunner.remove(workflowId);
                }
                if (updateData.settings) {
                    if (updateData.settings.timezone === 'DEFAULT') {
                        // Do not save the default timezone
                        delete updateData.settings.timezone;
                    }
                    if (updateData.settings.saveDataErrorExecution === 'DEFAULT') {
                        // Do not save when default got set
                        delete updateData.settings.saveDataErrorExecution;
                    }
                    if (updateData.settings.saveDataSuccessExecution === 'DEFAULT') {
                        // Do not save when default got set
                        delete updateData.settings.saveDataSuccessExecution;
                    }
                    if (updateData.settings.saveManualExecutions === 'DEFAULT') {
                        // Do not save when default got set
                        delete updateData.settings.saveManualExecutions;
                    }
                    if (parseInt(updateData.settings.executionTimeout, 10) === this.executionTimeout) {
                        // Do not save when default got set
                        delete updateData.settings.executionTimeout;
                    }
                }
                if (updateData.name) {
                    updateData.updatedAt = this.getCurrentDate(); // required due to atomic update
                    yield (0, GenericHelpers_1.validateEntity)(updateData);
                }
                yield _1.Db.collections.Workflow.update(workflowId, updateData);
                if (tags && !config_1.default.getEnv('workflowTagsDisabled')) {
                    const tablePrefix = config_1.default.getEnv('database.tablePrefix');
                    yield TagHelpers.removeRelations(workflowId, tablePrefix);
                    if (tags.length) {
                        yield TagHelpers.createRelations(workflowId, tags, tablePrefix);
                    }
                }
                const options = {
                    relations: ['tags'],
                };
                if (config_1.default.getEnv('workflowTagsDisabled')) {
                    delete options.relations;
                }
                // We sadly get nothing back from "update". Neither if it updated a record
                // nor the new value. So query now the hopefully updated entry.
                const updatedWorkflow = yield _1.Db.collections.Workflow.findOne(workflowId, options);
                if (updatedWorkflow === undefined) {
                    throw new _1.ResponseHelper.ResponseError(`Workflow with ID "${workflowId}" could not be found to be updated.`, undefined, 400);
                }
                if (updatedWorkflow.tags.length && (tags === null || tags === void 0 ? void 0 : tags.length)) {
                    updatedWorkflow.tags = TagHelpers.sortByRequestOrder(updatedWorkflow.tags, {
                        requestOrder: tags,
                    });
                }
                yield this.externalHooks.run('workflow.afterUpdate', [updatedWorkflow]);
                void InternalHooksManager_1.InternalHooksManager.getInstance().onWorkflowSaved(req.user.id, updatedWorkflow, false);
                if (updatedWorkflow.active) {
                    // When the workflow is supposed to be active add it again
                    try {
                        yield this.externalHooks.run('workflow.activate', [updatedWorkflow]);
                        yield this.activeWorkflowRunner.add(workflowId, shared.workflow.active ? 'update' : 'activate');
                    }
                    catch (error) {
                        // If workflow could not be activated set it again to inactive
                        updateData.active = false;
                        yield _1.Db.collections.Workflow.update(workflowId, updateData);
                        // Also set it in the returned data
                        updatedWorkflow.active = false;
                        // Now return the original error for UI to display
                        throw error;
                    }
                }
                const { id } = updatedWorkflow, remainder = __rest(updatedWorkflow, ["id"]);
                return Object.assign({ id: id.toString() }, remainder);
            })));
            // Deletes a specific workflow
            this.app.delete(`/${this.restEndpoint}/workflows/:id`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const { id: workflowId } = req.params;
                yield this.externalHooks.run('workflow.delete', [workflowId]);
                const shared = yield _1.Db.collections.SharedWorkflow.findOne({
                    relations: ['workflow'],
                    where: (0, WorkflowHelpers_1.whereClause)({
                        user: req.user,
                        entityType: 'workflow',
                        entityId: workflowId,
                    }),
                });
                if (!shared) {
                    n8n_workflow_1.LoggerProxy.info('User attempted to delete a workflow without permissions', {
                        workflowId,
                        userId: req.user.id,
                    });
                    throw new _1.ResponseHelper.ResponseError(`Workflow with ID "${workflowId}" could not be found to be deleted.`, undefined, 400);
                }
                if (shared.workflow.active) {
                    // deactivate before deleting
                    yield this.activeWorkflowRunner.remove(workflowId);
                }
                yield _1.Db.collections.Workflow.delete(workflowId);
                void InternalHooksManager_1.InternalHooksManager.getInstance().onWorkflowDeleted(req.user.id, workflowId, false);
                yield this.externalHooks.run('workflow.afterDelete', [workflowId]);
                return true;
            })));
            this.app.post(`/${this.restEndpoint}/workflows/run`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                var _f;
                const { workflowData } = req.body;
                const { runData } = req.body;
                const { startNodes } = req.body;
                const { destinationNode } = req.body;
                const executionMode = 'manual';
                const activationMode = 'manual';
                const sessionId = _1.GenericHelpers.getSessionId(req);
                // If webhooks nodes exist and are active we have to wait for till we receive a call
                if (runData === undefined ||
                    startNodes === undefined ||
                    startNodes.length === 0 ||
                    destinationNode === undefined) {
                    const additionalData = yield _1.WorkflowExecuteAdditionalData.getBase(req.user.id);
                    const nodeTypes = (0, _1.NodeTypes)();
                    const workflowInstance = new n8n_workflow_1.Workflow({
                        id: (_f = workflowData.id) === null || _f === void 0 ? void 0 : _f.toString(),
                        name: workflowData.name,
                        nodes: workflowData.nodes,
                        connections: workflowData.connections,
                        active: false,
                        nodeTypes,
                        staticData: undefined,
                        settings: workflowData.settings,
                    });
                    const needsWebhook = yield this.testWebhooks.needsWebhookData(workflowData, workflowInstance, additionalData, executionMode, activationMode, sessionId, destinationNode);
                    if (needsWebhook) {
                        return {
                            waitingForWebhook: true,
                        };
                    }
                }
                // For manual testing always set to not active
                workflowData.active = false;
                // Start the workflow
                const data = {
                    destinationNode,
                    executionMode,
                    runData,
                    sessionId,
                    startNodes,
                    workflowData,
                    userId: req.user.id,
                };
                const workflowRunner = new _1.WorkflowRunner();
                const executionId = yield workflowRunner.run(data);
                return {
                    executionId,
                };
            })));
            // Retrieves all tags, with or without usage count
            this.app.get(`/${this.restEndpoint}/tags`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                if (config_1.default.getEnv('workflowTagsDisabled')) {
                    throw new _1.ResponseHelper.ResponseError('Workflow tags are disabled');
                }
                if (req.query.withUsageCount === 'true') {
                    const tablePrefix = config_1.default.getEnv('database.tablePrefix');
                    return TagHelpers.getTagsWithCountDb(tablePrefix);
                }
                return _1.Db.collections.Tag.find({ select: ['id', 'name', 'createdAt', 'updatedAt'] });
            })));
            // Creates a tag
            this.app.post(`/${this.restEndpoint}/tags`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                if (config_1.default.getEnv('workflowTagsDisabled')) {
                    throw new _1.ResponseHelper.ResponseError('Workflow tags are disabled');
                }
                const newTag = new TagEntity_1.TagEntity();
                newTag.name = req.body.name.trim();
                yield this.externalHooks.run('tag.beforeCreate', [newTag]);
                yield (0, GenericHelpers_1.validateEntity)(newTag);
                const tag = yield _1.Db.collections.Tag.save(newTag);
                yield this.externalHooks.run('tag.afterCreate', [tag]);
                return tag;
            })));
            // Updates a tag
            this.app.patch(`/${this.restEndpoint}/tags/:id`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                if (config_1.default.getEnv('workflowTagsDisabled')) {
                    throw new _1.ResponseHelper.ResponseError('Workflow tags are disabled');
                }
                const { name } = req.body;
                const { id } = req.params;
                const newTag = new TagEntity_1.TagEntity();
                // @ts-ignore
                newTag.id = id;
                newTag.name = name.trim();
                yield this.externalHooks.run('tag.beforeUpdate', [newTag]);
                yield (0, GenericHelpers_1.validateEntity)(newTag);
                const tag = yield _1.Db.collections.Tag.save(newTag);
                yield this.externalHooks.run('tag.afterUpdate', [tag]);
                return tag;
            })));
            // Deletes a tag
            this.app.delete(`/${this.restEndpoint}/tags/:id`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                if (config_1.default.getEnv('workflowTagsDisabled')) {
                    throw new _1.ResponseHelper.ResponseError('Workflow tags are disabled');
                }
                if (config_1.default.getEnv('userManagement.isInstanceOwnerSetUp') === true &&
                    req.user.globalRole.name !== 'owner') {
                    throw new _1.ResponseHelper.ResponseError('You are not allowed to perform this action', undefined, 403, 'Only owners can remove tags');
                }
                const id = Number(req.params.id);
                yield this.externalHooks.run('tag.beforeDelete', [id]);
                yield _1.Db.collections.Tag.delete({ id });
                yield this.externalHooks.run('tag.afterDelete', [id]);
                return true;
            })));
            // Returns parameter values which normally get loaded from an external API or
            // get generated dynamically
            this.app.get(`/${this.restEndpoint}/node-parameter-options`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const nodeTypeAndVersion = JSON.parse(req.query.nodeTypeAndVersion);
                const { path, methodName } = req.query;
                const currentNodeParameters = JSON.parse(req.query.currentNodeParameters);
                let credentials;
                if (req.query.credentials) {
                    credentials = JSON.parse(req.query.credentials);
                }
                const loadDataInstance = new n8n_core_1.LoadNodeParameterOptions(nodeTypeAndVersion, (0, _1.NodeTypes)(), path, currentNodeParameters, credentials);
                const additionalData = yield _1.WorkflowExecuteAdditionalData.getBase(req.user.id, currentNodeParameters);
                if (methodName) {
                    return loadDataInstance.getOptionsViaMethodName(methodName, additionalData);
                }
                // @ts-ignore
                if (req.query.loadOptions) {
                    return loadDataInstance.getOptionsViaRequestProperty(
                    // @ts-ignore
                    JSON.parse(req.query.loadOptions), additionalData);
                }
                return [];
            })));
            // Returns all the node-types
            this.app.get(`/${this.restEndpoint}/node-types`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                const returnData = [];
                const onlyLatest = req.query.onlyLatest === 'true';
                const nodeTypes = (0, _1.NodeTypes)();
                const allNodes = nodeTypes.getAll();
                const getNodeDescription = (nodeType) => {
                    const nodeInfo = Object.assign({}, nodeType.description);
                    if (req.query.includeProperties !== 'true') {
                        // @ts-ignore
                        delete nodeInfo.properties;
                    }
                    return nodeInfo;
                };
                if (onlyLatest) {
                    allNodes.forEach((nodeData) => {
                        const nodeType = n8n_workflow_1.NodeHelpers.getVersionedNodeType(nodeData);
                        const nodeInfo = getNodeDescription(nodeType);
                        returnData.push(nodeInfo);
                    });
                }
                else {
                    allNodes.forEach((nodeData) => {
                        const allNodeTypes = n8n_workflow_1.NodeHelpers.getVersionedNodeTypeAll(nodeData);
                        allNodeTypes.forEach((element) => {
                            const nodeInfo = getNodeDescription(element);
                            returnData.push(nodeInfo);
                        });
                    });
                }
                return returnData;
            })));
            this.app.get(`/${this.restEndpoint}/credential-translation`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                const translationPath = (0, TranslationHelpers_1.getCredentialTranslationPath)({
                    locale: this.frontendSettings.defaultLocale,
                    credentialType: req.query.credentialType,
                });
                try {
                    return require(translationPath);
                }
                catch (error) {
                    return null;
                }
            })));
            // Returns node information based on node names and versions
            this.app.post(`/${this.restEndpoint}/node-types`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                const nodeInfos = lodash_1.default.get(req, 'body.nodeInfos', []);
                const { defaultLocale } = this.frontendSettings;
                if (defaultLocale === 'en') {
                    return nodeInfos.reduce((acc, { name, version }) => {
                        const { description } = (0, _1.NodeTypes)().getByNameAndVersion(name, version);
                        acc.push(injectCustomApiCallOption(description));
                        return acc;
                    }, []);
                }
                function populateTranslation(name, version, nodeTypes) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { description, sourcePath } = (0, _1.NodeTypes)().getWithSourcePath(name, version);
                        const translationPath = yield (0, TranslationHelpers_1.getNodeTranslationPath)({
                            nodeSourcePath: sourcePath,
                            longNodeType: description.name,
                            locale: defaultLocale,
                        });
                        try {
                            const translation = yield (0, promises_1.readFile)(translationPath, 'utf8');
                            description.translation = JSON.parse(translation);
                        }
                        catch (error) {
                            // ignore - no translation exists at path
                        }
                        nodeTypes.push(injectCustomApiCallOption(description));
                    });
                }
                const nodeTypes = [];
                const promises = nodeInfos.map(({ name, version }) => __awaiter(this, void 0, void 0, function* () { return populateTranslation(name, version, nodeTypes); }));
                yield Promise.all(promises);
                return nodeTypes;
            })));
            // Returns node information based on node names and versions
            this.app.get(`/${this.restEndpoint}/node-translation-headers`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                const packagesPath = (0, path_1.join)(__dirname, '..', '..', '..');
                const headersPath = (0, path_1.join)(packagesPath, 'nodes-base', 'dist', 'nodes', 'headers');
                try {
                    yield fs_1.promises.access(`${headersPath}.js`);
                }
                catch (_) {
                    return; // no headers available
                }
                try {
                    return require(headersPath);
                }
                catch (error) {
                    res.status(500).send('Failed to load headers file');
                }
            })));
            // ----------------------------------------
            // Node-Types
            // ----------------------------------------
            // Returns the node icon
            this.app.get([
                `/${this.restEndpoint}/node-icon/:nodeType`,
                `/${this.restEndpoint}/node-icon/:scope/:nodeType`,
            ], (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const nodeTypeName = `${req.params.scope ? `${req.params.scope}/` : ''}${req.params.nodeType}`;
                    const nodeTypes = (0, _1.NodeTypes)();
                    const nodeType = nodeTypes.getByNameAndVersion(nodeTypeName);
                    if (nodeType === undefined) {
                        res.status(404).send('The nodeType is not known.');
                        return;
                    }
                    if (nodeType.description.icon === undefined) {
                        res.status(404).send('No icon found for node.');
                        return;
                    }
                    if (!nodeType.description.icon.startsWith('file:')) {
                        res.status(404).send('Node does not have a file icon.');
                        return;
                    }
                    const filepath = nodeType.description.icon.substr(5);
                    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
                    res.setHeader('Cache-control', `private max-age=${maxAge}`);
                    res.sendFile(filepath);
                }
                catch (error) {
                    // Error response
                    return _1.ResponseHelper.sendErrorResponse(res, error);
                }
            }));
            // ----------------------------------------
            // Active Workflows
            // ----------------------------------------
            // Returns the active workflow ids
            this.app.get(`/${this.restEndpoint}/active`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const activeWorkflows = yield this.activeWorkflowRunner.getActiveWorkflows(req.user);
                return activeWorkflows.map(({ id }) => id.toString());
            })));
            // Returns if the workflow with the given id had any activation errors
            this.app.get(`/${this.restEndpoint}/active/error/:id`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const { id: workflowId } = req.params;
                const shared = yield _1.Db.collections.SharedWorkflow.findOne({
                    relations: ['workflow'],
                    where: (0, WorkflowHelpers_1.whereClause)({
                        user: req.user,
                        entityType: 'workflow',
                        entityId: workflowId,
                    }),
                });
                if (!shared) {
                    n8n_workflow_1.LoggerProxy.info('User attempted to access workflow errors without permissions', {
                        workflowId,
                        userId: req.user.id,
                    });
                    throw new _1.ResponseHelper.ResponseError(`Workflow with ID "${workflowId}" could not be found.`, undefined, 400);
                }
                return this.activeWorkflowRunner.getActivationError(workflowId);
            })));
            // ----------------------------------------
            // Credential-Types
            // ----------------------------------------
            // Returns all the credential types which are defined in the loaded n8n-modules
            this.app.get(`/${this.restEndpoint}/credential-types`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                const returnData = [];
                const credentialTypes = (0, _1.CredentialTypes)();
                credentialTypes.getAll().forEach((credentialData) => {
                    returnData.push(credentialData);
                });
                return returnData;
            })));
            this.app.get(`/${this.restEndpoint}/credential-icon/:credentialType`, (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const credentialName = req.params.credentialType;
                    const credentialType = (0, _1.CredentialTypes)().getByName(credentialName);
                    if (credentialType === undefined) {
                        res.status(404).send('The credentialType is not known.');
                        return;
                    }
                    if (credentialType.icon === undefined) {
                        res.status(404).send('No icon found for credential.');
                        return;
                    }
                    if (!credentialType.icon.startsWith('file:')) {
                        res.status(404).send('Credential does not have a file icon.');
                        return;
                    }
                    const filepath = credentialType.icon.substr(5);
                    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
                    res.setHeader('Cache-control', `private max-age=${maxAge}`);
                    res.sendFile(filepath);
                }
                catch (error) {
                    // Error response
                    return _1.ResponseHelper.sendErrorResponse(res, error);
                }
            }));
            // ----------------------------------------
            // OAuth1-Credential/Auth
            // ----------------------------------------
            // Authorize OAuth Data
            this.app.get(`/${this.restEndpoint}/oauth1-credential/auth`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const { id: credentialId } = req.query;
                if (!credentialId) {
                    n8n_workflow_1.LoggerProxy.error('OAuth1 credential authorization failed due to missing credential ID');
                    throw new _1.ResponseHelper.ResponseError('Required credential ID is missing', undefined, 400);
                }
                const credential = yield (0, _1.getCredentialForUser)(credentialId, req.user);
                if (!credential) {
                    n8n_workflow_1.LoggerProxy.error('OAuth1 credential authorization failed because the current user does not have the correct permissions', { userId: req.user.id });
                    throw new _1.ResponseHelper.ResponseError(constants_1.RESPONSE_ERROR_MESSAGES.NO_CREDENTIAL, undefined, 404);
                }
                let encryptionKey;
                try {
                    encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
                }
                catch (error) {
                    throw new _1.ResponseHelper.ResponseError(error.message, undefined, 500);
                }
                const mode = 'internal';
                const timezone = config_1.default.getEnv('generic.timezone');
                const credentialsHelper = new _1.CredentialsHelper(encryptionKey);
                const decryptedDataOriginal = yield credentialsHelper.getDecrypted(credential, credential.type, mode, timezone, true);
                const oauthCredentials = credentialsHelper.applyDefaultsAndOverwrites(decryptedDataOriginal, credential.type, mode, timezone);
                const signatureMethod = lodash_1.default.get(oauthCredentials, 'signatureMethod');
                const oAuthOptions = {
                    consumer: {
                        key: lodash_1.default.get(oauthCredentials, 'consumerKey'),
                        secret: lodash_1.default.get(oauthCredentials, 'consumerSecret'),
                    },
                    signature_method: signatureMethod,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    hash_function(base, key) {
                        const algorithm = signatureMethod === 'HMAC-SHA1' ? 'sha1' : 'sha256';
                        return (0, crypto_1.createHmac)(algorithm, key).update(base).digest('base64');
                    },
                };
                const oauthRequestData = {
                    oauth_callback: `${_1.WebhookHelpers.getWebhookBaseUrl()}${this.restEndpoint}/oauth1-credential/callback?cid=${credentialId}`,
                };
                yield this.externalHooks.run('oauth1.authenticate', [oAuthOptions, oauthRequestData]);
                // eslint-disable-next-line new-cap
                const oauth = new oauth_1_0a_1.default(oAuthOptions);
                const options = {
                    method: 'POST',
                    url: lodash_1.default.get(oauthCredentials, 'requestTokenUrl'),
                    data: oauthRequestData,
                };
                const data = oauth.toHeader(oauth.authorize(options));
                // @ts-ignore
                options.headers = data;
                const response = yield (0, request_promise_native_1.default)(options);
                // Response comes as x-www-form-urlencoded string so convert it to JSON
                const responseJson = querystring_1.default.parse(response);
                const returnUri = `${lodash_1.default.get(oauthCredentials, 'authUrl')}?oauth_token=${responseJson.oauth_token}`;
                // Encrypt the data
                const credentials = new n8n_core_1.Credentials(credential, credential.type, credential.nodesAccess);
                credentials.setData(decryptedDataOriginal, encryptionKey);
                const newCredentialsData = credentials.getDataToSave();
                // Add special database related data
                newCredentialsData.updatedAt = this.getCurrentDate();
                // Update the credentials in DB
                yield _1.Db.collections.Credentials.update(credentialId, newCredentialsData);
                n8n_workflow_1.LoggerProxy.verbose('OAuth1 authorization successful for new credential', {
                    userId: req.user.id,
                    credentialId,
                });
                return returnUri;
            })));
            // Verify and store app code. Generate access tokens and store for respective credential.
            this.app.get(`/${this.restEndpoint}/oauth1-credential/callback`, (req, res) => __awaiter(this, void 0, void 0, function* () {
                var _g, _h, _j, _k, _l;
                try {
                    const { oauth_verifier, oauth_token, cid: credentialId } = req.query;
                    if (!oauth_verifier || !oauth_token) {
                        const errorResponse = new _1.ResponseHelper.ResponseError(`Insufficient parameters for OAuth1 callback. Received following query parameters: ${JSON.stringify(req.query)}`, undefined, 503);
                        n8n_workflow_1.LoggerProxy.error('OAuth1 callback failed because of insufficient parameters received', {
                            userId: (_g = req.user) === null || _g === void 0 ? void 0 : _g.id,
                            credentialId,
                        });
                        return _1.ResponseHelper.sendErrorResponse(res, errorResponse);
                    }
                    const credential = yield (0, _1.getCredentialWithoutUser)(credentialId);
                    if (!credential) {
                        n8n_workflow_1.LoggerProxy.error('OAuth1 callback failed because of insufficient user permissions', {
                            userId: (_h = req.user) === null || _h === void 0 ? void 0 : _h.id,
                            credentialId,
                        });
                        const errorResponse = new _1.ResponseHelper.ResponseError(constants_1.RESPONSE_ERROR_MESSAGES.NO_CREDENTIAL, undefined, 404);
                        return _1.ResponseHelper.sendErrorResponse(res, errorResponse);
                    }
                    let encryptionKey;
                    try {
                        encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
                    }
                    catch (error) {
                        throw new _1.ResponseHelper.ResponseError(error.message, undefined, 500);
                    }
                    const mode = 'internal';
                    const timezone = config_1.default.getEnv('generic.timezone');
                    const credentialsHelper = new _1.CredentialsHelper(encryptionKey);
                    const decryptedDataOriginal = yield credentialsHelper.getDecrypted(credential, credential.type, mode, timezone, true);
                    const oauthCredentials = credentialsHelper.applyDefaultsAndOverwrites(decryptedDataOriginal, credential.type, mode, timezone);
                    const options = {
                        method: 'POST',
                        url: lodash_1.default.get(oauthCredentials, 'accessTokenUrl'),
                        qs: {
                            oauth_token,
                            oauth_verifier,
                        },
                    };
                    let oauthToken;
                    try {
                        oauthToken = yield (0, request_promise_native_1.default)(options);
                    }
                    catch (error) {
                        n8n_workflow_1.LoggerProxy.error('Unable to fetch tokens for OAuth1 callback', {
                            userId: (_j = req.user) === null || _j === void 0 ? void 0 : _j.id,
                            credentialId,
                        });
                        const errorResponse = new _1.ResponseHelper.ResponseError('Unable to get access tokens!', undefined, 404);
                        return _1.ResponseHelper.sendErrorResponse(res, errorResponse);
                    }
                    // Response comes as x-www-form-urlencoded string so convert it to JSON
                    const oauthTokenJson = querystring_1.default.parse(oauthToken);
                    decryptedDataOriginal.oauthTokenData = oauthTokenJson;
                    const credentials = new n8n_core_1.Credentials(credential, credential.type, credential.nodesAccess);
                    credentials.setData(decryptedDataOriginal, encryptionKey);
                    const newCredentialsData = credentials.getDataToSave();
                    // Add special database related data
                    newCredentialsData.updatedAt = this.getCurrentDate();
                    // Save the credentials in DB
                    yield _1.Db.collections.Credentials.update(credentialId, newCredentialsData);
                    n8n_workflow_1.LoggerProxy.verbose('OAuth1 callback successful for new credential', {
                        userId: (_k = req.user) === null || _k === void 0 ? void 0 : _k.id,
                        credentialId,
                    });
                    res.sendFile((0, path_1.resolve)(__dirname, '../../templates/oauth-callback.html'));
                }
                catch (error) {
                    n8n_workflow_1.LoggerProxy.error('OAuth1 callback failed because of insufficient user permissions', {
                        userId: (_l = req.user) === null || _l === void 0 ? void 0 : _l.id,
                        credentialId: req.query.cid,
                    });
                    // Error response
                    return _1.ResponseHelper.sendErrorResponse(res, error);
                }
            }));
            // ----------------------------------------
            // OAuth2-Credential/Auth
            // ----------------------------------------
            // Authorize OAuth Data
            this.app.get(`/${this.restEndpoint}/oauth2-credential/auth`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const { id: credentialId } = req.query;
                if (!credentialId) {
                    throw new _1.ResponseHelper.ResponseError('Required credential ID is missing', undefined, 400);
                }
                const credential = yield (0, _1.getCredentialForUser)(credentialId, req.user);
                if (!credential) {
                    n8n_workflow_1.LoggerProxy.error('Failed to authorize OAuth2 due to lack of permissions', {
                        userId: req.user.id,
                        credentialId,
                    });
                    throw new _1.ResponseHelper.ResponseError(constants_1.RESPONSE_ERROR_MESSAGES.NO_CREDENTIAL, undefined, 404);
                }
                let encryptionKey;
                try {
                    encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
                }
                catch (error) {
                    throw new _1.ResponseHelper.ResponseError(error.message, undefined, 500);
                }
                const mode = 'internal';
                const timezone = config_1.default.getEnv('generic.timezone');
                const credentialsHelper = new _1.CredentialsHelper(encryptionKey);
                const decryptedDataOriginal = yield credentialsHelper.getDecrypted(credential, credential.type, mode, timezone, true);
                const oauthCredentials = credentialsHelper.applyDefaultsAndOverwrites(decryptedDataOriginal, credential.type, mode, timezone);
                const token = new csrf_1.default();
                // Generate a CSRF prevention token and send it as a OAuth2 state stringma/ERR
                const csrfSecret = token.secretSync();
                const state = {
                    token: token.create(csrfSecret),
                    cid: req.query.id,
                };
                const stateEncodedStr = Buffer.from(JSON.stringify(state)).toString('base64');
                const oAuthOptions = {
                    clientId: lodash_1.default.get(oauthCredentials, 'clientId'),
                    clientSecret: lodash_1.default.get(oauthCredentials, 'clientSecret', ''),
                    accessTokenUri: lodash_1.default.get(oauthCredentials, 'accessTokenUrl', ''),
                    authorizationUri: lodash_1.default.get(oauthCredentials, 'authUrl', ''),
                    redirectUri: `${_1.WebhookHelpers.getWebhookBaseUrl()}${this.restEndpoint}/oauth2-credential/callback`,
                    scopes: lodash_1.default.split(lodash_1.default.get(oauthCredentials, 'scope', 'openid,'), ','),
                    state: stateEncodedStr,
                };
                yield this.externalHooks.run('oauth2.authenticate', [oAuthOptions]);
                const oAuthObj = new client_oauth2_1.default(oAuthOptions);
                // Encrypt the data
                const credentials = new n8n_core_1.Credentials(credential, credential.type, credential.nodesAccess);
                decryptedDataOriginal.csrfSecret = csrfSecret;
                credentials.setData(decryptedDataOriginal, encryptionKey);
                const newCredentialsData = credentials.getDataToSave();
                // Add special database related data
                newCredentialsData.updatedAt = this.getCurrentDate();
                // Update the credentials in DB
                yield _1.Db.collections.Credentials.update(req.query.id, newCredentialsData);
                const authQueryParameters = lodash_1.default.get(oauthCredentials, 'authQueryParameters', '');
                let returnUri = oAuthObj.code.getUri();
                // if scope uses comma, change it as the library always return then with spaces
                if (lodash_1.default.get(oauthCredentials, 'scope').includes(',')) {
                    const data = querystring_1.default.parse(returnUri.split('?')[1]);
                    data.scope = lodash_1.default.get(oauthCredentials, 'scope');
                    returnUri = `${lodash_1.default.get(oauthCredentials, 'authUrl', '')}?${querystring_1.default.stringify(data)}`;
                }
                if (authQueryParameters) {
                    returnUri += `&${authQueryParameters}`;
                }
                n8n_workflow_1.LoggerProxy.verbose('OAuth2 authentication successful for new credential', {
                    userId: req.user.id,
                    credentialId,
                });
                return returnUri;
            })));
            // ----------------------------------------
            // OAuth2-Credential/Callback
            // ----------------------------------------
            // Verify and store app code. Generate access tokens and store for respective credential.
            this.app.get(`/${this.restEndpoint}/oauth2-credential/callback`, (req, res) => __awaiter(this, void 0, void 0, function* () {
                var _m, _o, _p, _q;
                try {
                    // realmId it's currently just use for the quickbook OAuth2 flow
                    const { code, state: stateEncoded } = req.query;
                    if (!code || !stateEncoded) {
                        const errorResponse = new _1.ResponseHelper.ResponseError(`Insufficient parameters for OAuth2 callback. Received following query parameters: ${JSON.stringify(req.query)}`, undefined, 503);
                        return _1.ResponseHelper.sendErrorResponse(res, errorResponse);
                    }
                    let state;
                    try {
                        state = JSON.parse(Buffer.from(stateEncoded, 'base64').toString());
                    }
                    catch (error) {
                        const errorResponse = new _1.ResponseHelper.ResponseError('Invalid state format returned', undefined, 503);
                        return _1.ResponseHelper.sendErrorResponse(res, errorResponse);
                    }
                    const credential = yield (0, _1.getCredentialWithoutUser)(state.cid);
                    if (!credential) {
                        n8n_workflow_1.LoggerProxy.error('OAuth2 callback failed because of insufficient permissions', {
                            userId: (_m = req.user) === null || _m === void 0 ? void 0 : _m.id,
                            credentialId: state.cid,
                        });
                        const errorResponse = new _1.ResponseHelper.ResponseError(constants_1.RESPONSE_ERROR_MESSAGES.NO_CREDENTIAL, undefined, 404);
                        return _1.ResponseHelper.sendErrorResponse(res, errorResponse);
                    }
                    let encryptionKey;
                    try {
                        encryptionKey = yield n8n_core_1.UserSettings.getEncryptionKey();
                    }
                    catch (error) {
                        throw new _1.ResponseHelper.ResponseError(error.message, undefined, 500);
                    }
                    const mode = 'internal';
                    const timezone = config_1.default.getEnv('generic.timezone');
                    const credentialsHelper = new _1.CredentialsHelper(encryptionKey);
                    const decryptedDataOriginal = yield credentialsHelper.getDecrypted(credential, credential.type, mode, timezone, true);
                    const oauthCredentials = credentialsHelper.applyDefaultsAndOverwrites(decryptedDataOriginal, credential.type, mode, timezone);
                    const token = new csrf_1.default();
                    if (decryptedDataOriginal.csrfSecret === undefined ||
                        !token.verify(decryptedDataOriginal.csrfSecret, state.token)) {
                        n8n_workflow_1.LoggerProxy.debug('OAuth2 callback state is invalid', {
                            userId: (_o = req.user) === null || _o === void 0 ? void 0 : _o.id,
                            credentialId: state.cid,
                        });
                        const errorResponse = new _1.ResponseHelper.ResponseError('The OAuth2 callback state is invalid!', undefined, 404);
                        return _1.ResponseHelper.sendErrorResponse(res, errorResponse);
                    }
                    let options = {};
                    const oAuth2Parameters = {
                        clientId: lodash_1.default.get(oauthCredentials, 'clientId'),
                        clientSecret: lodash_1.default.get(oauthCredentials, 'clientSecret', ''),
                        accessTokenUri: lodash_1.default.get(oauthCredentials, 'accessTokenUrl', ''),
                        authorizationUri: lodash_1.default.get(oauthCredentials, 'authUrl', ''),
                        redirectUri: `${_1.WebhookHelpers.getWebhookBaseUrl()}${this.restEndpoint}/oauth2-credential/callback`,
                        scopes: lodash_1.default.split(lodash_1.default.get(oauthCredentials, 'scope', 'openid,'), ','),
                    };
                    if (lodash_1.default.get(oauthCredentials, 'authentication', 'header') === 'body') {
                        options = {
                            body: {
                                client_id: lodash_1.default.get(oauthCredentials, 'clientId'),
                                client_secret: lodash_1.default.get(oauthCredentials, 'clientSecret', ''),
                            },
                        };
                        delete oAuth2Parameters.clientSecret;
                    }
                    yield this.externalHooks.run('oauth2.callback', [oAuth2Parameters]);
                    const oAuthObj = new client_oauth2_1.default(oAuth2Parameters);
                    const queryParameters = req.originalUrl.split('?').splice(1, 1).join('');
                    const oauthToken = yield oAuthObj.code.getToken(`${oAuth2Parameters.redirectUri}?${queryParameters}`, options);
                    if (Object.keys(req.query).length > 2) {
                        lodash_1.default.set(oauthToken.data, 'callbackQueryString', lodash_1.default.omit(req.query, 'state', 'code'));
                    }
                    if (oauthToken === undefined) {
                        n8n_workflow_1.LoggerProxy.error('OAuth2 callback failed: unable to get access tokens', {
                            userId: (_p = req.user) === null || _p === void 0 ? void 0 : _p.id,
                            credentialId: state.cid,
                        });
                        const errorResponse = new _1.ResponseHelper.ResponseError('Unable to get access tokens!', undefined, 404);
                        return _1.ResponseHelper.sendErrorResponse(res, errorResponse);
                    }
                    if (decryptedDataOriginal.oauthTokenData) {
                        // Only overwrite supplied data as some providers do for example just return the
                        // refresh_token on the very first request and not on subsequent ones.
                        Object.assign(decryptedDataOriginal.oauthTokenData, oauthToken.data);
                    }
                    else {
                        // No data exists so simply set
                        decryptedDataOriginal.oauthTokenData = oauthToken.data;
                    }
                    lodash_1.default.unset(decryptedDataOriginal, 'csrfSecret');
                    const credentials = new n8n_core_1.Credentials(credential, credential.type, credential.nodesAccess);
                    credentials.setData(decryptedDataOriginal, encryptionKey);
                    const newCredentialsData = credentials.getDataToSave();
                    // Add special database related data
                    newCredentialsData.updatedAt = this.getCurrentDate();
                    // Save the credentials in DB
                    yield _1.Db.collections.Credentials.update(state.cid, newCredentialsData);
                    n8n_workflow_1.LoggerProxy.verbose('OAuth2 callback successful for new credential', {
                        userId: (_q = req.user) === null || _q === void 0 ? void 0 : _q.id,
                        credentialId: state.cid,
                    });
                    res.sendFile((0, path_1.resolve)(__dirname, '../../templates/oauth-callback.html'));
                }
                catch (error) {
                    // Error response
                    return _1.ResponseHelper.sendErrorResponse(res, error);
                }
            }));
            // ----------------------------------------
            // Executions
            // ----------------------------------------
            // Returns all finished executions
            this.app.get(`/${this.restEndpoint}/executions`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
                const limit = req.query.limit
                    ? parseInt(req.query.limit, 10)
                    : GenericHelpers_1.DEFAULT_EXECUTIONS_GET_ALL_LIMIT;
                const executingWorkflowIds = [];
                if (config_1.default.getEnv('executions.mode') === 'queue') {
                    const currentJobs = yield Queue.getInstance().getJobs(['active', 'waiting']);
                    executingWorkflowIds.push(...currentJobs.map(({ data }) => data.executionId));
                }
                // We may have manual executions even with queue so we must account for these.
                executingWorkflowIds.push(...this.activeExecutionsInstance.getActiveExecutions().map(({ id }) => id));
                const countFilter = (0, lodash_1.cloneDeep)(filter);
                countFilter.waitTill && (countFilter.waitTill = (0, typeorm_1.Not)((0, typeorm_1.IsNull)()));
                countFilter.id = (0, typeorm_1.Not)((0, typeorm_1.In)(executingWorkflowIds));
                const sharedWorkflowIds = yield (0, WorkflowHelpers_1.getSharedWorkflowIds)(req.user);
                const findOptions = {
                    select: [
                        'id',
                        'finished',
                        'mode',
                        'retryOf',
                        'retrySuccessId',
                        'waitTill',
                        'startedAt',
                        'stoppedAt',
                        'workflowData',
                    ],
                    where: { workflowId: (0, typeorm_1.In)(sharedWorkflowIds) },
                    order: { id: 'DESC' },
                    take: limit,
                };
                Object.entries(filter).forEach(([key, value]) => {
                    let filterToAdd = {};
                    if (key === 'waitTill') {
                        filterToAdd = { waitTill: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) };
                    }
                    else if (key === 'finished' && value === false) {
                        filterToAdd = { finished: false, waitTill: (0, typeorm_1.IsNull)() };
                    }
                    else {
                        filterToAdd = { [key]: value };
                    }
                    Object.assign(findOptions.where, filterToAdd);
                });
                const rangeQuery = [];
                const rangeQueryParams = {};
                if (req.query.lastId) {
                    rangeQuery.push('id < :lastId');
                    rangeQueryParams.lastId = req.query.lastId;
                }
                if (req.query.firstId) {
                    rangeQuery.push('id > :firstId');
                    rangeQueryParams.firstId = req.query.firstId;
                }
                if (executingWorkflowIds.length > 0) {
                    rangeQuery.push(`id NOT IN (:...executingWorkflowIds)`);
                    rangeQueryParams.executingWorkflowIds = executingWorkflowIds;
                }
                if (rangeQuery.length) {
                    Object.assign(findOptions.where, {
                        id: (0, typeorm_1.Raw)(() => rangeQuery.join(' and '), rangeQueryParams),
                    });
                }
                const executions = yield _1.Db.collections.Execution.find(findOptions);
                const { count, estimated } = yield getExecutionsCount(countFilter, req.user);
                const formattedExecutions = executions.map((execution) => {
                    var _a, _b, _c, _d, _e;
                    return {
                        id: execution.id.toString(),
                        finished: execution.finished,
                        mode: execution.mode,
                        retryOf: (_a = execution.retryOf) === null || _a === void 0 ? void 0 : _a.toString(),
                        retrySuccessId: (_b = execution === null || execution === void 0 ? void 0 : execution.retrySuccessId) === null || _b === void 0 ? void 0 : _b.toString(),
                        waitTill: execution.waitTill,
                        startedAt: execution.startedAt,
                        stoppedAt: execution.stoppedAt,
                        workflowId: (_e = (_d = (_c = execution.workflowData) === null || _c === void 0 ? void 0 : _c.id) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : '',
                        workflowName: execution.workflowData.name,
                    };
                });
                return {
                    count,
                    results: formattedExecutions,
                    estimated,
                };
            })));
            // Returns a specific execution
            this.app.get(`/${this.restEndpoint}/executions/:id`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const { id: executionId } = req.params;
                const sharedWorkflowIds = yield (0, WorkflowHelpers_1.getSharedWorkflowIds)(req.user);
                if (!sharedWorkflowIds.length)
                    return undefined;
                const execution = yield _1.Db.collections.Execution.findOne({
                    where: {
                        id: executionId,
                        workflowId: (0, typeorm_1.In)(sharedWorkflowIds),
                    },
                });
                if (!execution) {
                    n8n_workflow_1.LoggerProxy.info('Attempt to read execution was blocked due to insufficient permissions', {
                        userId: req.user.id,
                        executionId,
                    });
                    return undefined;
                }
                if (req.query.unflattedResponse === 'true') {
                    return _1.ResponseHelper.unflattenExecutionData(execution);
                }
                const { id } = execution, rest = __rest(execution, ["id"]);
                // @ts-ignore
                return Object.assign({ id: id.toString() }, rest);
            })));
            // Retries a failed execution
            this.app.post(`/${this.restEndpoint}/executions/:id/retry`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const { id: executionId } = req.params;
                const sharedWorkflowIds = yield (0, WorkflowHelpers_1.getSharedWorkflowIds)(req.user);
                if (!sharedWorkflowIds.length)
                    return false;
                const execution = yield _1.Db.collections.Execution.findOne({
                    where: {
                        id: executionId,
                        workflowId: (0, typeorm_1.In)(sharedWorkflowIds),
                    },
                });
                if (!execution) {
                    n8n_workflow_1.LoggerProxy.info('Attempt to retry an execution was blocked due to insufficient permissions', {
                        userId: req.user.id,
                        executionId,
                    });
                    throw new _1.ResponseHelper.ResponseError(`The execution with the ID "${executionId}" does not exist.`, 404, 404);
                }
                const fullExecutionData = _1.ResponseHelper.unflattenExecutionData(execution);
                if (fullExecutionData.finished) {
                    throw new Error('The execution succeeded, so it cannot be retried.');
                }
                const executionMode = 'retry';
                fullExecutionData.workflowData.active = false;
                // Start the workflow
                const data = {
                    executionMode,
                    executionData: fullExecutionData.data,
                    retryOf: req.params.id,
                    workflowData: fullExecutionData.workflowData,
                    userId: req.user.id,
                };
                const { lastNodeExecuted } = data.executionData.resultData;
                if (lastNodeExecuted) {
                    // Remove the old error and the data of the last run of the node that it can be replaced
                    delete data.executionData.resultData.error;
                    const { length } = data.executionData.resultData.runData[lastNodeExecuted];
                    if (length > 0 &&
                        data.executionData.resultData.runData[lastNodeExecuted][length - 1].error !== undefined) {
                        // Remove results only if it is an error.
                        // If we are retrying due to a crash, the information is simply success info from last node
                        data.executionData.resultData.runData[lastNodeExecuted].pop();
                        // Stack will determine what to run next
                    }
                }
                if (req.body.loadWorkflow) {
                    // Loads the currently saved workflow to execute instead of the
                    // one saved at the time of the execution.
                    const workflowId = fullExecutionData.workflowData.id;
                    const workflowData = (yield _1.Db.collections.Workflow.findOne(workflowId));
                    if (workflowData === undefined) {
                        throw new Error(`The workflow with the ID "${workflowId}" could not be found and so the data not be loaded for the retry.`);
                    }
                    data.workflowData = workflowData;
                    const nodeTypes = (0, _1.NodeTypes)();
                    const workflowInstance = new n8n_workflow_1.Workflow({
                        id: workflowData.id,
                        name: workflowData.name,
                        nodes: workflowData.nodes,
                        connections: workflowData.connections,
                        active: false,
                        nodeTypes,
                        staticData: undefined,
                        settings: workflowData.settings,
                    });
                    // Replace all of the nodes in the execution stack with the ones of the new workflow
                    for (const stack of data.executionData.executionData.nodeExecutionStack) {
                        // Find the data of the last executed node in the new workflow
                        const node = workflowInstance.getNode(stack.node.name);
                        if (node === null) {
                            n8n_workflow_1.LoggerProxy.error('Failed to retry an execution because a node could not be found', {
                                userId: req.user.id,
                                executionId,
                                nodeName: stack.node.name,
                            });
                            throw new Error(`Could not find the node "${stack.node.name}" in workflow. It probably got deleted or renamed. Without it the workflow can sadly not be retried.`);
                        }
                        // Replace the node data in the stack that it really uses the current data
                        stack.node = node;
                    }
                }
                const workflowRunner = new _1.WorkflowRunner();
                const retriedExecutionId = yield workflowRunner.run(data);
                const executionData = yield this.activeExecutionsInstance.getPostExecutePromise(retriedExecutionId);
                if (!executionData) {
                    throw new Error('The retry did not start for an unknown reason.');
                }
                return !!executionData.finished;
            })));
            // Delete Executions
            // INFORMATION: We use POST instead of DELETE to not run into any issues
            // with the query data getting to long
            this.app.post(`/${this.restEndpoint}/executions/delete`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const { deleteBefore, ids, filters: requestFilters } = req.body;
                if (!deleteBefore && !ids) {
                    throw new Error('Either "deleteBefore" or "ids" must be present in the request body');
                }
                const sharedWorkflowIds = yield (0, WorkflowHelpers_1.getSharedWorkflowIds)(req.user);
                const binaryDataManager = n8n_core_1.BinaryDataManager.getInstance();
                // delete executions by date, if user may access the underyling worfklows
                if (deleteBefore) {
                    const filters = {
                        startedAt: (0, typeorm_1.LessThanOrEqual)(deleteBefore),
                    };
                    if (filters) {
                        Object.assign(filters, requestFilters);
                    }
                    const executions = yield _1.Db.collections.Execution.find({
                        where: Object.assign({ workflowId: (0, typeorm_1.In)(sharedWorkflowIds) }, filters),
                    });
                    if (!executions.length)
                        return;
                    const idsToDelete = executions.map(({ id }) => id.toString());
                    yield Promise.all(idsToDelete.map((id) => __awaiter(this, void 0, void 0, function* () { return binaryDataManager.deleteBinaryDataByExecutionId(id); })));
                    yield _1.Db.collections.Execution.delete({ id: (0, typeorm_1.In)(idsToDelete) });
                    return;
                }
                // delete executions by IDs, if user may access the underyling worfklows
                if (ids) {
                    const executions = yield _1.Db.collections.Execution.find({
                        where: {
                            id: (0, typeorm_1.In)(ids),
                            workflowId: (0, typeorm_1.In)(sharedWorkflowIds),
                        },
                    });
                    if (!executions.length) {
                        n8n_workflow_1.LoggerProxy.error('Failed to delete an execution due to insufficient permissions', {
                            userId: req.user.id,
                            executionIds: ids,
                        });
                        return;
                    }
                    const idsToDelete = executions.map(({ id }) => id.toString());
                    yield Promise.all(idsToDelete.map((id) => __awaiter(this, void 0, void 0, function* () { return binaryDataManager.deleteBinaryDataByExecutionId(id); })));
                    yield _1.Db.collections.Execution.delete(idsToDelete);
                }
            })));
            // ----------------------------------------
            // Executing Workflows
            // ----------------------------------------
            // Returns all the currently working executions
            this.app.get(`/${this.restEndpoint}/executions-current`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                if (config_1.default.getEnv('executions.mode') === 'queue') {
                    const currentJobs = yield Queue.getInstance().getJobs(['active', 'waiting']);
                    const currentlyRunningQueueIds = currentJobs.map((job) => job.data.executionId);
                    const currentlyRunningManualExecutions = this.activeExecutionsInstance.getActiveExecutions();
                    const manualExecutionIds = currentlyRunningManualExecutions.map((execution) => execution.id);
                    const currentlyRunningExecutionIds = currentlyRunningQueueIds.concat(manualExecutionIds);
                    if (!currentlyRunningExecutionIds.length)
                        return [];
                    const findOptions = {
                        select: ['id', 'workflowId', 'mode', 'retryOf', 'startedAt'],
                        order: { id: 'DESC' },
                        where: {
                            id: (0, typeorm_1.In)(currentlyRunningExecutionIds),
                        },
                    };
                    const sharedWorkflowIds = yield (0, WorkflowHelpers_1.getSharedWorkflowIds)(req.user);
                    if (!sharedWorkflowIds.length)
                        return [];
                    if (req.query.filter) {
                        const { workflowId } = JSON.parse(req.query.filter);
                        if (workflowId && sharedWorkflowIds.includes(workflowId)) {
                            Object.assign(findOptions.where, { workflowId });
                        }
                    }
                    else {
                        Object.assign(findOptions.where, { workflowId: (0, typeorm_1.In)(sharedWorkflowIds) });
                    }
                    const executions = yield _1.Db.collections.Execution.find(findOptions);
                    if (!executions.length)
                        return [];
                    return executions.map((execution) => {
                        return {
                            id: execution.id,
                            workflowId: execution.workflowId,
                            mode: execution.mode,
                            retryOf: execution.retryOf !== null ? execution.retryOf : undefined,
                            startedAt: new Date(execution.startedAt),
                        };
                    });
                }
                const executingWorkflows = this.activeExecutionsInstance.getActiveExecutions();
                const returnData = [];
                const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
                const sharedWorkflowIds = yield (0, WorkflowHelpers_1.getSharedWorkflowIds)(req.user).then((ids) => ids.map((id) => id.toString()));
                for (const data of executingWorkflows) {
                    if ((filter.workflowId !== undefined && filter.workflowId !== data.workflowId) ||
                        (data.workflowId !== undefined &&
                            !sharedWorkflowIds.includes(data.workflowId.toString()))) {
                        continue;
                    }
                    returnData.push({
                        id: data.id.toString(),
                        workflowId: data.workflowId === undefined ? '' : data.workflowId.toString(),
                        mode: data.mode,
                        retryOf: data.retryOf,
                        startedAt: new Date(data.startedAt),
                    });
                }
                returnData.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10));
                return returnData;
            })));
            // Forces the execution to stop
            this.app.post(`/${this.restEndpoint}/executions-current/:id/stop`, _1.ResponseHelper.send((req) => __awaiter(this, void 0, void 0, function* () {
                const { id: executionId } = req.params;
                const sharedWorkflowIds = yield (0, WorkflowHelpers_1.getSharedWorkflowIds)(req.user);
                if (!sharedWorkflowIds.length) {
                    throw new _1.ResponseHelper.ResponseError('Execution not found', undefined, 404);
                }
                const execution = yield _1.Db.collections.Execution.findOne({
                    where: {
                        id: executionId,
                        workflowId: (0, typeorm_1.In)(sharedWorkflowIds),
                    },
                });
                if (!execution) {
                    throw new _1.ResponseHelper.ResponseError('Execution not found', undefined, 404);
                }
                if (config_1.default.getEnv('executions.mode') === 'queue') {
                    // Manual executions should still be stoppable, so
                    // try notifying the `activeExecutions` to stop it.
                    const result = yield this.activeExecutionsInstance.stopExecution(req.params.id);
                    if (result === undefined) {
                        // If active execution could not be found check if it is a waiting one
                        try {
                            return yield this.waitTracker.stopExecution(req.params.id);
                        }
                        catch (error) {
                            // Ignore, if it errors as then it is probably a currently running
                            // execution
                        }
                    }
                    else {
                        return {
                            mode: result.mode,
                            startedAt: new Date(result.startedAt),
                            stoppedAt: result.stoppedAt ? new Date(result.stoppedAt) : undefined,
                            finished: result.finished,
                        };
                    }
                    const currentJobs = yield Queue.getInstance().getJobs(['active', 'waiting']);
                    const job = currentJobs.find((job) => job.data.executionId.toString() === req.params.id);
                    if (!job) {
                        throw new Error(`Could not stop "${req.params.id}" as it is no longer in queue.`);
                    }
                    else {
                        yield Queue.getInstance().stopJob(job);
                    }
                    const executionDb = (yield _1.Db.collections.Execution.findOne(req.params.id));
                    const fullExecutionData = _1.ResponseHelper.unflattenExecutionData(executionDb);
                    const returnData = {
                        mode: fullExecutionData.mode,
                        startedAt: new Date(fullExecutionData.startedAt),
                        stoppedAt: fullExecutionData.stoppedAt
                            ? new Date(fullExecutionData.stoppedAt)
                            : undefined,
                        finished: fullExecutionData.finished,
                    };
                    return returnData;
                }
                // Stop the execution and wait till it is done and we got the data
                const result = yield this.activeExecutionsInstance.stopExecution(executionId);
                let returnData;
                if (result === undefined) {
                    // If active execution could not be found check if it is a waiting one
                    returnData = yield this.waitTracker.stopExecution(executionId);
                }
                else {
                    returnData = {
                        mode: result.mode,
                        startedAt: new Date(result.startedAt),
                        stoppedAt: result.stoppedAt ? new Date(result.stoppedAt) : undefined,
                        finished: result.finished,
                    };
                }
                return returnData;
            })));
            // Removes a test webhook
            this.app.delete(`/${this.restEndpoint}/test-webhook/:id`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                // TODO UM: check if this needs validation with user management.
                const workflowId = req.params.id;
                return this.testWebhooks.cancelTestWebhook(workflowId);
            })));
            // ----------------------------------------
            // Options
            // ----------------------------------------
            // Returns all the available timezones
            this.app.get(`/${this.restEndpoint}/options/timezones`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                return google_timezones_json_1.default;
            })));
            // ----------------------------------------
            // Binary data
            // ----------------------------------------
            // Returns binary buffer
            this.app.get(`/${this.restEndpoint}/data/:path`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                // TODO UM: check if this needs permission check for UM
                const dataPath = req.params.path;
                return n8n_core_1.BinaryDataManager.getInstance()
                    .retrieveBinaryDataByIdentifier(dataPath)
                    .then((buffer) => {
                    return buffer.toString('base64');
                });
            })));
            // ----------------------------------------
            // Settings
            // ----------------------------------------
            // Returns the current settings for the UI
            this.app.get(`/${this.restEndpoint}/settings`, _1.ResponseHelper.send((req, res) => __awaiter(this, void 0, void 0, function* () {
                return this.getSettingsForFrontend();
            })));
            // ----------------------------------------
            // Webhooks
            // ----------------------------------------
            if (!config_1.default.getEnv('endpoints.disableProductionWebhooksOnMainProcess')) {
                _1.WebhookServer.registerProductionWebhooks.apply(this);
            }
            // Register all webhook requests (test for UI)
            this.app.all(`/${this.endpointWebhookTest}/*`, (req, res) => __awaiter(this, void 0, void 0, function* () {
                // Cut away the "/webhook-test/" to get the registred part of the url
                const requestUrl = req.parsedUrl.pathname.slice(this.endpointWebhookTest.length + 2);
                const method = req.method.toUpperCase();
                if (method === 'OPTIONS') {
                    let allowedMethods;
                    try {
                        allowedMethods = yield this.testWebhooks.getWebhookMethods(requestUrl);
                        allowedMethods.push('OPTIONS');
                        // Add custom "Allow" header to satisfy OPTIONS response.
                        res.append('Allow', allowedMethods);
                    }
                    catch (error) {
                        _1.ResponseHelper.sendErrorResponse(res, error);
                        return;
                    }
                    res.header('Access-Control-Allow-Origin', '*');
                    _1.ResponseHelper.sendSuccessResponse(res, {}, true, 204);
                    return;
                }
                if (!WebhookHelpers_1.WEBHOOK_METHODS.includes(method)) {
                    _1.ResponseHelper.sendErrorResponse(res, new Error(`The method ${method} is not supported.`));
                    return;
                }
                let response;
                try {
                    response = yield this.testWebhooks.callTestWebhook(method, requestUrl, req, res);
                }
                catch (error) {
                    _1.ResponseHelper.sendErrorResponse(res, error);
                    return;
                }
                if (response.noWebhookResponse === true) {
                    // Nothing else to do as the response got already sent
                    return;
                }
                _1.ResponseHelper.sendSuccessResponse(res, response.data, true, response.responseCode, response.headers);
            }));
            if (this.endpointPresetCredentials !== '') {
                // POST endpoint to set preset credentials
                this.app.post(`/${this.endpointPresetCredentials}`, (req, res) => __awaiter(this, void 0, void 0, function* () {
                    if (!this.presetCredentialsLoaded) {
                        const body = req.body;
                        if (req.headers['content-type'] !== 'application/json') {
                            _1.ResponseHelper.sendErrorResponse(res, new Error('Body must be a valid JSON, make sure the content-type is application/json'));
                            return;
                        }
                        const credentialsOverwrites = (0, _1.CredentialsOverwrites)();
                        yield credentialsOverwrites.init(body);
                        this.presetCredentialsLoaded = true;
                        _1.ResponseHelper.sendSuccessResponse(res, { success: true }, true, 200);
                    }
                    else {
                        _1.ResponseHelper.sendErrorResponse(res, new Error('Preset credentials can be set once'));
                    }
                }));
            }
            if (!config_1.default.getEnv('endpoints.disableUi')) {
                // Read the index file and replace the path placeholder
                const editorUiPath = require.resolve('n8n-editor-ui');
                const filePath = (0, path_1.join)((0, path_1.dirname)(editorUiPath), 'dist', 'index.html');
                const n8nPath = config_1.default.getEnv('path');
                let readIndexFile = (0, fs_1.readFileSync)(filePath, 'utf8');
                readIndexFile = readIndexFile.replace(/\/%BASE_PATH%\//g, n8nPath);
                readIndexFile = readIndexFile.replace(/\/favicon.ico/g, `${n8nPath}favicon.ico`);
                // Serve the altered index.html file separately
                this.app.get(`/index.html`, (req, res) => __awaiter(this, void 0, void 0, function* () {
                    res.send(readIndexFile);
                }));
                // Serve the website
                this.app.use('/', express_1.default.static((0, path_1.join)((0, path_1.dirname)(editorUiPath), 'dist'), {
                    index: 'index.html',
                    setHeaders: (res, path) => {
                        if (res.req && res.req.url === '/index.html') {
                            // Set last modified date manually to n8n start time so
                            // that it hopefully refreshes the page when a new version
                            // got used
                            res.setHeader('Last-Modified', startTime);
                        }
                    },
                }));
            }
            const startTime = new Date().toUTCString();
        });
    }
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const PORT = config_1.default.getEnv('port');
        const ADDRESS = config_1.default.getEnv('listen_address');
        const app = new App();
        yield app.config();
        let server;
        if (app.protocol === 'https' && app.sslKey && app.sslCert) {
            const https = require('https');
            const privateKey = (0, fs_1.readFileSync)(app.sslKey, 'utf8');
            const cert = (0, fs_1.readFileSync)(app.sslCert, 'utf8');
            const credentials = { key: privateKey, cert };
            server = https.createServer(credentials, app.app);
        }
        else {
            const http = require('http');
            server = http.createServer(app.app);
        }
        server.listen(PORT, ADDRESS, () => __awaiter(this, void 0, void 0, function* () {
            const versions = yield _1.GenericHelpers.getVersions();
            console.log(`n8n ready on ${ADDRESS}, port ${PORT}`);
            console.log(`Version: ${versions.cli}`);
            const defaultLocale = config_1.default.getEnv('defaultLocale');
            if (defaultLocale !== 'en') {
                console.log(`Locale: ${defaultLocale}`);
            }
            yield app.externalHooks.run('n8n.ready', [app]);
            const cpus = os_1.default.cpus();
            const binarDataConfig = config_1.default.getEnv('binaryDataManager');
            const diagnosticInfo = {
                basicAuthActive: config_1.default.getEnv('security.basicAuth.active'),
                databaseType: (yield _1.GenericHelpers.getConfigValue('database.type')),
                disableProductionWebhooksOnMainProcess: config_1.default.getEnv('endpoints.disableProductionWebhooksOnMainProcess'),
                notificationsEnabled: config_1.default.getEnv('versionNotifications.enabled'),
                versionCli: versions.cli,
                systemInfo: {
                    os: {
                        type: os_1.default.type(),
                        version: os_1.default.version(),
                    },
                    memory: os_1.default.totalmem() / 1024,
                    cpus: {
                        count: cpus.length,
                        model: cpus[0].model,
                        speed: cpus[0].speed,
                    },
                },
                executionVariables: {
                    executions_process: config_1.default.getEnv('executions.process'),
                    executions_mode: config_1.default.getEnv('executions.mode'),
                    executions_timeout: config_1.default.getEnv('executions.timeout'),
                    executions_timeout_max: config_1.default.getEnv('executions.maxTimeout'),
                    executions_data_save_on_error: config_1.default.getEnv('executions.saveDataOnError'),
                    executions_data_save_on_success: config_1.default.getEnv('executions.saveDataOnSuccess'),
                    executions_data_save_on_progress: config_1.default.getEnv('executions.saveExecutionProgress'),
                    executions_data_save_manual_executions: config_1.default.getEnv('executions.saveDataManualExecutions'),
                    executions_data_prune: config_1.default.getEnv('executions.pruneData'),
                    executions_data_max_age: config_1.default.getEnv('executions.pruneDataMaxAge'),
                    executions_data_prune_timeout: config_1.default.getEnv('executions.pruneDataTimeout'),
                },
                deploymentType: config_1.default.getEnv('deployment.type'),
                binaryDataMode: binarDataConfig.mode,
                n8n_multi_user_allowed: (0, UserManagementHelper_1.isUserManagementEnabled)(),
                smtp_set_up: config_1.default.getEnv('userManagement.emails.mode') === 'smtp',
            };
            void _1.Db.collections
                .Workflow.findOne({
                select: ['createdAt'],
                order: { createdAt: 'ASC' },
            })
                .then((workflow) => __awaiter(this, void 0, void 0, function* () { return InternalHooksManager_1.InternalHooksManager.getInstance().onServerStarted(diagnosticInfo, workflow === null || workflow === void 0 ? void 0 : workflow.createdAt); }));
        }));
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(`n8n's port ${PORT} is already in use. Do you have another instance of n8n running already?`);
                process.exit(1);
            }
        });
    });
}
exports.start = start;
function getExecutionsCount(countFilter, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbType = (yield _1.GenericHelpers.getConfigValue('database.type'));
        const filteredFields = Object.keys(countFilter).filter((field) => field !== 'id');
        // For databases other than Postgres, do a regular count
        // when filtering based on `workflowId` or `finished` fields.
        if (dbType !== 'postgresdb' || filteredFields.length > 0 || user.globalRole.name !== 'owner') {
            const sharedWorkflowIds = yield (0, WorkflowHelpers_1.getSharedWorkflowIds)(user);
            const count = yield _1.Db.collections.Execution.count({
                where: Object.assign({ workflowId: (0, typeorm_1.In)(sharedWorkflowIds) }, countFilter),
            });
            return { count, estimated: false };
        }
        try {
            // Get an estimate of rows count.
            const estimateRowsNumberSql = "SELECT n_live_tup FROM pg_stat_all_tables WHERE relname = 'execution_entity';";
            const rows = yield _1.Db.collections.Execution.query(estimateRowsNumberSql);
            const estimate = parseInt(rows[0].n_live_tup, 10);
            // If over 100k, return just an estimate.
            if (estimate > 100000) {
                // if less than 100k, we get the real count as even a full
                // table scan should not take so long.
                return { count: estimate, estimated: true };
            }
        }
        catch (error) {
            n8n_workflow_1.LoggerProxy.warn(`Failed to get executions count from Postgres: ${error}`);
        }
        const sharedWorkflowIds = yield (0, WorkflowHelpers_1.getSharedWorkflowIds)(user);
        const count = yield _1.Db.collections.Execution.count({
            where: {
                workflowId: (0, typeorm_1.In)(sharedWorkflowIds),
            },
        });
        return { count, estimated: false };
    });
}
const CUSTOM_API_CALL_NAME = 'Custom API Call';
const CUSTOM_API_CALL_KEY = '__CUSTOM_API_CALL__';
/**
 * Inject a `Custom API Call` option into `resource` and `operation`
 * parameters in a node that supports proxy auth.
 */
function injectCustomApiCallOption(description) {
    if (!supportsProxyAuth(description))
        return description;
    description.properties.forEach((p) => {
        if (['resource', 'operation'].includes(p.name) &&
            Array.isArray(p.options) &&
            p.options[p.options.length - 1].name !== CUSTOM_API_CALL_NAME) {
            p.options.push({
                name: CUSTOM_API_CALL_NAME,
                value: CUSTOM_API_CALL_KEY,
            });
        }
        return p;
    });
    return description;
}
const credentialTypes = (0, _1.CredentialTypes)();
/**
 * Whether any of the node's credential types may be used to
 * make a request from a node other than itself.
 */
function supportsProxyAuth(description) {
    if (!description.credentials)
        return false;
    return description.credentials.some(({ name }) => {
        const credType = credentialTypes.getByName(name);
        if (credType.authenticate !== undefined)
            return true;
        return isOAuth(credType);
    });
}
function isOAuth(credType) {
    return (Array.isArray(credType.extends) &&
        credType.extends.some((parentType) => ['oAuth2Api', 'googleOAuth2Api', 'oAuth1Api'].includes(parentType)));
}
