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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.registerProductionWebhooks = void 0;
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const typeorm_1 = require("typeorm");
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
// eslint-disable-next-line import/no-extraneous-dependencies
const parseurl_1 = __importDefault(require("parseurl"));
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
const config_1 = __importDefault(require("../config"));
// eslint-disable-next-line import/no-cycle
const WebhookHelpers_1 = require("./WebhookHelpers");
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-call
require('body-parser-xml')(body_parser_1.default);
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function registerProductionWebhooks() {
    // ----------------------------------------
    // Regular Webhooks
    // ----------------------------------------
    // Register all webhook requests
    this.app.all(`/${this.endpointWebhook}/*`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        // Cut away the "/webhook/" to get the registred part of the url
        const requestUrl = req.parsedUrl.pathname.slice(this.endpointWebhook.length + 2);
        const method = req.method.toUpperCase();
        if (method === 'OPTIONS') {
            let allowedMethods;
            try {
                allowedMethods = yield this.activeWorkflowRunner.getWebhookMethods(requestUrl);
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            response = yield this.activeWorkflowRunner.executeWebhook(method, requestUrl, req, res);
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
    // ----------------------------------------
    // Waiting Webhooks
    // ----------------------------------------
    const waitingWebhooks = new _1.WaitingWebhooks();
    // Register all webhook-waiting requests
    this.app.all(`/${this.endpointWebhookWaiting}/*`, (req, res) => __awaiter(this, void 0, void 0, function* () {
        // Cut away the "/webhook-waiting/" to get the registred part of the url
        const requestUrl = req.parsedUrl.pathname.slice(this.endpointWebhookWaiting.length + 2);
        const method = req.method.toUpperCase();
        // TOOD: Add support for OPTIONS in the future
        // if (method === 'OPTIONS') {
        // }
        if (!WebhookHelpers_1.WEBHOOK_METHODS.includes(method)) {
            _1.ResponseHelper.sendErrorResponse(res, new Error(`The method ${method} is not supported.`));
            return;
        }
        let response;
        try {
            response = yield waitingWebhooks.executeWebhook(method, requestUrl, req, res);
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
}
exports.registerProductionWebhooks = registerProductionWebhooks;
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.endpointWebhook = config_1.default.getEnv('endpoints.webhook');
        this.endpointWebhookWaiting = config_1.default.getEnv('endpoints.webhookWaiting');
        this.saveDataErrorExecution = config_1.default.getEnv('executions.saveDataOnError');
        this.saveDataSuccessExecution = config_1.default.getEnv('executions.saveDataOnSuccess');
        this.saveManualExecutions = config_1.default.getEnv('executions.saveDataManualExecutions');
        this.executionTimeout = config_1.default.getEnv('executions.timeout');
        this.maxExecutionTimeout = config_1.default.getEnv('executions.maxTimeout');
        this.timezone = config_1.default.getEnv('generic.timezone');
        this.restEndpoint = config_1.default.getEnv('endpoints.rest');
        this.activeWorkflowRunner = _1.ActiveWorkflowRunner.getInstance();
        this.activeExecutionsInstance = _1.ActiveExecutions.getInstance();
        this.protocol = config_1.default.getEnv('protocol');
        this.sslKey = config_1.default.getEnv('ssl_key');
        this.sslCert = config_1.default.getEnv('ssl_cert');
        this.externalHooks = (0, _1.ExternalHooks)();
        this.presetCredentialsLoaded = false;
        this.endpointPresetCredentials = config_1.default.getEnv('credentials.overwrite.endpoint');
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
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            this.versions = yield _1.GenericHelpers.getVersions();
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
                limit: '16mb',
                verify: (req, res, buf) => {
                    // @ts-ignore
                    req.rawBody = buf;
                },
            }));
            // Support application/xml type post data
            this.app.use(
            // @ts-ignore
            body_parser_1.default.xml({
                limit: '16mb',
                xmlParseOptions: {
                    normalize: true,
                    normalizeTags: true,
                    explicitArray: false, // Only put properties in array if length > 1
                },
            }));
            this.app.use(body_parser_1.default.text({
                limit: '16mb',
                verify: (req, res, buf) => {
                    // @ts-ignore
                    req.rawBody = buf;
                },
            }));
            // support application/x-www-form-urlencoded post data
            this.app.use(body_parser_1.default.urlencoded({
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
                    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, sessionid');
                    next();
                });
            }
            this.app.use((req, res, next) => {
                if (!_1.Db.isInitialized) {
                    const error = new _1.ResponseHelper.ResponseError('Database is not ready!', undefined, 503);
                    return _1.ResponseHelper.sendErrorResponse(res, error);
                }
                next();
            });
            // ----------------------------------------
            // Healthcheck
            // ----------------------------------------
            // Does very basic health check
            this.app.get('/healthz', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const connection = (0, typeorm_1.getConnectionManager)().get();
                try {
                    if (!connection.isConnected) {
                        // Connection is not active
                        throw new Error('No active database connection!');
                    }
                    // DB ping
                    yield connection.query('SELECT 1');
                    // eslint-disable-next-line id-denylist
                }
                catch (err) {
                    const error = new _1.ResponseHelper.ResponseError('No Database connection!', undefined, 503);
                    return _1.ResponseHelper.sendErrorResponse(res, error);
                }
                // Everything fine
                const responseData = {
                    status: 'ok',
                };
                _1.ResponseHelper.sendSuccessResponse(res, responseData, true, 200);
            }));
            registerProductionWebhooks.apply(this);
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
            // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
            const https = require('https');
            const privateKey = (0, fs_1.readFileSync)(app.sslKey, 'utf8');
            const cert = (0, fs_1.readFileSync)(app.sslCert, 'utf8');
            const credentials = { key: privateKey, cert };
            server = https.createServer(credentials, app.app);
        }
        else {
            // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
            const http = require('http');
            server = http.createServer(app.app);
        }
        server.listen(PORT, ADDRESS, () => __awaiter(this, void 0, void 0, function* () {
            const versions = yield _1.GenericHelpers.getVersions();
            console.log(`n8n ready on ${ADDRESS}, port ${PORT}`);
            console.log(`Version: ${versions.cli}`);
            yield app.externalHooks.run('n8n.ready', [app]);
        }));
    });
}
exports.start = start;
