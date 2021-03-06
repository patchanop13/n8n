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
exports.AwsTranscribe = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class AwsTranscribe {
    constructor() {
        this.description = {
            displayName: 'AWS Transcribe',
            name: 'awsTranscribe',
            icon: 'file:transcribe.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Sends data to AWS Transcribe',
            defaults: {
                name: 'AWS Transcribe',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'aws',
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
                            name: 'Transcription Job',
                            value: 'transcriptionJob',
                        },
                    ],
                    default: 'transcriptionJob',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a transcription job',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete a transcription job',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get a transcription job',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Get all transcription jobs',
                        },
                    ],
                    default: 'create',
                },
                {
                    displayName: 'Job Name',
                    name: 'transcriptionJobName',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: [
                                'transcriptionJob',
                            ],
                            operation: [
                                'create',
                                'get',
                                'delete',
                            ],
                        },
                    },
                    description: 'The name of the job',
                },
                {
                    displayName: 'Media File URI',
                    name: 'mediaFileUri',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: [
                                'transcriptionJob',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    description: 'The S3 object location of the input media file',
                },
                {
                    displayName: 'Detect Language',
                    name: 'detectLanguage',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            resource: [
                                'transcriptionJob',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to set this field to true to enable automatic language identification',
                },
                {
                    displayName: 'Language',
                    name: 'languageCode',
                    type: 'options',
                    options: [
                        {
                            name: 'American English',
                            value: 'en-US',
                        },
                        {
                            name: 'British English',
                            value: 'en-GB',
                        },
                        {
                            name: 'German',
                            value: 'de-DE',
                        },
                        {
                            name: 'Indian English',
                            value: 'en-IN',
                        },
                        {
                            name: 'Irish English',
                            value: 'en-IE',
                        },
                        {
                            name: 'Russian',
                            value: 'ru-RU',
                        },
                        {
                            name: 'Spanish',
                            value: 'es-ES',
                        },
                    ],
                    displayOptions: {
                        show: {
                            resource: [
                                'transcriptionJob',
                            ],
                            operation: [
                                'create',
                            ],
                            detectLanguage: [
                                false,
                            ],
                        },
                    },
                    default: 'en-US',
                    description: 'Language used in the input media file',
                },
                // ----------------------------------
                //     Transcription Job Settings
                // ----------------------------------
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    displayOptions: {
                        show: {
                            operation: [
                                'create',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Channel Identification',
                            name: 'channelIdentification',
                            type: 'boolean',
                            default: false,
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                            description: 'Instructs Amazon Transcribe to process each audiochannel separately and then merge the transcription output of each channel into a single transcription. You can\'t set both Max Speaker Labels and Channel Identification in the same request. If you set both, your request returns a BadRequestException.',
                        },
                        {
                            displayName: 'Max Alternatives',
                            name: 'maxAlternatives',
                            type: 'number',
                            default: 2,
                            typeOptions: {
                                minValue: 2,
                                maxValue: 10,
                            },
                            description: 'The number of alternative transcriptions that the service should return',
                        },
                        {
                            displayName: 'Max Speaker Labels',
                            name: 'maxSpeakerLabels',
                            type: 'number',
                            default: 2,
                            typeOptions: {
                                minValue: 2,
                                maxValue: 10,
                            },
                            description: 'The maximum number of speakers to identify in the input audio. If there are more speakers in the audio than this number, multiple speakers are identified as a single speaker.',
                        },
                        {
                            displayName: 'Vocabulary Name',
                            name: 'vocabularyName',
                            type: 'string',
                            default: '',
                            description: 'Name of vocabulary to use when processing the transcription job',
                        },
                        {
                            displayName: 'Vocabulary Filter Name',
                            name: 'vocabularyFilterName',
                            type: 'string',
                            default: '',
                            description: 'The name of the vocabulary filter to use when transcribing the audio. The filter that you specify must have the same language code as the transcription job.',
                        },
                        {
                            displayName: 'Vocabulary Filter Method',
                            name: 'vocabularyFilterMethod',
                            type: 'options',
                            options: [
                                {
                                    name: 'Remove',
                                    value: 'remove',
                                },
                                {
                                    name: 'Mask',
                                    value: 'mask',
                                },
                                {
                                    name: 'Tag',
                                    value: 'tag',
                                },
                            ],
                            default: 'remove',
                            description: '<p>Set to mask to remove filtered text from the transcript and replace it with three asterisks ("***") as placeholder text.</p><p>Set to remove to remove filtered text from the transcript without using placeholder text. Set to tag to mark the word in the transcription output that matches the vocabulary filter. When you set the filter method to tag, the words matching your vocabulary filter are not masked or removed.</p>',
                        },
                    ],
                },
                {
                    displayName: 'Return Transcript',
                    name: 'returnTranscript',
                    type: 'boolean',
                    default: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'transcriptionJob',
                            ],
                            operation: [
                                'get',
                            ],
                        },
                    },
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                    description: 'By default, the response only contains metadata about the transcript. Enable this option to retrieve the transcript instead.',
                },
                {
                    displayName: 'Simplify',
                    name: 'simple',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            resource: [
                                'transcriptionJob',
                            ],
                            operation: [
                                'get',
                            ],
                            returnTranscript: [
                                true,
                            ],
                        },
                    },
                    default: true,
                    description: 'Whether to return a simplified version of the response instead of the raw data',
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            resource: [
                                'transcriptionJob',
                            ],
                            operation: [
                                'getAll',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to return all results or only up to a given limit',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    default: 20,
                    typeOptions: {
                        minValue: 1,
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'transcriptionJob',
                            ],
                            operation: [
                                'getAll',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Filters',
                    name: 'filters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'transcriptionJob',
                            ],
                            operation: [
                                'getAll',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Job Name Contains',
                            name: 'jobNameContains',
                            type: 'string',
                            description: 'Return only transcription jobs whose name contains the specified string',
                            default: '',
                        },
                        {
                            displayName: 'Status',
                            name: 'status',
                            type: 'options',
                            options: [
                                {
                                    name: 'Completed',
                                    value: 'COMPLETED',
                                },
                                {
                                    name: 'Failed',
                                    value: 'FAILED',
                                },
                                {
                                    name: 'In Progress',
                                    value: 'IN_PROGRESS',
                                },
                                {
                                    name: 'Queued',
                                    value: 'QUEUED',
                                },
                            ],
                            description: 'Return only transcription jobs with the specified status',
                            default: 'COMPLETED',
                        },
                    ],
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'transcriptionJob') {
                        //https://docs.aws.amazon.com/comprehend/latest/dg/API_DetectDominantLanguage.html
                        if (operation === 'create') {
                            const transcriptionJobName = this.getNodeParameter('transcriptionJobName', i);
                            const mediaFileUri = this.getNodeParameter('mediaFileUri', i);
                            const detectLang = this.getNodeParameter('detectLanguage', i);
                            const options = this.getNodeParameter('options', i, {});
                            const body = {
                                TranscriptionJobName: transcriptionJobName,
                                Media: {
                                    MediaFileUri: mediaFileUri,
                                },
                                Settings: {},
                            };
                            if (detectLang) {
                                body.IdentifyLanguage = detectLang;
                            }
                            else {
                                body.LanguageCode = this.getNodeParameter('languageCode', i);
                            }
                            if (options.channelIdentification) {
                                Object.assign(body.Settings, { ChannelIdentification: options.channelIdentification });
                            }
                            if (options.maxAlternatives) {
                                Object.assign(body.Settings, {
                                    ShowAlternatives: true,
                                    MaxAlternatives: options.maxAlternatives,
                                });
                            }
                            if (options.maxSpeakerLabels) {
                                Object.assign(body.Settings, {
                                    ShowSpeakerLabels: true,
                                    MaxSpeakerLabels: options.maxSpeakerLabels,
                                });
                            }
                            if (options.vocabularyName) {
                                Object.assign(body.Settings, {
                                    VocabularyName: options.vocabularyName,
                                });
                            }
                            if (options.vocabularyFilterName) {
                                Object.assign(body.Settings, {
                                    VocabularyFilterName: options.vocabularyFilterName,
                                });
                            }
                            if (options.vocabularyFilterMethod) {
                                Object.assign(body.Settings, {
                                    VocabularyFilterMethod: options.vocabularyFilterMethod,
                                });
                            }
                            const action = 'Transcribe.StartTranscriptionJob';
                            responseData = yield GenericFunctions_1.awsApiRequestREST.call(this, 'transcribe', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' });
                            responseData = responseData.TranscriptionJob;
                        }
                        //https://docs.aws.amazon.com/transcribe/latest/dg/API_DeleteTranscriptionJob.html
                        if (operation === 'delete') {
                            const transcriptionJobName = this.getNodeParameter('transcriptionJobName', i);
                            const body = {
                                TranscriptionJobName: transcriptionJobName,
                            };
                            const action = 'Transcribe.DeleteTranscriptionJob';
                            responseData = yield GenericFunctions_1.awsApiRequestREST.call(this, 'transcribe', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' });
                            responseData = { success: true };
                        }
                        //https://docs.aws.amazon.com/transcribe/latest/dg/API_GetTranscriptionJob.html
                        if (operation === 'get') {
                            const transcriptionJobName = this.getNodeParameter('transcriptionJobName', i);
                            const resolve = this.getNodeParameter('returnTranscript', 0);
                            const body = {
                                TranscriptionJobName: transcriptionJobName,
                            };
                            const action = 'Transcribe.GetTranscriptionJob';
                            responseData = yield GenericFunctions_1.awsApiRequestREST.call(this, 'transcribe', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' });
                            responseData = responseData.TranscriptionJob;
                            if (resolve === true && responseData.TranscriptionJobStatus === 'COMPLETED') {
                                responseData = yield this.helpers.request({ method: 'GET', uri: responseData.Transcript.TranscriptFileUri, json: true });
                                const simple = this.getNodeParameter('simple', 0);
                                if (simple === true) {
                                    responseData = { transcript: responseData.results.transcripts.map((data) => data.transcript).join(' ') };
                                }
                            }
                        }
                        //https://docs.aws.amazon.com/transcribe/latest/dg/API_ListTranscriptionJobs.html
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const filters = this.getNodeParameter('filters', i);
                            const action = 'Transcribe.ListTranscriptionJobs';
                            const body = {};
                            if (filters.status) {
                                body['Status'] = filters.status;
                            }
                            if (filters.jobNameContains) {
                                body['JobNameContains'] = filters.jobNameContains;
                            }
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.awsApiRequestRESTAllItems.call(this, 'TranscriptionJobSummaries', 'transcribe', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' });
                            }
                            else {
                                const limit = this.getNodeParameter('limit', i);
                                body['MaxResults'] = limit;
                                responseData = yield GenericFunctions_1.awsApiRequestREST.call(this, 'transcribe', 'POST', '', JSON.stringify(body), { 'x-amz-target': action, 'Content-Type': 'application/x-amz-json-1.1' });
                                responseData = responseData.TranscriptionJobSummaries;
                            }
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
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
exports.AwsTranscribe = AwsTranscribe;
