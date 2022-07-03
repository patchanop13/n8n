"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionDescription = void 0;
/* eslint-disable n8n-nodes-base/filesystem-wrong-node-filename */
const DatabaseDescription_1 = require("../DatabaseDescription");
const UserDescription_1 = require("../UserDescription");
const PageDescription_1 = require("../PageDescription");
const BlockDescription_1 = require("../BlockDescription");
const DatabasePageDescription_1 = require("../DatabasePageDescription");
exports.versionDescription = {
    displayName: 'Notion (Beta)',
    name: 'notion',
    icon: 'file:notion.svg',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume Notion API (Beta)',
    defaults: {
        name: 'Notion',
        color: '#000000',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
        {
            name: 'notionApi',
            required: true,
            // displayOptions: {
            // 	show: {
            // 		authentication: [
            // 			'apiKey',
            // 		],
            // 	},
            // },
        },
        // {
        // 	name: 'notionOAuth2Api',
        // 	required: true,
        // 	displayOptions: {
        // 		show: {
        // 			authentication: [
        // 				'oAuth2',
        // 			],
        // 		},
        // 	},
        // },
    ],
    properties: [
        // {
        // 	displayName: 'Authentication',
        // 	name: 'authentication',
        // 	type: 'options',
        // 	options: [
        // 		{
        // 			name: 'API Key',
        // 			value: 'apiKey',
        // 		},
        // 		{
        // 			name: 'OAuth2',
        // 			value: 'oAuth2',
        // 		},
        // 	],
        // 	default: 'apiKey',
        // 	description: 'The resource to operate on.',
        // },
        {
            displayName: 'To access content, make sure it\'s shared with your integration in Notion',
            name: 'notionNotice',
            type: 'notice',
            default: '',
        },
        {
            displayName: 'Version',
            name: 'version',
            type: 'hidden',
            default: 1,
        },
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            noDataExpression: true,
            options: [
                {
                    name: 'Block',
                    value: 'block',
                },
                {
                    name: 'Database',
                    value: 'database',
                },
                {
                    name: 'Database Page',
                    value: 'databasePage',
                },
                {
                    name: 'Page',
                    value: 'page',
                },
                {
                    name: 'User',
                    value: 'user',
                },
            ],
            default: 'page',
        },
        ...BlockDescription_1.blockOperations,
        ...BlockDescription_1.blockFields,
        ...DatabaseDescription_1.databaseOperations,
        ...DatabaseDescription_1.databaseFields,
        ...DatabasePageDescription_1.databasePageOperations,
        ...DatabasePageDescription_1.databasePageFields,
        ...PageDescription_1.pageOperations,
        ...PageDescription_1.pageFields,
        ...UserDescription_1.userOperations,
        ...UserDescription_1.userFields,
    ],
};
