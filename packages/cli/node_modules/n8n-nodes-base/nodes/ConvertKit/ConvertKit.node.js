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
exports.ConvertKit = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const CustomFieldDescription_1 = require("./CustomFieldDescription");
const FormDescription_1 = require("./FormDescription");
const SequenceDescription_1 = require("./SequenceDescription");
const TagDescription_1 = require("./TagDescription");
const TagSubscriberDescription_1 = require("./TagSubscriberDescription");
class ConvertKit {
    constructor() {
        this.description = {
            displayName: 'ConvertKit',
            name: 'convertKit',
            icon: 'file:convertKit.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume ConvertKit API',
            defaults: {
                name: 'ConvertKit',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'convertKitApi',
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
                            name: 'Custom Field',
                            value: 'customField',
                        },
                        {
                            name: 'Form',
                            value: 'form',
                        },
                        {
                            name: 'Sequence',
                            value: 'sequence',
                        },
                        {
                            name: 'Tag',
                            value: 'tag',
                        },
                        {
                            name: 'Tag Subscriber',
                            value: 'tagSubscriber',
                        },
                    ],
                    default: 'form',
                },
                //--------------------
                // Field Description
                //--------------------
                ...CustomFieldDescription_1.customFieldOperations,
                ...CustomFieldDescription_1.customFieldFields,
                //--------------------
                // FormDescription
                //--------------------
                ...FormDescription_1.formOperations,
                ...FormDescription_1.formFields,
                //--------------------
                // Sequence Description
                //--------------------
                ...SequenceDescription_1.sequenceOperations,
                ...SequenceDescription_1.sequenceFields,
                //--------------------
                // Tag Description
                //--------------------
                ...TagDescription_1.tagOperations,
                ...TagDescription_1.tagFields,
                //--------------------
                // Tag Subscriber Description
                //--------------------
                ...TagSubscriberDescription_1.tagSubscriberOperations,
                ...TagSubscriberDescription_1.tagSubscriberFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the tags to display them to user so that he can
                // select them easily
                getTags() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { tags } = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', '/tags');
                        for (const tag of tags) {
                            const tagName = tag.name;
                            const tagId = tag.id;
                            returnData.push({
                                name: tagName,
                                value: tagId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the forms to display them to user so that he can
                // select them easily
                getForms() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { forms } = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', '/forms');
                        for (const form of forms) {
                            const formName = form.name;
                            const formId = form.id;
                            returnData.push({
                                name: formName,
                                value: formId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the sequences to display them to user so that he can
                // select them easily
                getSequences() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const { courses } = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', '/sequences');
                        for (const course of courses) {
                            const courseName = course.name;
                            const courseId = course.id;
                            returnData.push({
                                name: courseName,
                                value: courseId,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'customField') {
                        if (operation === 'create') {
                            const label = this.getNodeParameter('label', i);
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'POST', '/custom_fields', { label }, qs);
                        }
                        if (operation === 'delete') {
                            const id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'DELETE', `/custom_fields/${id}`);
                        }
                        if (operation === 'get') {
                            const id = this.getNodeParameter('id', i);
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', `/custom_fields/${id}`);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', `/custom_fields`);
                            responseData = responseData.custom_fields;
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                        if (operation === 'update') {
                            const id = this.getNodeParameter('id', i);
                            const label = this.getNodeParameter('label', i);
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'PUT', `/custom_fields/${id}`, { label });
                            responseData = { success: true };
                        }
                    }
                    if (resource === 'form') {
                        if (operation === 'addSubscriber') {
                            const email = this.getNodeParameter('email', i);
                            const formId = this.getNodeParameter('id', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                email,
                            };
                            if (additionalFields.firstName) {
                                body.first_name = additionalFields.firstName;
                            }
                            if (additionalFields.tags) {
                                body.tags = additionalFields.tags;
                            }
                            if (additionalFields.fieldsUi) {
                                const fieldValues = additionalFields.fieldsUi.fieldsValues;
                                if (fieldValues) {
                                    body.fields = {};
                                    for (const fieldValue of fieldValues) {
                                        //@ts-ignore
                                        body.fields[fieldValue.key] = fieldValue.value;
                                    }
                                }
                            }
                            const { subscription } = yield GenericFunctions_1.convertKitApiRequest.call(this, 'POST', `/forms/${formId}/subscribe`, body);
                            responseData = subscription;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', `/forms`);
                            responseData = responseData.forms;
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                        if (operation === 'getSubscriptions') {
                            const formId = this.getNodeParameter('id', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.subscriberState) {
                                qs.subscriber_state = additionalFields.subscriberState;
                            }
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', `/forms/${formId}/subscriptions`, {}, qs);
                            responseData = responseData.subscriptions;
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                    }
                    if (resource === 'sequence') {
                        if (operation === 'addSubscriber') {
                            const email = this.getNodeParameter('email', i);
                            const sequenceId = this.getNodeParameter('id', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                email,
                            };
                            if (additionalFields.firstName) {
                                body.first_name = additionalFields.firstName;
                            }
                            if (additionalFields.tags) {
                                body.tags = additionalFields.tags;
                            }
                            if (additionalFields.fieldsUi) {
                                const fieldValues = additionalFields.fieldsUi.fieldsValues;
                                if (fieldValues) {
                                    body.fields = {};
                                    for (const fieldValue of fieldValues) {
                                        //@ts-ignore
                                        body.fields[fieldValue.key] = fieldValue.value;
                                    }
                                }
                            }
                            const { subscription } = yield GenericFunctions_1.convertKitApiRequest.call(this, 'POST', `/sequences/${sequenceId}/subscribe`, body);
                            responseData = subscription;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', `/sequences`);
                            responseData = responseData.courses;
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                        if (operation === 'getSubscriptions') {
                            const sequenceId = this.getNodeParameter('id', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.subscriberState) {
                                qs.subscriber_state = additionalFields.subscriberState;
                            }
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', `/sequences/${sequenceId}/subscriptions`, {}, qs);
                            responseData = responseData.subscriptions;
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                    }
                    if (resource === 'tag') {
                        if (operation === 'create') {
                            const names = this.getNodeParameter('name', i).split(',').map((e) => ({ name: e }));
                            const body = {
                                tag: names,
                            };
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'POST', '/tags', body);
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', `/tags`);
                            responseData = responseData.tags;
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                    }
                    if (resource === 'tagSubscriber') {
                        if (operation === 'add') {
                            const tagId = this.getNodeParameter('tagId', i);
                            const email = this.getNodeParameter('email', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                email,
                            };
                            if (additionalFields.firstName) {
                                body.first_name = additionalFields.firstName;
                            }
                            if (additionalFields.fieldsUi) {
                                const fieldValues = additionalFields.fieldsUi.fieldsValues;
                                if (fieldValues) {
                                    body.fields = {};
                                    for (const fieldValue of fieldValues) {
                                        //@ts-ignore
                                        body.fields[fieldValue.key] = fieldValue.value;
                                    }
                                }
                            }
                            const { subscription } = yield GenericFunctions_1.convertKitApiRequest.call(this, 'POST', `/tags/${tagId}/subscribe`, body);
                            responseData = subscription;
                        }
                        if (operation === 'getAll') {
                            const tagId = this.getNodeParameter('tagId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'GET', `/tags/${tagId}/subscriptions`);
                            responseData = responseData.subscriptions;
                            if (!returnAll) {
                                const limit = this.getNodeParameter('limit', i);
                                responseData = responseData.slice(0, limit);
                            }
                        }
                        if (operation === 'delete') {
                            const tagId = this.getNodeParameter('tagId', i);
                            const email = this.getNodeParameter('email', i);
                            responseData = yield GenericFunctions_1.convertKitApiRequest.call(this, 'POST', `/tags/${tagId}>/unsubscribe`, { email });
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else if (responseData !== undefined) {
                        returnData.push(responseData);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.ConvertKit = ConvertKit;
