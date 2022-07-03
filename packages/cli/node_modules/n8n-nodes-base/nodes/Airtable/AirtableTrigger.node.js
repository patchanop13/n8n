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
exports.AirtableTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_1 = __importDefault(require("moment"));
class AirtableTrigger {
    constructor() {
        this.description = {
            displayName: 'Airtable Trigger',
            name: 'airtableTrigger',
            icon: 'file:airtable.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Airtable events occur',
            subtitle: '={{$parameter["event"]}}',
            defaults: {
                name: 'Airtable Trigger',
            },
            credentials: [
                {
                    name: 'airtableApi',
                    required: true,
                },
            ],
            polling: true,
            inputs: [],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Base ID',
                    name: 'baseId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The ID of this base',
                },
                {
                    displayName: 'Table ID',
                    name: 'tableId',
                    type: 'string',
                    default: '',
                    description: 'The ID of the table to access',
                    required: true,
                },
                {
                    displayName: 'Trigger Field',
                    name: 'triggerField',
                    type: 'string',
                    default: '',
                    description: 'A Created Time or Last Modified Time field that will be used to sort records. If you do not have a Created Time or Last Modified Time field in your schema, please create one, because without this field trigger will not work correctly.',
                    required: true,
                },
                {
                    displayName: 'Download Attachments',
                    name: 'downloadAttachments',
                    type: 'boolean',
                    default: false,
                    description: 'Whether the attachment fields define in \'Download Fields\' will be downloaded',
                },
                {
                    displayName: 'Download Fields',
                    name: 'downloadFieldNames',
                    type: 'string',
                    required: true,
                    displayOptions: {
                        show: {
                            downloadAttachments: [
                                true,
                            ],
                        },
                    },
                    default: '',
                    description: 'Name of the fields of type \'attachment\' that should be downloaded. Multiple ones can be defined separated by comma. Case sensitive.',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'Fields',
                            name: 'fields',
                            type: 'string',
                            default: '',
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-id
                            description: 'Fields to be included in the response. Multiple ones can be set separated by comma. Example: <code>name, id</code>. By default just the trigger field will be included.',
                        },
                        {
                            displayName: 'Formula',
                            name: 'formula',
                            type: 'string',
                            default: '',
                            description: 'Formulas may involve functions, numeric operations, logical operations, and text operations that operate on fields. More info <a href="https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference">here</a>.',
                        },
                        {
                            displayName: 'View ID',
                            name: 'viewId',
                            type: 'string',
                            default: '',
                            description: 'The name or ID of a view in the table. If set, only the records in that view will be returned.',
                        },
                    ],
                },
            ],
        };
    }
    poll() {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadAttachments = this.getNodeParameter('downloadAttachments', 0);
            const webhookData = this.getWorkflowStaticData('node');
            const qs = {};
            const additionalFields = this.getNodeParameter('additionalFields');
            const base = this.getNodeParameter('baseId');
            const table = this.getNodeParameter('tableId');
            const triggerField = this.getNodeParameter('triggerField');
            const endpoint = `${base}/${table}`;
            const now = (0, moment_1.default)().utc().format();
            const startDate = webhookData.lastTimeChecked || now;
            const endDate = now;
            if (additionalFields.viewId) {
                qs.view = additionalFields.viewId;
            }
            if (additionalFields.fields) {
                qs['fields[]'] = additionalFields.fields.split(',');
            }
            qs.filterByFormula = `IS_AFTER({${triggerField}}, DATETIME_PARSE("${startDate}", "YYYY-MM-DD HH:mm:ss"))`;
            if (additionalFields.formula) {
                qs.filterByFormula = `AND(${qs.filterByFormula}, ${additionalFields.formula})`;
            }
            if (this.getMode() === 'manual') {
                delete qs.filterByFormula;
                qs.maxRecords = 1;
            }
            const { records } = yield GenericFunctions_1.apiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
            webhookData.lastTimeChecked = endDate;
            if (Array.isArray(records) && records.length) {
                if (this.getMode() === 'manual' && records[0].fields[triggerField] === undefined) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The Field "${triggerField}" does not exist.`);
                }
                if (downloadAttachments === true) {
                    const downloadFieldNames = this.getNodeParameter('downloadFieldNames', 0).split(',');
                    const data = yield GenericFunctions_1.downloadRecordAttachments.call(this, records, downloadFieldNames);
                    return [data];
                }
                return [this.helpers.returnJsonArray(records)];
            }
            return null;
        });
    }
}
exports.AirtableTrigger = AirtableTrigger;
