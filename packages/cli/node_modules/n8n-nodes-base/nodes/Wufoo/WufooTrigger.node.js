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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WufooTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const crypto_1 = require("crypto");
class WufooTrigger {
    constructor() {
        this.description = {
            displayName: 'Wufoo Trigger',
            name: 'wufooTrigger',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:wufoo.png',
            group: ['trigger'],
            version: 1,
            description: 'Handle Wufoo events via webhooks',
            defaults: {
                name: 'Wufoo Trigger',
            },
            inputs: [],
            outputs: ['main'],
            credentials: [
                {
                    name: 'wufooApi',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Forms Name or ID',
                    name: 'form',
                    type: 'options',
                    required: true,
                    default: '',
                    typeOptions: {
                        loadOptionsMethod: 'getForms',
                    },
                    description: 'The form upon which will trigger this node when a new entry is made. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Only Answers',
                    name: 'onlyAnswers',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to return only the answers of the form and not any of the other data',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getForms() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const body = { includeTodayCount: true };
                        // https://wufoo.github.io/docs/#all-forms
                        const formObject = yield GenericFunctions_1.wufooApiRequest.call(this, 'GET', 'forms.json', body);
                        for (const form of formObject.Forms) {
                            const name = form.Name;
                            const value = form.Hash;
                            returnData.push({
                                name,
                                value,
                            });
                        }
                        // Entries submitted on the same day are present in separate property in data object
                        if (formObject.EntryCountToday) {
                            for (const form of formObject.EntryCountToday) {
                                const name = form.Name;
                                const value = form.Hash;
                                returnData.push({
                                    name,
                                    value,
                                });
                            }
                        }
                        return returnData;
                    });
                },
            },
        };
        // @ts-ignore
        this.webhookMethods = {
            default: {
                // No API endpoint to allow checking of existing webhooks.
                // Creating new webhook will not overwrite existing one if parameters are the same.
                // Otherwise an update occurs.
                checkExists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return false;
                    });
                },
                create() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookUrl = this.getNodeWebhookUrl('default');
                        const webhookData = this.getWorkflowStaticData('node');
                        const formHash = this.getNodeParameter('form');
                        const endpoint = `forms/${formHash}/webhooks.json`;
                        // Handshake key for webhook endpoint protection
                        webhookData.handshakeKey = (0, crypto_1.randomBytes)(20).toString('hex');
                        const body = {
                            url: webhookUrl,
                            handshakeKey: webhookData.handshakeKey,
                            metadata: true,
                        };
                        const result = yield GenericFunctions_1.wufooApiRequest.call(this, 'PUT', endpoint, body);
                        webhookData.webhookId = result.WebHookPutResult.Hash;
                        return true;
                    });
                },
                delete() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const webhookData = this.getWorkflowStaticData('node');
                        const formHash = this.getNodeParameter('form');
                        const endpoint = `forms/${formHash}/webhooks/${webhookData.webhookId}.json`;
                        try {
                            yield GenericFunctions_1.wufooApiRequest.call(this, 'DELETE', endpoint);
                        }
                        catch (error) {
                            return false;
                        }
                        delete webhookData.webhookId;
                        delete webhookData.handshakeKey;
                        return true;
                    });
                },
            },
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            const req = this.getRequestObject();
            const body = this.getBodyData();
            const webhookData = this.getWorkflowStaticData('node');
            const onlyAnswers = this.getNodeParameter('onlyAnswers');
            const entries = {};
            let returnObject = {};
            if (req.body.HandshakeKey !== webhookData.handshakeKey) {
                return {};
            }
            const fieldsObject = JSON.parse(req.body.FieldStructure);
            fieldsObject.Fields.map((field) => {
                // TODO
                // Handle docusign field
                if (field.Type === 'file') {
                    entries[field.Title] = req.body[`${field.ID}-url`];
                }
                else if (field.Type === 'address') {
                    const address = {};
                    for (const subfield of field.SubFields) {
                        address[subfield.Label] = body[subfield.ID];
                    }
                    entries[field.Title] = address;
                }
                else if (field.Type === 'checkbox') {
                    const responses = [];
                    for (const subfield of field.SubFields) {
                        if (body[subfield.ID] !== '') {
                            responses.push(body[subfield.ID]);
                        }
                    }
                    entries[field.Title] = responses;
                }
                else if (field.Type === 'likert') {
                    const likert = {};
                    for (const subfield of field.SubFields) {
                        likert[subfield.Label] = body[subfield.ID];
                    }
                    entries[field.Title] = likert;
                }
                else if (field.Type === 'shortname') {
                    const shortname = {};
                    for (const subfield of field.SubFields) {
                        shortname[subfield.Label] = body[subfield.ID];
                    }
                    entries[field.Title] = shortname;
                }
                else {
                    entries[field.Title] = req.body[field.ID];
                }
            });
            if (onlyAnswers === false) {
                returnObject = {
                    createdBy: req.body.CreatedBy,
                    entryId: req.body.EntryId,
                    dateCreated: req.body.DateCreated,
                    formId: req.body.FormId,
                    formStructure: JSON.parse(req.body.FormStructure),
                    fieldStructure: JSON.parse(req.body.FieldStructure),
                    entries,
                };
                return {
                    workflowData: [
                        this.helpers.returnJsonArray([returnObject]),
                    ],
                };
            }
            else {
                return {
                    workflowData: [
                        this.helpers.returnJsonArray(entries),
                    ],
                };
            }
        });
    }
}
exports.WufooTrigger = WufooTrigger;
