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
exports.descriptions = exports.upload = exports.update = exports.getAll = exports.download = exports.del = void 0;
const del = __importStar(require("./del"));
exports.del = del;
const download = __importStar(require("./download"));
exports.download = download;
const getAll = __importStar(require("./getAll"));
exports.getAll = getAll;
const update = __importStar(require("./update"));
exports.update = update;
const upload = __importStar(require("./upload"));
exports.upload = upload;
exports.descriptions = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'file',
                ],
            },
        },
        options: [
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a company file',
            },
            {
                name: 'Download',
                value: 'download',
                description: 'Download a company file',
            },
            {
                name: 'Get All',
                value: 'getAll',
                description: 'Get all company files',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a company file',
            },
            {
                name: 'Upload',
                value: 'upload',
                description: 'Upload a company file',
            },
        ],
        default: 'delete',
    },
    ...del.description,
    ...download.description,
    ...getAll.description,
    ...update.description,
    ...upload.description,
];
