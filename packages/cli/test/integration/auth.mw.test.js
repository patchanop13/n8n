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
const supertest_1 = __importDefault(require("supertest"));
const constants_1 = require("./shared/constants");
const utils = __importStar(require("./shared/utils"));
const testDb = __importStar(require("./shared/testDb"));
jest.mock('../../src/telemetry');
let app;
let testDbName = '';
let globalMemberRole;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield utils.initTestServer({
        applyAuth: true,
        endpointGroups: ['me', 'auth', 'owner', 'users'],
    });
    const initResult = yield testDb.init();
    testDbName = initResult.testDbName;
    globalMemberRole = yield testDb.getGlobalMemberRole();
    utils.initTestLogger();
    utils.initTestTelemetry();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield testDb.terminate(testDbName);
}));
constants_1.ROUTES_REQUIRING_AUTHENTICATION.concat(constants_1.ROUTES_REQUIRING_AUTHORIZATION).forEach((route) => {
    const [method, endpoint] = getMethodAndEndpoint(route);
    test(`${route} should return 401 Unauthorized if no cookie`, () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)[method](endpoint).use(utils.prefix(constants_1.REST_PATH_SEGMENT));
        expect(response.statusCode).toBe(401);
    }));
});
constants_1.ROUTES_REQUIRING_AUTHORIZATION.forEach((route) => __awaiter(void 0, void 0, void 0, function* () {
    const [method, endpoint] = getMethodAndEndpoint(route);
    test(`${route} should return 403 Forbidden for member`, () => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield testDb.createUser({ globalRole: globalMemberRole });
        const authMemberAgent = utils.createAgent(app, { auth: true, user: member });
        const response = yield authMemberAgent[method](endpoint);
        expect(response.statusCode).toBe(403);
    }));
}));
function getMethodAndEndpoint(route) {
    return route.split(' ').map((segment, index) => {
        return index % 2 === 0 ? segment.toLowerCase() : segment;
    });
}
