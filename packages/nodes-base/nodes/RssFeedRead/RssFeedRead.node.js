"use strict";
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
exports.RssFeedRead = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const rss_parser_1 = __importDefault(require("rss-parser"));
const url_1 = require("url");
class RssFeedRead {
    constructor() {
        this.description = {
            displayName: 'RSS Read',
            name: 'rssFeedRead',
            icon: 'fa:rss',
            group: ['input'],
            version: 1,
            description: 'Reads data from an RSS Feed',
            defaults: {
                name: 'RSS Feed Read',
                color: '#b02020',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'URL',
                    name: 'url',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'URL of the RSS feed',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = this.getNodeParameter('url', 0);
                if (!url) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The parameter "URL" has to be set!');
                }
                if (!validateURL(url)) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The provided "URL" is not valid!');
                }
                const parser = new rss_parser_1.default();
                let feed;
                try {
                    feed = yield parser.parseURL(url);
                }
                catch (error) {
                    if (error.code === 'ECONNREFUSED') {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `It was not possible to connect to the URL. Please make sure the URL "${url}" it is valid!`);
                    }
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
                }
                const returnData = [];
                // For now we just take the items and ignore everything else
                if (feed.items) {
                    feed.items.forEach((item) => {
                        // @ts-ignore
                        returnData.push(item);
                    });
                }
                return [this.helpers.returnJsonArray(returnData)];
            }
            catch (error) {
                if (this.continueOnFail()) {
                    return this.prepareOutputData([{ json: { error: error.message } }]);
                }
                throw error;
            }
        });
    }
}
exports.RssFeedRead = RssFeedRead;
// Utility function
function validateURL(url) {
    try {
        const parseUrl = new url_1.URL(url);
        return true;
    }
    catch (err) {
        return false;
    }
}
