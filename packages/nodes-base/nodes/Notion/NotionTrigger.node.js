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
exports.NotionTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const moment_1 = __importDefault(require("moment"));
class NotionTrigger {
    constructor() {
        this.description = {
            displayName: 'Notion Trigger (Beta)',
            name: 'notionTrigger',
            icon: 'file:notion.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Notion events occur',
            subtitle: '={{$parameter["event"]}}',
            defaults: {
                name: 'Notion Trigger',
            },
            credentials: [
                {
                    name: 'notionApi',
                    required: true,
                    testedBy: 'notionApiCredentialTest',
                },
            ],
            polling: true,
            inputs: [],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Event',
                    name: 'event',
                    type: 'options',
                    options: [
                        {
                            name: 'Page Added to Database',
                            value: 'pageAddedToDatabase',
                        },
                        {
                            name: 'Page Updated in Database',
                            value: 'pagedUpdatedInDatabase',
                        },
                    ],
                    required: true,
                    default: '',
                },
                {
                    displayName: 'Database Name or ID',
                    name: 'databaseId',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getDatabases',
                    },
                    displayOptions: {
                        show: {
                            event: [
                                'pageAddedToDatabase',
                                'pagedUpdatedInDatabase',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The ID of this database. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Simplify',
                    name: 'simple',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            event: [
                                'pageAddedToDatabase',
                                'pagedUpdatedInDatabase',
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether to return a simplified version of the response instead of the raw data',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getDatabases() {
                    var _a;
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { results: databases } = yield GenericFunctions_1.notionApiRequest.call(this, 'POST', `/search`, { page_size: 100, filter: { property: 'object', value: 'database' } });
                        for (const database of databases) {
                            returnData.push({
                                name: ((_a = database.title[0]) === null || _a === void 0 ? void 0 : _a.plain_text) || database.id,
                                value: database.id,
                            });
                        }
                        returnData.sort((a, b) => {
                            if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
                                return -1;
                            }
                            if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
                                return 1;
                            }
                            return 0;
                        });
                        return returnData;
                    });
                },
            },
        };
    }
    poll() {
        return __awaiter(this, void 0, void 0, function* () {
            const webhookData = this.getWorkflowStaticData('node');
            const databaseId = this.getNodeParameter('databaseId');
            const event = this.getNodeParameter('event');
            const simple = this.getNodeParameter('simple');
            const now = (0, moment_1.default)().utc().format();
            const startDate = webhookData.lastTimeChecked || now;
            const endDate = now;
            webhookData.lastTimeChecked = endDate;
            const sortProperty = (event === 'pageAddedToDatabase') ? 'created_time' : 'last_edited_time';
            const body = {
                page_size: 1,
                sorts: [
                    {
                        timestamp: sortProperty,
                        direction: 'descending',
                    },
                ],
            };
            let records = [];
            let hasMore = true;
            //get last record
            let { results: data } = yield GenericFunctions_1.notionApiRequest.call(this, 'POST', `/databases/${databaseId}/query`, body);
            if (this.getMode() === 'manual') {
                if (simple === true) {
                    data = (0, GenericFunctions_1.simplifyObjects)(data, false, 1);
                }
                if (Array.isArray(data) && data.length) {
                    return [this.helpers.returnJsonArray(data)];
                }
            }
            // if something changed after the last check
            if (Object.keys(data[0]).length !== 0 && webhookData.lastRecordProccesed !== data[0].id) {
                do {
                    body.page_size = 10;
                    const { results, has_more, next_cursor } = yield GenericFunctions_1.notionApiRequest.call(this, 'POST', `/databases/${databaseId}/query`, body);
                    records.push.apply(records, results);
                    hasMore = has_more;
                    if (next_cursor !== null) {
                        body['start_cursor'] = next_cursor;
                    }
                } while (!(0, moment_1.default)(records[records.length - 1][sortProperty]).isSameOrBefore(startDate) && hasMore === true);
                if (this.getMode() !== 'manual') {
                    records = records.filter((record) => (0, moment_1.default)(record[sortProperty]).isBetween(startDate, endDate));
                }
                if (simple === true) {
                    records = (0, GenericFunctions_1.simplifyObjects)(records, false, 1);
                }
                webhookData.lastRecordProccesed = data[0].id;
                if (Array.isArray(records) && records.length) {
                    return [this.helpers.returnJsonArray(records)];
                }
            }
            return null;
        });
    }
}
exports.NotionTrigger = NotionTrigger;
