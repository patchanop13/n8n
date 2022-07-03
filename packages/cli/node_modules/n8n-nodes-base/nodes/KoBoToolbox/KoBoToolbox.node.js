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
exports.KoBoToolbox = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const FormDescription_1 = require("./FormDescription");
const SubmissionDescription_1 = require("./SubmissionDescription");
const HookDescription_1 = require("./HookDescription");
class KoBoToolbox {
    constructor() {
        this.description = {
            displayName: 'KoBoToolbox',
            name: 'koBoToolbox',
            icon: 'file:koBoToolbox.svg',
            group: ['transform'],
            version: 1,
            description: 'Work with KoBoToolbox forms and submissions',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            defaults: {
                name: 'KoBoToolbox',
                color: '#64C0FF',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'koBoToolboxApi',
                    required: true,
                    testedBy: 'koBoToolboxApiCredentialTest',
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
                            name: 'Form',
                            value: 'form',
                        },
                        {
                            name: 'Hook',
                            value: 'hook',
                        },
                        {
                            name: 'Submission',
                            value: 'submission',
                        },
                    ],
                    default: 'submission',
                    required: true,
                },
                ...FormDescription_1.formOperations,
                ...FormDescription_1.formFields,
                ...HookDescription_1.hookOperations,
                ...HookDescription_1.hookFields,
                ...SubmissionDescription_1.submissionOperations,
                ...SubmissionDescription_1.submissionFields,
            ],
        };
        this.methods = {
            credentialTest: {
                koBoToolboxApiCredentialTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const credentials = credential.data;
                        try {
                            const response = yield this.helpers.request({
                                url: `${credentials.URL}/api/v2/assets/hash`,
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': `Token ${credentials.token}`,
                                },
                                json: true,
                            });
                            if (response.hash) {
                                return {
                                    status: 'OK',
                                    message: 'Connection successful!',
                                };
                            }
                            else {
                                return {
                                    status: 'Error',
                                    message: `Credentials are not valid. Response: ${response.detail}`,
                                };
                            }
                        }
                        catch (err) {
                            return {
                                status: 'Error',
                                message: `Credentials validation failed: ${err.message}`,
                            };
                        }
                    });
                },
            },
            loadOptions: {
                loadForms: GenericFunctions_1.loadForms,
            },
        };
    }
    execute() {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line:no-any
            let responseData;
            // tslint:disable-next-line:no-any
            let returnData = [];
            const binaryItems = [];
            const items = this.getInputData();
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                if (resource === 'form') {
                    // *********************************************************************
                    //                             Form
                    // *********************************************************************
                    if (operation === 'get') {
                        // ----------------------------------
                        //          Form: get
                        // ----------------------------------
                        const formId = this.getNodeParameter('formId', i);
                        responseData = [yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                                url: `/api/v2/assets/${formId}`,
                            })];
                    }
                    if (operation === 'getAll') {
                        // ----------------------------------
                        //          Form: getAll
                        // ----------------------------------
                        const formQueryOptions = this.getNodeParameter('options', i);
                        const formFilterOptions = this.getNodeParameter('filters', i);
                        responseData = yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                            url: '/api/v2/assets/',
                            qs: Object.assign(Object.assign({ limit: this.getNodeParameter('limit', i, 1000) }, (formFilterOptions.filter && { q: formFilterOptions.filter })), (((_b = (_a = formQueryOptions === null || formQueryOptions === void 0 ? void 0 : formQueryOptions.sort) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.ordering) && { ordering: (((_d = (_c = formQueryOptions === null || formQueryOptions === void 0 ? void 0 : formQueryOptions.sort) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.descending) ? '-' : '') + ((_f = (_e = formQueryOptions === null || formQueryOptions === void 0 ? void 0 : formQueryOptions.sort) === null || _e === void 0 ? void 0 : _e.value) === null || _f === void 0 ? void 0 : _f.ordering) })),
                            scroll: this.getNodeParameter('returnAll', i),
                        });
                    }
                }
                if (resource === 'submission') {
                    // *********************************************************************
                    //                             Submissions
                    // *********************************************************************
                    const formId = this.getNodeParameter('formId', i);
                    if (operation === 'getAll') {
                        // ----------------------------------
                        //          Submissions: getAll
                        // ----------------------------------
                        const submissionQueryOptions = this.getNodeParameter('options', i);
                        const filterJson = this.getNodeParameter('filterJson', i, null);
                        responseData = yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                            url: `/api/v2/assets/${formId}/data/`,
                            qs: Object.assign(Object.assign(Object.assign({ limit: this.getNodeParameter('limit', i, 1000) }, (filterJson && { query: filterJson })), (submissionQueryOptions.sort && { sort: submissionQueryOptions.sort })), (submissionQueryOptions.fields && { fields: JSON.stringify((0, GenericFunctions_1.parseStringList)(submissionQueryOptions.fields)) })),
                            scroll: this.getNodeParameter('returnAll', i),
                        });
                        if (submissionQueryOptions.reformat) {
                            responseData = responseData.map((submission) => {
                                return (0, GenericFunctions_1.formatSubmission)(submission, (0, GenericFunctions_1.parseStringList)(submissionQueryOptions.selectMask), (0, GenericFunctions_1.parseStringList)(submissionQueryOptions.numberMask));
                            });
                        }
                        if (submissionQueryOptions.download) {
                            // Download related attachments
                            for (const submission of responseData) {
                                binaryItems.push(yield GenericFunctions_1.downloadAttachments.call(this, submission, submissionQueryOptions));
                            }
                        }
                    }
                    if (operation === 'get') {
                        // ----------------------------------
                        //          Submissions: get
                        // ----------------------------------
                        const submissionId = this.getNodeParameter('submissionId', i);
                        const options = this.getNodeParameter('options', i);
                        responseData = [yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                                url: `/api/v2/assets/${formId}/data/${submissionId}`,
                                qs: Object.assign({}, (options.fields && { fields: JSON.stringify((0, GenericFunctions_1.parseStringList)(options.fields)) })),
                            })];
                        if (options.reformat) {
                            responseData = responseData.map((submission) => {
                                return (0, GenericFunctions_1.formatSubmission)(submission, (0, GenericFunctions_1.parseStringList)(options.selectMask), (0, GenericFunctions_1.parseStringList)(options.numberMask));
                            });
                        }
                        if (options.download) {
                            // Download related attachments
                            for (const submission of responseData) {
                                binaryItems.push(yield GenericFunctions_1.downloadAttachments.call(this, submission, options));
                            }
                        }
                    }
                    if (operation === 'delete') {
                        // ----------------------------------
                        //          Submissions: delete
                        // ----------------------------------
                        const id = this.getNodeParameter('submissionId', i);
                        yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                            method: 'DELETE',
                            url: `/api/v2/assets/${formId}/data/${id}`,
                        });
                        responseData = [{
                                success: true,
                            }];
                    }
                    if (operation === 'getValidation') {
                        // ----------------------------------
                        //          Submissions: getValidation
                        // ----------------------------------
                        const submissionId = this.getNodeParameter('submissionId', i);
                        responseData = [yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                                url: `/api/v2/assets/${formId}/data/${submissionId}/validation_status/`,
                            })];
                    }
                    if (operation === 'setValidation') {
                        // ----------------------------------
                        //          Submissions: setValidation
                        // ----------------------------------
                        const submissionId = this.getNodeParameter('submissionId', i);
                        const status = this.getNodeParameter('validationStatus', i);
                        responseData = [yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                                method: 'PATCH',
                                url: `/api/v2/assets/${formId}/data/${submissionId}/validation_status/`,
                                body: {
                                    'validation_status.uid': status,
                                },
                            })];
                    }
                }
                if (resource === 'hook') {
                    const formId = this.getNodeParameter('formId', i);
                    // *********************************************************************
                    //                             Hook
                    // *********************************************************************
                    if (operation === 'getAll') {
                        // ----------------------------------
                        //          Hook: getAll
                        // ----------------------------------
                        responseData = yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                            url: `/api/v2/assets/${formId}/hooks/`,
                            qs: {
                                limit: this.getNodeParameter('limit', i, 1000),
                            },
                            scroll: this.getNodeParameter('returnAll', i),
                        });
                    }
                    if (operation === 'get') {
                        // ----------------------------------
                        //          Hook: get
                        // ----------------------------------
                        const hookId = this.getNodeParameter('hookId', i);
                        responseData = [yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                                url: `/api/v2/assets/${formId}/hooks/${hookId}`,
                            })];
                    }
                    if (operation === 'retryAll') {
                        // ----------------------------------
                        //          Hook: retryAll
                        // ----------------------------------
                        const hookId = this.getNodeParameter('hookId', i);
                        responseData = [yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                                method: 'PATCH',
                                url: `/api/v2/assets/${formId}/hooks/${hookId}/retry/`,
                            })];
                    }
                    if (operation === 'getLogs') {
                        // ----------------------------------
                        //          Hook: getLogs
                        // ----------------------------------
                        const hookId = this.getNodeParameter('hookId', i);
                        responseData = yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                            url: `/api/v2/assets/${formId}/hooks/${hookId}/logs/`,
                            qs: {
                                start: this.getNodeParameter('start', i, 0),
                                limit: this.getNodeParameter('limit', i, 1000),
                            },
                            scroll: this.getNodeParameter('returnAll', i),
                        });
                    }
                    if (operation === 'retryOne') {
                        // ----------------------------------
                        //          Hook: retryOne
                        // ----------------------------------
                        const hookId = this.getNodeParameter('hookId', i);
                        const logId = this.getNodeParameter('logId', i);
                        responseData = [yield GenericFunctions_1.koBoToolboxApiRequest.call(this, {
                                url: `/api/v2/assets/${formId}/hooks/${hookId}/logs/${logId}/retry/`,
                            })];
                    }
                }
                returnData = returnData.concat(responseData);
            }
            // Map data to n8n data
            return binaryItems.length > 0
                ? [binaryItems]
                : [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.KoBoToolbox = KoBoToolbox;
