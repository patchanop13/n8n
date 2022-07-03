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
exports.descriptions = exports.getAll = exports.delete = exports.create = void 0;
const create = __importStar(require("./create"));
exports.create = create;
const del = __importStar(require("./del"));
exports.delete = del;
const getAll = __importStar(require("./getAll"));
exports.getAll = getAll;
exports.descriptions = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'reaction',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Add a reaction to a post',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Remove a reaction from a post',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all the reactions to one or more posts',
            },
        ],
        default: 'create',
    },
    ...create.description,
    ...del.description,
    ...getAll.description,
];
