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
const src_1 = require("../../src");
const Helpers = __importStar(require("./Helpers"));
const n8n_workflow_1 = require("n8n-workflow");
const TEST_ENCRYPTION_KEY = 'test';
describe('CredentialsHelper', () => {
    describe('authenticate', () => {
        const tests = [
            {
                description: 'basicAuth, default property names',
                input: {
                    credentials: {
                        user: 'user1',
                        password: 'password1',
                    },
                    credentialType: new (class TestApi {
                        constructor() {
                            this.name = 'testApi';
                            this.displayName = 'Test API';
                            this.properties = [
                                {
                                    displayName: 'User',
                                    name: 'user',
                                    type: 'string',
                                    default: '',
                                },
                                {
                                    displayName: 'Password',
                                    name: 'password',
                                    type: 'string',
                                    default: '',
                                },
                            ];
                            this.authenticate = {
                                type: 'generic',
                                properties: {
                                    auth: {
                                        username: '={{$credentials.user}}',
                                        password: '={{$credentials.password}}',
                                    },
                                },
                            };
                        }
                    })(),
                },
                output: {
                    url: '',
                    headers: {},
                    auth: { username: 'user1', password: 'password1' },
                    qs: {},
                },
            },
            {
                description: 'headerAuth',
                input: {
                    credentials: {
                        accessToken: 'test',
                    },
                    credentialType: new (class TestApi {
                        constructor() {
                            this.name = 'testApi';
                            this.displayName = 'Test API';
                            this.properties = [
                                {
                                    displayName: 'Access Token',
                                    name: 'accessToken',
                                    type: 'string',
                                    default: '',
                                },
                            ];
                            this.authenticate = {
                                type: 'generic',
                                properties: {
                                    headers: {
                                        Authorization: '=Bearer {{$credentials.accessToken}}',
                                    },
                                },
                            };
                        }
                    })(),
                },
                output: { url: '', headers: { Authorization: 'Bearer test' }, qs: {} },
            },
            {
                description: 'headerAuth, key and value expressions',
                input: {
                    credentials: {
                        accessToken: 'test',
                    },
                    credentialType: new (class TestApi {
                        constructor() {
                            this.name = 'testApi';
                            this.displayName = 'Test API';
                            this.properties = [
                                {
                                    displayName: 'Access Token',
                                    name: 'accessToken',
                                    type: 'string',
                                    default: '',
                                },
                            ];
                            this.authenticate = {
                                type: 'generic',
                                properties: {
                                    headers: {
                                        '={{$credentials.accessToken}}': '=Bearer {{$credentials.accessToken}}',
                                    },
                                },
                            };
                        }
                    })(),
                },
                output: { url: '', headers: { test: 'Bearer test' }, qs: {} },
            },
            {
                description: 'queryAuth',
                input: {
                    credentials: {
                        accessToken: 'test',
                    },
                    credentialType: new (class TestApi {
                        constructor() {
                            this.name = 'testApi';
                            this.displayName = 'Test API';
                            this.properties = [
                                {
                                    displayName: 'Access Token',
                                    name: 'accessToken',
                                    type: 'string',
                                    default: '',
                                },
                            ];
                            this.authenticate = {
                                type: 'generic',
                                properties: {
                                    qs: {
                                        accessToken: '={{$credentials.accessToken}}',
                                    },
                                },
                            };
                        }
                    })(),
                },
                output: { url: '', headers: {}, qs: { accessToken: 'test' } },
            },
            {
                description: 'custom authentication',
                input: {
                    credentials: {
                        accessToken: 'test',
                        user: 'testUser',
                    },
                    credentialType: new (class TestApi {
                        constructor() {
                            this.name = 'testApi';
                            this.displayName = 'Test API';
                            this.properties = [
                                {
                                    displayName: 'My Token',
                                    name: 'myToken',
                                    type: 'string',
                                    default: '',
                                },
                            ];
                        }
                        authenticate(credentials, requestOptions) {
                            return __awaiter(this, void 0, void 0, function* () {
                                requestOptions.headers['Authorization'] = `Bearer ${credentials.accessToken}`;
                                requestOptions.qs['user'] = credentials.user;
                                return requestOptions;
                            });
                        }
                    })(),
                },
                output: {
                    url: '',
                    headers: { Authorization: 'Bearer test' },
                    qs: { user: 'testUser' },
                },
            },
        ];
        const node = {
            parameters: {},
            name: 'test',
            type: 'test.set',
            typeVersion: 1,
            position: [0, 0],
        };
        const incomingRequestOptions = {
            url: '',
            headers: {},
            qs: {},
        };
        const nodeTypes = Helpers.NodeTypes();
        const workflow = new n8n_workflow_1.Workflow({
            nodes: [node],
            connections: {},
            active: false,
            nodeTypes,
        });
        const timezone = 'America/New_York';
        for (const testData of tests) {
            test(testData.description, () => __awaiter(void 0, void 0, void 0, function* () {
                const credentialTypes = {
                    [testData.input.credentialType.name]: {
                        type: testData.input.credentialType,
                        sourcePath: '',
                    },
                };
                yield (0, src_1.CredentialTypes)().init(credentialTypes);
                const credentialsHelper = new src_1.CredentialsHelper(TEST_ENCRYPTION_KEY);
                const result = yield credentialsHelper.authenticate(testData.input.credentials, testData.input.credentialType.name, JSON.parse(JSON.stringify(incomingRequestOptions)), workflow, node, timezone);
                expect(result).toEqual(testData.output);
            }));
        }
    });
});
