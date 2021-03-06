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
exports.descriptions = exports.postEphemeral = exports.post = exports.delete = void 0;
const del = __importStar(require("./del"));
exports.delete = del;
const post = __importStar(require("./post"));
exports.post = post;
const postEphemeral = __importStar(require("./postEphemeral"));
exports.postEphemeral = postEphemeral;
exports.descriptions = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'message',
                ],
            },
        },
        options: [
            {
                name: 'Delete',
                value: 'delete',
                description: 'Soft delete a post, by marking the post as deleted in the database',
            },
            {
                name: 'Post',
                value: 'post',
                description: 'Post a message into a channel',
            },
            {
                name: 'Post Ephemeral',
                value: 'postEphemeral',
                description: 'Post an ephemeral message into a channel',
            },
        ],
        default: 'post',
    },
    ...del.description,
    ...post.description,
    ...postEphemeral.description,
];
