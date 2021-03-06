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
exports.versionDescription = void 0;
const channel = __importStar(require("./channel"));
const message = __importStar(require("./message"));
const reaction = __importStar(require("./reaction"));
const user = __importStar(require("./user"));
exports.versionDescription = {
    displayName: 'Mattermost',
    name: 'mattermost',
    icon: 'file:mattermost.svg',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Sends data to Mattermost',
    defaults: {
        name: 'Mattermost',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
        {
            name: 'mattermostApi',
            required: true,
        },
    ],
    properties: [
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Channel',
                    value: 'channel',
                },
                {
                    name: 'Message',
                    value: 'message',
                },
                {
                    name: 'Reaction',
                    value: 'reaction',
                },
                {
                    name: 'User',
                    value: 'user',
                },
            ],
            default: 'message',
        },
        ...channel.descriptions,
        ...message.descriptions,
        ...reaction.descriptions,
        ...user.descriptions,
    ],
};
