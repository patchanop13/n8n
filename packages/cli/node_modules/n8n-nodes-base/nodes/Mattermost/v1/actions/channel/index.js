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
exports.descriptions = exports.search = exports.statistics = exports.addUser = exports.restore = exports.members = exports.delete = exports.create = void 0;
const create = __importStar(require("./create"));
exports.create = create;
const del = __importStar(require("./del"));
exports.delete = del;
const members = __importStar(require("./members"));
exports.members = members;
const restore = __importStar(require("./restore"));
exports.restore = restore;
const addUser = __importStar(require("./addUser"));
exports.addUser = addUser;
const statistics = __importStar(require("./statistics"));
exports.statistics = statistics;
const search = __importStar(require("./search"));
exports.search = search;
exports.descriptions = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'channel',
                ],
            },
        },
        options: [
            {
                name: 'Add User',
                value: 'addUser',
                description: 'Add a user to a channel',
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new channel',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Soft delete a channel',
            },
            {
                name: 'Member',
                value: 'members',
                description: 'Get a page of members for a channel',
            },
            {
                name: 'Restore',
                value: 'restore',
                description: 'Restores a soft deleted channel',
            },
            {
                name: 'Search',
                value: 'search',
                description: 'Search for a channel',
            },
            {
                name: 'Statistics',
                value: 'statistics',
                description: 'Get statistics for a channel',
            },
        ],
        default: 'create',
    },
    ...create.description,
    ...del.description,
    ...members.description,
    ...restore.description,
    ...addUser.description,
    ...statistics.description,
    ...search.description,
];
