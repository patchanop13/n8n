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
exports.GoogleDriveTrigger = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_1 = __importDefault(require("moment"));
class GoogleDriveTrigger {
    constructor() {
        this.description = {
            displayName: 'Google Drive Trigger',
            name: 'googleDriveTrigger',
            icon: 'file:googleDrive.svg',
            group: ['trigger'],
            version: 1,
            description: 'Starts the workflow when Google Drive events occur',
            subtitle: '={{$parameter["event"]}}',
            defaults: {
                name: 'Google Drive Trigger',
            },
            credentials: [
                {
                    name: 'googleApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'serviceAccount',
                            ],
                        },
                    },
                },
                {
                    name: 'googleDriveOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
            ],
            polling: true,
            inputs: [],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Credential Type',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Service Account',
                            value: 'serviceAccount',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'oAuth2',
                },
                {
                    displayName: 'Trigger On',
                    name: 'triggerOn',
                    type: 'options',
                    required: true,
                    default: '',
                    options: [
                        {
                            name: 'Changes to a Specific File',
                            value: 'specificFile',
                        },
                        {
                            name: 'Changes Involving a Specific Folder',
                            value: 'specificFolder',
                        },
                        // {
                        // 	name: 'Changes To Any File/Folder',
                        // 	value: 'anyFileFolder',
                        // },
                    ],
                },
                {
                    displayName: 'File URL or ID',
                    name: 'fileToWatch',
                    type: 'string',
                    displayOptions: {
                        show: {
                            triggerOn: [
                                'specificFile',
                            ],
                        },
                    },
                    default: '',
                    description: 'The address of this file when you view it in your browser (or just the ID contained within the URL)',
                    required: true,
                },
                {
                    displayName: 'Watch For',
                    name: 'event',
                    type: 'options',
                    displayOptions: {
                        show: {
                            triggerOn: [
                                'specificFile',
                            ],
                        },
                    },
                    required: true,
                    default: 'fileUpdated',
                    options: [
                        {
                            name: 'File Updated',
                            value: 'fileUpdated',
                        },
                    ],
                    description: 'When to trigger this node',
                },
                {
                    displayName: 'Folder URL or ID',
                    name: 'folderToWatch',
                    type: 'string',
                    displayOptions: {
                        show: {
                            triggerOn: [
                                'specificFolder',
                            ],
                        },
                    },
                    default: '',
                    description: 'The address of this folder when you view it in your browser (or just the ID contained within the URL)',
                    required: true,
                },
                {
                    displayName: 'Watch For',
                    name: 'event',
                    type: 'options',
                    displayOptions: {
                        show: {
                            triggerOn: [
                                'specificFolder',
                            ],
                        },
                    },
                    required: true,
                    default: '',
                    options: [
                        {
                            name: 'File Created',
                            value: 'fileCreated',
                            description: 'When a file is created in the watched folder',
                        },
                        {
                            name: 'File Updated',
                            value: 'fileUpdated',
                            description: 'When a file is updated in the watched folder',
                        },
                        {
                            name: 'Folder Created',
                            value: 'folderCreated',
                            description: 'When a folder is created in the watched folder',
                        },
                        {
                            name: 'Folder Updated',
                            value: 'folderUpdated',
                            description: 'When a folder is updated in the watched folder',
                        },
                        {
                            name: 'Watch Folder Updated',
                            value: 'watchFolderUpdated',
                            description: 'When the watched folder itself is modified',
                        },
                    ],
                },
                {
                    displayName: 'Changes within subfolders won\'t trigger this node',
                    name: 'asas',
                    type: 'notice',
                    displayOptions: {
                        show: {
                            triggerOn: [
                                'specificFolder',
                            ],
                        },
                        hide: {
                            event: [
                                'watchFolderUpdated',
                            ],
                        },
                    },
                    default: '',
                },
                {
                    // eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
                    displayName: 'Drive To Watch',
                    name: 'driveToWatch',
                    type: 'options',
                    displayOptions: {
                        show: {
                            triggerOn: [
                                'anyFileFolder',
                            ],
                        },
                    },
                    typeOptions: {
                        loadOptionsMethod: 'getDrives',
                    },
                    default: 'root',
                    required: true,
                    description: 'The drive to monitor. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                },
                {
                    displayName: 'Watch For',
                    name: 'event',
                    type: 'options',
                    displayOptions: {
                        show: {
                            triggerOn: [
                                'anyFileFolder',
                            ],
                        },
                    },
                    required: true,
                    default: 'fileCreated',
                    options: [
                        {
                            name: 'File Created',
                            value: 'fileCreated',
                            description: 'When a file is created in the watched drive',
                        },
                        {
                            name: 'File Updated',
                            value: 'fileUpdated',
                            description: 'When a file is updated in the watched drive',
                        },
                        {
                            name: 'Folder Created',
                            value: 'folderCreated',
                            description: 'When a folder is created in the watched drive',
                        },
                        {
                            name: 'Folder Updated',
                            value: 'folderUpdated',
                            description: 'When a folder is updated in the watched drive',
                        },
                    ],
                    description: 'When to trigger this node',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    displayOptions: {
                        show: {
                            event: [
                                'fileCreated',
                                'fileUpdated',
                            ],
                        },
                        hide: {
                            triggerOn: [
                                'specificFile',
                            ],
                        },
                    },
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'File Type',
                            name: 'fileType',
                            type: 'options',
                            options: [
                                {
                                    name: '[All]',
                                    value: 'all',
                                },
                                {
                                    name: 'Audio',
                                    value: 'application/vnd.google-apps.audio',
                                },
                                {
                                    name: 'Google Docs',
                                    value: 'application/vnd.google-apps.document',
                                },
                                {
                                    name: 'Google Drawings',
                                    value: 'application/vnd.google-apps.drawing',
                                },
                                {
                                    name: 'Google Slides',
                                    value: 'application/vnd.google-apps.presentation',
                                },
                                {
                                    name: 'Google Spreadsheets',
                                    value: 'application/vnd.google-apps.spreadsheet',
                                },
                                {
                                    name: 'Photos and Images',
                                    value: 'application/vnd.google-apps.photo',
                                },
                                {
                                    name: 'Videos',
                                    value: 'application/vnd.google-apps.video',
                                },
                            ],
                            default: 'all',
                            description: 'Triggers only when the file is this type',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the calendars to display them to user so that he can
                // select them easily
                getDrives() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const drives = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'drives', 'GET', `/drive/v3/drives`);
                        returnData.push({
                            name: 'Root',
                            value: 'root',
                        });
                        for (const drive of drives) {
                            returnData.push({
                                name: drive.name,
                                value: drive.id,
                            });
                        }
                        return returnData;
                    });
                },
            },
        };
    }
    poll() {
        return __awaiter(this, void 0, void 0, function* () {
            const triggerOn = this.getNodeParameter('triggerOn');
            const event = this.getNodeParameter('event');
            const webhookData = this.getWorkflowStaticData('node');
            const options = this.getNodeParameter('options', {});
            const qs = {};
            const now = (0, moment_1.default)().utc().format();
            const startDate = webhookData.lastTimeChecked || now;
            const endDate = now;
            const query = [
                'trashed = false',
            ];
            if (triggerOn === 'specificFolder' && event !== 'watchFolderUpdated') {
                const folderToWatch = (0, GenericFunctions_1.extractId)(this.getNodeParameter('folderToWatch'));
                query.push(`'${folderToWatch}' in parents`);
            }
            // if (triggerOn === 'anyFileFolder') {
            // 	const driveToWatch = this.getNodeParameter('driveToWatch');
            // 	query.push(`'${driveToWatch}' in parents`);
            // }
            if (event.startsWith('file')) {
                query.push(`mimeType != 'application/vnd.google-apps.folder'`);
            }
            else {
                query.push(`mimeType = 'application/vnd.google-apps.folder'`);
            }
            if (options.fileType && options.fileType !== 'all') {
                query.push(`mimeType = '${options.fileType}'`);
            }
            if (this.getMode() !== 'manual') {
                if (event.includes('Created')) {
                    query.push(`createdTime > '${startDate}'`);
                }
                else {
                    query.push(`modifiedTime > '${startDate}'`);
                }
            }
            qs.q = query.join(' AND ');
            qs.fields = 'nextPageToken, files(*)';
            let files;
            if (this.getMode() === 'manual') {
                qs.pageSize = 1;
                files = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/drive/v3/files`, {}, qs);
                files = files.files;
            }
            else {
                files = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'files', 'GET', `/drive/v3/files`, {}, qs);
            }
            if (triggerOn === 'specificFile' && this.getMode() !== 'manual') {
                const fileToWatch = (0, GenericFunctions_1.extractId)(this.getNodeParameter('fileToWatch'));
                files = files.filter((file) => file.id === fileToWatch);
            }
            if (triggerOn === 'specificFolder' && event === 'watchFolderUpdated' && this.getMode() !== 'manual') {
                const folderToWatch = (0, GenericFunctions_1.extractId)(this.getNodeParameter('folderToWatch'));
                files = files.filter((file) => file.id === folderToWatch);
            }
            webhookData.lastTimeChecked = endDate;
            if (Array.isArray(files) && files.length) {
                return [this.helpers.returnJsonArray(files)];
            }
            if (this.getMode() === 'manual') {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: 'No data with the current filter could be found' });
            }
            return null;
        });
    }
}
exports.GoogleDriveTrigger = GoogleDriveTrigger;
