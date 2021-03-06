"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostBin = void 0;
const BinDescription_1 = require("./BinDescription");
const RequestDescription_1 = require("./RequestDescription");
class PostBin {
    constructor() {
        this.description = {
            displayName: 'PostBin',
            name: 'postBin',
            icon: 'file:postbin.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
            description: 'Consume PostBin API',
            defaults: {
                name: 'PostBin',
                color: '#4dc0b5',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [],
            requestDefaults: {
                baseURL: 'https://www.toptal.com',
            },
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Bin',
                            value: 'bin',
                        },
                        {
                            name: 'Request',
                            value: 'request',
                        },
                    ],
                    default: 'bin',
                    required: true,
                },
                ...BinDescription_1.binOperations,
                ...BinDescription_1.binFields,
                ...RequestDescription_1.requestOperations,
                ...RequestDescription_1.requestFields,
            ],
        };
    }
}
exports.PostBin = PostBin;
