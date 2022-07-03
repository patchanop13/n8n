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
exports.Trello = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const AttachmentDescription_1 = require("./AttachmentDescription");
const BoardDescription_1 = require("./BoardDescription");
const BoardMemberDescription_1 = require("./BoardMemberDescription");
const CardDescription_1 = require("./CardDescription");
const CardCommentDescription_1 = require("./CardCommentDescription");
const ChecklistDescription_1 = require("./ChecklistDescription");
const LabelDescription_1 = require("./LabelDescription");
const ListDescription_1 = require("./ListDescription");
class Trello {
    constructor() {
        this.description = {
            displayName: 'Trello',
            name: 'trello',
            icon: 'file:trello.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Create, change and delete boards and cards',
            defaults: {
                name: 'Trello',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'trelloApi',
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
                            name: 'Attachment',
                            value: 'attachment',
                        },
                        {
                            name: 'Board',
                            value: 'board',
                        },
                        {
                            name: 'Board Member',
                            value: 'boardMember',
                        },
                        {
                            name: 'Card',
                            value: 'card',
                        },
                        {
                            name: 'Card Comment',
                            value: 'cardComment',
                        },
                        {
                            name: 'Checklist',
                            value: 'checklist',
                        },
                        {
                            name: 'Label',
                            value: 'label',
                        },
                        {
                            name: 'List',
                            value: 'list',
                        },
                    ],
                    default: 'card',
                },
                // ----------------------------------
                //         operations
                // ----------------------------------
                ...AttachmentDescription_1.attachmentOperations,
                ...BoardDescription_1.boardOperations,
                ...BoardMemberDescription_1.boardMemberOperations,
                ...CardDescription_1.cardOperations,
                ...CardCommentDescription_1.cardCommentOperations,
                ...ChecklistDescription_1.checklistOperations,
                ...LabelDescription_1.labelOperations,
                ...ListDescription_1.listOperations,
                // ----------------------------------
                //         fields
                // ----------------------------------
                ...AttachmentDescription_1.attachmentFields,
                ...BoardDescription_1.boardFields,
                ...BoardMemberDescription_1.boardMemberFields,
                ...CardDescription_1.cardFields,
                ...CardCommentDescription_1.cardCommentFields,
                ...ChecklistDescription_1.checklistFields,
                ...LabelDescription_1.labelFields,
                ...ListDescription_1.listFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const operation = this.getNodeParameter('operation', 0);
            const resource = this.getNodeParameter('resource', 0);
            // For Post
            let body;
            // For Query string
            let qs;
            let requestMethod;
            let endpoint;
            let returnAll = false;
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    requestMethod = 'GET';
                    endpoint = '';
                    body = {};
                    qs = {};
                    if (resource === 'board') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'boards';
                            qs.name = this.getNodeParameter('name', i);
                            qs.desc = this.getNodeParameter('description', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `boards/${id}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `boards/${id}`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `boards/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(qs, updateFields);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'boardMember') {
                        if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            endpoint = `boards/${id}/members`;
                        }
                        else if (operation === 'add') {
                            // ----------------------------------
                            //               add
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const id = this.getNodeParameter('id', i);
                            const idMember = this.getNodeParameter('idMember', i);
                            endpoint = `boards/${id}/members/${idMember}`;
                            qs.type = this.getNodeParameter('type', i);
                            qs.allowBillableGuest = this.getNodeParameter('additionalFields.allowBillableGuest', i, false);
                        }
                        else if (operation === 'invite') {
                            // ----------------------------------
                            //              invite
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `boards/${id}/members`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            qs.email = this.getNodeParameter('email', i);
                            qs.type = additionalFields.type;
                            body.fullName = additionalFields.fullName;
                        }
                        else if (operation === 'remove') {
                            // ----------------------------------
                            //              remove
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            const idMember = this.getNodeParameter('idMember', i);
                            endpoint = `boards/${id}/members/${idMember}`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'card') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'cards';
                            qs.idList = this.getNodeParameter('listId', i);
                            qs.name = this.getNodeParameter('name', i);
                            qs.desc = this.getNodeParameter('description', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `cards/${id}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `cards/${id}`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `cards/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(qs, updateFields);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'cardComment') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            const cardId = this.getNodeParameter('cardId', i);
                            qs.text = this.getNodeParameter('text', i);
                            requestMethod = 'POST';
                            endpoint = `cards/${cardId}/actions/comments`;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const cardId = this.getNodeParameter('cardId', i);
                            const commentId = this.getNodeParameter('commentId', i);
                            endpoint = `/cards/${cardId}/actions/${commentId}/comments`;
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const cardId = this.getNodeParameter('cardId', i);
                            const commentId = this.getNodeParameter('commentId', i);
                            qs.text = this.getNodeParameter('text', i);
                            endpoint = `cards/${cardId}/actions/${commentId}/comments`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'list') {
                        if (operation === 'archive') {
                            // ----------------------------------
                            //         archive
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const id = this.getNodeParameter('id', i);
                            qs.value = this.getNodeParameter('archive', i);
                            endpoint = `lists/${id}/closed`;
                        }
                        else if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            endpoint = 'lists';
                            qs.idBoard = this.getNodeParameter('idBoard', i);
                            qs.name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `lists/${id}`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            const id = this.getNodeParameter('id', i);
                            endpoint = `boards/${id}/lists`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'getCards') {
                            // ----------------------------------
                            //         getCards
                            // ----------------------------------
                            requestMethod = 'GET';
                            returnAll = this.getNodeParameter('returnAll', i);
                            if (returnAll === false) {
                                qs.limit = this.getNodeParameter('limit', i);
                            }
                            const id = this.getNodeParameter('id', i);
                            endpoint = `lists/${id}/cards`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `lists/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(qs, updateFields);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'attachment') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            const cardId = this.getNodeParameter('cardId', i);
                            const url = this.getNodeParameter('url', i);
                            Object.assign(qs, {
                                url,
                            });
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                            endpoint = `cards/${cardId}/attachments`;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const cardId = this.getNodeParameter('cardId', i);
                            const id = this.getNodeParameter('id', i);
                            endpoint = `cards/${cardId}/attachments/${id}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const cardId = this.getNodeParameter('cardId', i);
                            const id = this.getNodeParameter('id', i);
                            endpoint = `cards/${cardId}/attachments/${id}`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const cardId = this.getNodeParameter('cardId', i);
                            endpoint = `cards/${cardId}/attachments`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'checklist') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            const cardId = this.getNodeParameter('cardId', i);
                            const name = this.getNodeParameter('name', i);
                            Object.assign(qs, { name });
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                            endpoint = `cards/${cardId}/checklists`;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const cardId = this.getNodeParameter('cardId', i);
                            const id = this.getNodeParameter('id', i);
                            endpoint = `cards/${cardId}/checklists/${id}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `checklists/${id}`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const cardId = this.getNodeParameter('cardId', i);
                            endpoint = `cards/${cardId}/checklists`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'getCheckItem') {
                            // ----------------------------------
                            //         getCheckItem
                            // ----------------------------------
                            requestMethod = 'GET';
                            const cardId = this.getNodeParameter('cardId', i);
                            const checkItemId = this.getNodeParameter('checkItemId', i);
                            endpoint = `cards/${cardId}/checkItem/${checkItemId}`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'createCheckItem') {
                            // ----------------------------------
                            //         createCheckItem
                            // ----------------------------------
                            requestMethod = 'POST';
                            const checklistId = this.getNodeParameter('checklistId', i);
                            endpoint = `checklists/${checklistId}/checkItems`;
                            const name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, Object.assign({ name }, additionalFields));
                        }
                        else if (operation === 'deleteCheckItem') {
                            // ----------------------------------
                            //         deleteCheckItem
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const cardId = this.getNodeParameter('cardId', i);
                            const checkItemId = this.getNodeParameter('checkItemId', i);
                            endpoint = `cards/${cardId}/checkItem/${checkItemId}`;
                        }
                        else if (operation === 'updateCheckItem') {
                            // ----------------------------------
                            //         updateCheckItem
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const cardId = this.getNodeParameter('cardId', i);
                            const checkItemId = this.getNodeParameter('checkItemId', i);
                            endpoint = `cards/${cardId}/checkItem/${checkItemId}`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'completedCheckItems') {
                            // ----------------------------------
                            //         completedCheckItems
                            // ----------------------------------
                            requestMethod = 'GET';
                            const cardId = this.getNodeParameter('cardId', i);
                            endpoint = `cards/${cardId}/checkItemStates`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'label') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            const idBoard = this.getNodeParameter('boardId', i);
                            const name = this.getNodeParameter('name', i);
                            const color = this.getNodeParameter('color', i);
                            Object.assign(qs, {
                                idBoard,
                                name,
                                color,
                            });
                            endpoint = 'labels';
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `labels/${id}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `labels/${id}`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const idBoard = this.getNodeParameter('boardId', i);
                            endpoint = `board/${idBoard}/labels`;
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(qs, additionalFields);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const id = this.getNodeParameter('id', i);
                            endpoint = `labels/${id}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(qs, updateFields);
                        }
                        else if (operation === 'addLabel') {
                            // ----------------------------------
                            //         addLabel
                            // ----------------------------------
                            requestMethod = 'POST';
                            const cardId = this.getNodeParameter('cardId', i);
                            const id = this.getNodeParameter('id', i);
                            qs.value = id;
                            endpoint = `/cards/${cardId}/idLabels`;
                        }
                        else if (operation === 'removeLabel') {
                            // ----------------------------------
                            //         removeLabel
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const cardId = this.getNodeParameter('cardId', i);
                            const id = this.getNodeParameter('id', i);
                            endpoint = `/cards/${cardId}/idLabels/${id}`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                    }
                    // resources listed here do not support pagination so
                    // paginate them 'manually'
                    const skipPagination = [
                        'list:getAll',
                    ];
                    if (returnAll === true && !skipPagination.includes(`${resource}:${operation}`)) {
                        responseData = yield GenericFunctions_1.apiRequestAllItems.call(this, requestMethod, endpoint, body, qs);
                    }
                    else {
                        responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
                        if (returnAll === false && qs.limit) {
                            responseData = responseData.splice(0, qs.limit);
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
exports.Trello = Trello;
