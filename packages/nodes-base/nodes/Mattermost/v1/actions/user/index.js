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
Object.defineProperty(exports, "__esModule", { value: true });
exports.descriptions = exports.invite = exports.getById = exports.getByEmail = exports.getAll = exports.deactive = exports.create = void 0;
const create = __importStar(require("./create"));
exports.create = create;
const deactive = __importStar(require("./deactive"));
exports.deactive = deactive;
const getAll = __importStar(require("./getAll"));
exports.getAll = getAll;
const getByEmail = __importStar(require("./getByEmail"));
exports.getByEmail = getByEmail;
const getById = __importStar(require("./getById"));
exports.getById = getById;
const invite = __importStar(require("./invite"));
exports.invite = invite;
exports.descriptions = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'user',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new user',
            },
            {
                name: 'Deactive',
                value: 'deactive',
                description: 'Deactivates the user and revokes all its sessions by archiving its user object',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Retrieve all users',
            },
            {
                name: 'Get By Email',
                value: 'getByEmail',
                description: 'Get a user by email',
            },
            {
                name: 'Get By ID',
                value: 'getById',
                description: 'Get a user by ID',
            },
            {
                name: 'Invite',
                value: 'invite',
                description: 'Invite user to team',
            },
        ],
        default: '',
    },
    ...create.description,
    ...deactive.description,
    ...getAll.description,
    ...getByEmail.description,
    ...getById.description,
    ...invite.description,
];
