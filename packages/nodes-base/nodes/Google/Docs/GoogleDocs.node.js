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
exports.GoogleDocs = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const DocumentDescription_1 = require("./DocumentDescription");
class GoogleDocs {
    constructor() {
        this.description = {
            displayName: 'Google Docs',
            name: 'googleDocs',
            icon: 'file:googleDocs.svg',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Google Docs API.',
            defaults: {
                name: 'Google Docs',
            },
            inputs: ['main'],
            outputs: ['main'],
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
                    name: 'googleDocsOAuth2Api',
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
            properties: [
                {
                    displayName: 'Authentication',
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
                    default: 'serviceAccount',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Document',
                            value: 'document',
                        },
                    ],
                    default: 'document',
                },
                ...DocumentDescription_1.documentOperations,
                ...DocumentDescription_1.documentFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the drives to display them to user so that he can
                // select them easily
                getDrives() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [
                            {
                                name: 'My Drive',
                                value: 'myDrive',
                            },
                            {
                                name: 'Shared with Me',
                                value: 'sharedWithMe',
                            },
                        ];
                        let drives;
                        try {
                            drives = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'drives', 'GET', '', {}, {}, 'https://www.googleapis.com/drive/v3/drives');
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { message: 'Error in loading Drives' });
                        }
                        for (const drive of drives) {
                            returnData.push({
                                name: drive.name,
                                value: drive.id,
                            });
                        }
                        return returnData;
                    });
                },
                getFolders() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [
                            {
                                name: '/',
                                value: 'default',
                            },
                        ];
                        const driveId = this.getNodeParameter('driveId');
                        const qs = Object.assign({ q: `mimeType = \'application/vnd.google-apps.folder\' ${driveId === 'sharedWithMe' ? 'and sharedWithMe = true' : ' and \'root\' in parents'}` }, (driveId && driveId !== 'myDrive' && driveId !== 'sharedWithMe') ? { driveId } : {});
                        let folders;
                        try {
                            folders = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'files', 'GET', '', {}, qs, 'https://www.googleapis.com/drive/v3/files');
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { message: 'Error in loading Folders' });
                        }
                        for (const folder of folders) {
                            returnData.push({
                                name: folder.name,
                                value: folder.id,
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
            const length = items.length;
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'document') {
                        if (operation === 'create') {
                            // https://developers.google.com/docs/api/reference/rest/v1/documents/create
                            const folderId = this.getNodeParameter('folderId', i);
                            const body = Object.assign({ name: this.getNodeParameter('title', i), mimeType: 'application/vnd.google-apps.document' }, (folderId && folderId !== 'default') ? { parents: [folderId] } : {});
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', '', body, {}, 'https://www.googleapis.com/drive/v3/files');
                        }
                        else if (operation === 'get') {
                            // https://developers.google.com/docs/api/reference/rest/v1/documents/get
                            const documentURL = this.getNodeParameter('documentURL', i);
                            const simple = this.getNodeParameter('simple', i);
                            let documentId = (0, GenericFunctions_1.extractID)(documentURL);
                            if (!documentId) {
                                documentId = documentURL;
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/documents/${documentId}`);
                            if (simple) {
                                const content = responseData.body.content
                                    .reduce((arr, contentItem) => {
                                    if (contentItem && contentItem.paragraph) {
                                        const texts = contentItem.paragraph.elements
                                            .map(element => {
                                            if (element && element.textRun) {
                                                return element.textRun.content;
                                            }
                                        });
                                        arr = [...arr, ...texts];
                                    }
                                    return arr;
                                }, [])
                                    .join('');
                                responseData = {
                                    documentId,
                                    content,
                                };
                            }
                        }
                        else if (operation === 'update') {
                            // https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate
                            const documentURL = this.getNodeParameter('documentURL', i);
                            let documentId = (0, GenericFunctions_1.extractID)(documentURL);
                            const simple = this.getNodeParameter('simple', i);
                            const actionsUi = this.getNodeParameter('actionsUi', i);
                            const { writeControlObject } = this.getNodeParameter('updateFields', i);
                            if (!documentId) {
                                documentId = documentURL;
                            }
                            const body = {
                                requests: [],
                            };
                            if ((0, GenericFunctions_1.hasKeys)(writeControlObject)) {
                                const { control, value } = writeControlObject;
                                body.writeControl = {
                                    [control]: value,
                                };
                            }
                            if (actionsUi) {
                                let requestBody;
                                actionsUi.actionFields.forEach(actionField => {
                                    const { action, object } = actionField;
                                    if (object === 'positionedObject') {
                                        if (action === 'delete') {
                                            requestBody = {
                                                objectId: actionField.objectId,
                                            };
                                        }
                                    }
                                    else if (object === 'pageBreak') {
                                        if (action === 'insert') {
                                            const { insertSegment, segmentId, locationChoice, index } = actionField;
                                            requestBody = {
                                                [locationChoice]: Object.assign({ segmentId: (insertSegment !== 'body') ? segmentId : '' }, (locationChoice === 'location') ? { index } : {}),
                                            };
                                        }
                                    }
                                    else if (object === 'table') {
                                        if (action === 'insert') {
                                            const { rows, columns, insertSegment, locationChoice, segmentId, index } = actionField;
                                            requestBody = {
                                                rows,
                                                columns,
                                                [locationChoice]: Object.assign({ segmentId: (insertSegment !== 'body') ? segmentId : '' }, (locationChoice === 'location') ? { index } : {}),
                                            };
                                        }
                                    }
                                    else if (object === 'footer') {
                                        if (action === 'create') {
                                            const { insertSegment, locationChoice, segmentId, index } = actionField;
                                            requestBody = {
                                                type: 'DEFAULT',
                                                sectionBreakLocation: Object.assign({ segmentId: (insertSegment !== 'body') ? segmentId : '' }, (locationChoice === 'location') ? { index } : {}),
                                            };
                                        }
                                        else if (action === 'delete') {
                                            requestBody = {
                                                footerId: actionField.footerId,
                                            };
                                        }
                                    }
                                    else if (object === 'header') {
                                        if (action === 'create') {
                                            const { insertSegment, locationChoice, segmentId, index } = actionField;
                                            requestBody = {
                                                type: 'DEFAULT',
                                                sectionBreakLocation: Object.assign({ segmentId: (insertSegment !== 'body') ? segmentId : '' }, (locationChoice === 'location') ? { index } : {}),
                                            };
                                        }
                                        else if (action === 'delete') {
                                            requestBody = {
                                                headerId: actionField.headerId,
                                            };
                                        }
                                    }
                                    else if (object === 'tableColumn') {
                                        if (action === 'insert') {
                                            const { insertPosition, rowIndex, columnIndex, insertSegment, segmentId, index } = actionField;
                                            requestBody = {
                                                insertRight: insertPosition,
                                                tableCellLocation: {
                                                    rowIndex,
                                                    columnIndex,
                                                    tableStartLocation: { segmentId: (insertSegment !== 'body') ? segmentId : '', index, },
                                                },
                                            };
                                        }
                                        else if (action === 'delete') {
                                            const { rowIndex, columnIndex, insertSegment, segmentId, index } = actionField;
                                            requestBody = {
                                                tableCellLocation: {
                                                    rowIndex,
                                                    columnIndex,
                                                    tableStartLocation: { segmentId: (insertSegment !== 'body') ? segmentId : '', index, },
                                                },
                                            };
                                        }
                                    }
                                    else if (object === 'tableRow') {
                                        if (action === 'insert') {
                                            const { insertPosition, rowIndex, columnIndex, insertSegment, segmentId, index } = actionField;
                                            requestBody = {
                                                insertBelow: insertPosition,
                                                tableCellLocation: {
                                                    rowIndex,
                                                    columnIndex,
                                                    tableStartLocation: { segmentId: (insertSegment !== 'body') ? segmentId : '', index, },
                                                },
                                            };
                                        }
                                        else if (action === 'delete') {
                                            const { rowIndex, columnIndex, insertSegment, segmentId, index } = actionField;
                                            requestBody = {
                                                tableCellLocation: {
                                                    rowIndex,
                                                    columnIndex,
                                                    tableStartLocation: { segmentId: (insertSegment !== 'body') ? segmentId : '', index, },
                                                },
                                            };
                                        }
                                    }
                                    else if (object === 'text') {
                                        if (action === 'insert') {
                                            const { text, locationChoice, insertSegment, segmentId, index } = actionField;
                                            requestBody = {
                                                text,
                                                [locationChoice]: Object.assign({ segmentId: (insertSegment !== 'body') ? segmentId : '' }, (locationChoice === 'location') ? { index } : {}),
                                            };
                                        }
                                        else if (action === 'replaceAll') {
                                            const { text, replaceText, matchCase } = actionField;
                                            requestBody = {
                                                replaceText,
                                                containsText: { text, matchCase },
                                            };
                                        }
                                    }
                                    else if (object === 'paragraphBullets') {
                                        if (action === 'create') {
                                            const { bulletPreset, startIndex, insertSegment, segmentId, endIndex } = actionField;
                                            requestBody = {
                                                bulletPreset,
                                                range: { segmentId: (insertSegment !== 'body') ? segmentId : '', startIndex, endIndex },
                                            };
                                        }
                                        else if (action === 'delete') {
                                            const { startIndex, insertSegment, segmentId, endIndex } = actionField;
                                            requestBody = {
                                                range: { segmentId: (insertSegment !== 'body') ? segmentId : '', startIndex, endIndex },
                                            };
                                        }
                                    }
                                    else if (object === 'namedRange') {
                                        if (action === 'create') {
                                            const { name, insertSegment, segmentId, startIndex, endIndex } = actionField;
                                            requestBody = {
                                                name,
                                                range: { segmentId: (insertSegment !== 'body') ? segmentId : '', startIndex, endIndex },
                                            };
                                        }
                                        else if (action === 'delete') {
                                            const { namedRangeReference, value } = actionField;
                                            requestBody = {
                                                [namedRangeReference]: value,
                                            };
                                        }
                                    }
                                    body.requests.push({
                                        [`${action}${(0, GenericFunctions_1.upperFirst)(object)}`]: requestBody,
                                    });
                                });
                            }
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/documents/${documentId}:batchUpdate`, body);
                            if (simple === true) {
                                if (Object.keys(responseData.replies[0]).length !== 0) {
                                    const key = Object.keys(responseData.replies[0])[0];
                                    responseData = responseData.replies[0][key];
                                }
                                else {
                                    responseData = {};
                                }
                            }
                            responseData.documentId = documentId;
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ error: error.message });
                        continue;
                    }
                    throw error;
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.GoogleDocs = GoogleDocs;
