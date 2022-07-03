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
exports.GoogleFirebaseCloudFirestore = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const CollectionDescription_1 = require("./CollectionDescription");
const DocumentDescription_1 = require("./DocumentDescription");
class GoogleFirebaseCloudFirestore {
    constructor() {
        this.description = {
            displayName: 'Google Cloud Firestore',
            name: 'googleFirebaseCloudFirestore',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:googleFirebaseCloudFirestore.png',
            group: ['input'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Interact with Google Firebase - Cloud Firestore API',
            defaults: {
                name: 'Google Cloud Firestore',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleFirebaseCloudFirestoreOAuth2Api',
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
                            name: 'Document',
                            value: 'document',
                        },
                        {
                            name: 'Collection',
                            value: 'collection',
                        },
                    ],
                    default: 'document',
                },
                ...DocumentDescription_1.documentOperations,
                ...DocumentDescription_1.documentFields,
                ...CollectionDescription_1.collectionOperations,
                ...CollectionDescription_1.collectionFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getProjects() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const collections = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'results', 'GET', '', {}, {}, 'https://firebase.googleapis.com/v1beta1/projects');
                        // @ts-ignore
                        const returnData = collections.map(o => ({ name: o.projectId, value: o.projectId }));
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
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            if (resource === 'document') {
                if (operation === 'get') {
                    const projectId = this.getNodeParameter('projectId', 0);
                    const database = this.getNodeParameter('database', 0);
                    const simple = this.getNodeParameter('simple', 0);
                    const documentList = items.map((item, i) => {
                        const collection = this.getNodeParameter('collection', i);
                        const documentId = this.getNodeParameter('documentId', i);
                        return `projects/${projectId}/databases/${database}/documents/${collection}/${documentId}`;
                    });
                    responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/${projectId}/databases/${database}/documents:batchGet`, { documents: documentList });
                    responseData = responseData.map((element) => {
                        if (element.found) {
                            element.found.id = element.found.name.split('/').pop();
                        }
                        return element;
                    });
                    if (simple === false) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
                        returnData.push.apply(returnData, responseData.map((element) => {
                            return (0, GenericFunctions_1.fullDocumentToJson)(element.found);
                        }).filter((el) => !!el));
                    }
                }
                else if (operation === 'create') {
                    const projectId = this.getNodeParameter('projectId', 0);
                    const database = this.getNodeParameter('database', 0);
                    const simple = this.getNodeParameter('simple', 0);
                    yield Promise.all(items.map((item, i) => __awaiter(this, void 0, void 0, function* () {
                        const collection = this.getNodeParameter('collection', i);
                        const columns = this.getNodeParameter('columns', i);
                        const columnList = columns.split(',').map(column => column.trim());
                        const document = { fields: {} };
                        columnList.map(column => {
                            // @ts-ignore
                            document.fields[column] = item['json'][column] ? (0, GenericFunctions_1.jsonToDocument)(item['json'][column]) : (0, GenericFunctions_1.jsonToDocument)(null);
                        });
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/${projectId}/databases/${database}/documents/${collection}`, document);
                        responseData.id = responseData.name.split('/').pop();
                        if (simple === false) {
                            returnData.push(responseData);
                        }
                        else {
                            returnData.push((0, GenericFunctions_1.fullDocumentToJson)(responseData));
                        }
                    })));
                }
                else if (operation === 'getAll') {
                    const projectId = this.getNodeParameter('projectId', 0);
                    const database = this.getNodeParameter('database', 0);
                    const collection = this.getNodeParameter('collection', 0);
                    const returnAll = this.getNodeParameter('returnAll', 0);
                    const simple = this.getNodeParameter('simple', 0);
                    if (returnAll) {
                        responseData = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'documents', 'GET', `/${projectId}/databases/${database}/documents/${collection}`);
                    }
                    else {
                        const limit = this.getNodeParameter('limit', 0);
                        const getAllResponse = yield GenericFunctions_1.googleApiRequest.call(this, 'GET', `/${projectId}/databases/${database}/documents/${collection}`, {}, { pageSize: limit });
                        responseData = getAllResponse.documents;
                    }
                    responseData = responseData.map((element) => {
                        element.id = element.name.split('/').pop();
                        return element;
                    });
                    if (simple === false) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
                        returnData.push.apply(returnData, responseData.map((element) => (0, GenericFunctions_1.fullDocumentToJson)(element)));
                    }
                }
                else if (operation === 'delete') {
                    const responseData = [];
                    yield Promise.all(items.map((item, i) => __awaiter(this, void 0, void 0, function* () {
                        const projectId = this.getNodeParameter('projectId', i);
                        const database = this.getNodeParameter('database', i);
                        const collection = this.getNodeParameter('collection', i);
                        const documentId = this.getNodeParameter('documentId', i);
                        yield GenericFunctions_1.googleApiRequest.call(this, 'DELETE', `/${projectId}/databases/${database}/documents/${collection}/${documentId}`);
                        responseData.push({ success: true });
                    })));
                    returnData.push.apply(returnData, responseData);
                }
                else if (operation === 'upsert') {
                    const projectId = this.getNodeParameter('projectId', 0);
                    const database = this.getNodeParameter('database', 0);
                    const updates = items.map((item, i) => {
                        const collection = this.getNodeParameter('collection', i);
                        const updateKey = this.getNodeParameter('updateKey', i);
                        // @ts-ignore
                        const documentId = item['json'][updateKey];
                        const columns = this.getNodeParameter('columns', i);
                        const columnList = columns.split(',').map(column => column.trim());
                        const document = {};
                        columnList.map(column => {
                            // @ts-ignore
                            document[column] = item['json'].hasOwnProperty(column) ? (0, GenericFunctions_1.jsonToDocument)(item['json'][column]) : (0, GenericFunctions_1.jsonToDocument)(null);
                        });
                        return {
                            update: {
                                name: `projects/${projectId}/databases/${database}/documents/${collection}/${documentId}`,
                                fields: document,
                            },
                            updateMask: {
                                fieldPaths: columnList,
                            },
                        };
                    });
                    responseData = [];
                    const { writeResults, status } = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/${projectId}/databases/${database}/documents:batchWrite`, { writes: updates });
                    for (let i = 0; i < writeResults.length; i++) {
                        writeResults[i]['status'] = status[i];
                        Object.assign(writeResults[i], items[i].json);
                        responseData.push(writeResults[i]);
                    }
                    returnData.push.apply(returnData, responseData);
                    // } else if (operation === 'update') {
                    // 	const projectId = this.getNodeParameter('projectId', 0) as string;
                    // 	const database = this.getNodeParameter('database', 0) as string;
                    // 	const simple = this.getNodeParameter('simple', 0) as boolean;
                    // 	await Promise.all(items.map(async (item: IDataObject, i: number) => {
                    // 		const collection = this.getNodeParameter('collection', i) as string;
                    // 		const updateKey = this.getNodeParameter('updateKey', i) as string;
                    // 		// @ts-ignore
                    // 		const documentId = item['json'][updateKey] as string;
                    // 		const columns = this.getNodeParameter('columns', i) as string;
                    // 		const columnList = columns.split(',').map(column => column.trim()) as string[];
                    // 		const document = {};
                    // 		columnList.map(column => {
                    // 			// @ts-ignore
                    // 			document[column] = item['json'].hasOwnProperty(column) ? jsonToDocument(item['json'][column]) : jsonToDocument(null);
                    // 		});
                    // 		responseData = await googleApiRequest.call(
                    // 			this,
                    // 			'PATCH',
                    // 			`/${projectId}/databases/${database}/documents/${collection}/${documentId}`,
                    // 			{ fields: document },
                    // 			{ [`updateMask.fieldPaths`]: columnList },
                    // 		);
                    // 		if (simple === false) {
                    // 			returnData.push(responseData);
                    // 		} else {
                    // 			returnData.push(fullDocumentToJson(responseData as IDataObject));
                    // 		}
                    // 	}));
                }
                else if (operation === 'query') {
                    const projectId = this.getNodeParameter('projectId', 0);
                    const database = this.getNodeParameter('database', 0);
                    const simple = this.getNodeParameter('simple', 0);
                    yield Promise.all(items.map((item, i) => __awaiter(this, void 0, void 0, function* () {
                        const query = this.getNodeParameter('query', i);
                        responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/${projectId}/databases/${database}/documents:runQuery`, JSON.parse(query));
                        responseData = responseData.map((element) => {
                            if (element.document) {
                                element.document.id = element.document.name.split('/').pop();
                            }
                            return element;
                        });
                        if (simple === false) {
                            returnData.push.apply(returnData, responseData);
                        }
                        else {
                            //@ts-ignore
                            returnData.push.apply(returnData, responseData.map((element) => {
                                return (0, GenericFunctions_1.fullDocumentToJson)(element.document);
                            }).filter((element) => !!element));
                        }
                    })));
                }
            }
            else if (resource === 'collection') {
                if (operation === 'getAll') {
                    const projectId = this.getNodeParameter('projectId', 0);
                    const database = this.getNodeParameter('database', 0);
                    const returnAll = this.getNodeParameter('returnAll', 0);
                    if (returnAll) {
                        const getAllResponse = yield GenericFunctions_1.googleApiRequestAllItems.call(this, 'collectionIds', 'POST', `/${projectId}/databases/${database}/documents:listCollectionIds`);
                        // @ts-ignore
                        responseData = getAllResponse.map(o => ({ name: o }));
                    }
                    else {
                        const limit = this.getNodeParameter('limit', 0);
                        const getAllResponse = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/${projectId}/databases/${database}/documents:listCollectionIds`, {}, { pageSize: limit });
                        // @ts-ignore
                        responseData = getAllResponse.collectionIds.map(o => ({ name: o }));
                    }
                    returnData.push.apply(returnData, responseData);
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.GoogleFirebaseCloudFirestore = GoogleFirebaseCloudFirestore;
