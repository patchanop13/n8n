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
exports.loadPublicApiVersions = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable import/no-cycle */
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const validator_1 = __importDefault(require("validator"));
const yamljs_1 = __importDefault(require("yamljs"));
const config_1 = __importDefault(require("../../config"));
const __1 = require("..");
const UserManagementHelper_1 = require("../UserManagement/UserManagementHelper");
function createApiRouter(version, openApiSpecPath, handlersDirectory, swaggerThemeCss, publicApiEndpoint) {
    const n8nPath = config_1.default.getEnv('path');
    const swaggerDocument = yamljs_1.default.load(openApiSpecPath);
    // add the server depeding on the config so the user can interact with the API
    // from the Swagger UI
    swaggerDocument.server = [
        {
            url: `${(0, UserManagementHelper_1.getInstanceBaseUrl)()}/${publicApiEndpoint}/${version}}`,
        },
    ];
    const apiController = express_1.default.Router();
    apiController.use(`/${publicApiEndpoint}/${version}/docs`, swagger_ui_express_1.default.serveFiles(swaggerDocument), swagger_ui_express_1.default.setup(swaggerDocument, {
        customCss: swaggerThemeCss,
        customSiteTitle: 'n8n Public API UI',
        customfavIcon: `${n8nPath}favicon.ico`,
    }));
    apiController.use(`/${publicApiEndpoint}/${version}`, express_1.default.json());
    apiController.use(`/${publicApiEndpoint}/${version}`, OpenApiValidator.middleware({
        apiSpec: openApiSpecPath,
        operationHandlers: handlersDirectory,
        validateRequests: true,
        validateApiSpec: true,
        formats: [
            {
                name: 'email',
                type: 'string',
                validate: (email) => validator_1.default.isEmail(email),
            },
            {
                name: 'identifier',
                type: 'string',
                validate: (identifier) => validator_1.default.isUUID(identifier) || validator_1.default.isEmail(identifier),
            },
        ],
        validateSecurity: {
            handlers: {
                ApiKeyAuth: (req, _scopes, schema) => __awaiter(this, void 0, void 0, function* () {
                    const apiKey = req.headers[schema.name.toLowerCase()];
                    const user = yield __1.Db.collections.User.findOne({
                        where: { apiKey },
                        relations: ['globalRole'],
                    });
                    if (!user)
                        return false;
                    void __1.InternalHooksManager.getInstance().onUserInvokedApi({
                        user_id: user.id,
                        path: req.path,
                        method: req.method,
                        api_version: version,
                    });
                    req.user = user;
                    return true;
                }),
            },
        },
    }));
    apiController.use((error, _req, res, _next) => {
        return res.status(error.status || 400).json({
            message: error.message,
        });
    });
    return apiController;
}
const loadPublicApiVersions = (publicApiEndpoint) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const swaggerThemePath = path_1.default.join(__dirname, 'swaggerTheme.css');
    const folders = yield promises_1.default.readdir(__dirname);
    const css = (yield promises_1.default.readFile(swaggerThemePath)).toString();
    const versions = folders.filter((folderName) => folderName.startsWith('v'));
    const apiRouters = versions.map((version) => {
        const openApiPath = path_1.default.join(__dirname, version, 'openapi.yml');
        return createApiRouter(version, openApiPath, __dirname, css, publicApiEndpoint);
    });
    return {
        apiRouters,
        apiLatestVersion: (_b = Number((_a = versions.pop()) === null || _a === void 0 ? void 0 : _a.charAt(1))) !== null && _b !== void 0 ? _b : 1,
    };
});
exports.loadPublicApiVersions = loadPublicApiVersions;
