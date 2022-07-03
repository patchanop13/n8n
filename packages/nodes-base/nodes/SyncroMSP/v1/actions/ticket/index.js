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
exports.descriptions = exports.update = exports.delete = exports.get = exports.create = exports.getAll = void 0;
const getAll = __importStar(require("./getAll"));
exports.getAll = getAll;
const create = __importStar(require("./create"));
exports.create = create;
const get = __importStar(require("./get"));
exports.get = get;
const del = __importStar(require("./del"));
exports.delete = del;
const update = __importStar(require("./update"));
exports.update = update;
exports.descriptions = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'ticket',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create new ticket',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete ticket',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Retrieve ticket',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Retrieve all tickets',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update ticket',
            },
        ],
        default: 'getAll',
    },
    ...getAll.description,
    ...create.description,
    ...get.description,
    ...del.description,
    ...update.description,
];
