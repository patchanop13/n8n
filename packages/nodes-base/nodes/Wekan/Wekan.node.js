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
exports.Wekan = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const BoardDescription_1 = require("./BoardDescription");
const CardDescription_1 = require("./CardDescription");
const CardCommentDescription_1 = require("./CardCommentDescription");
const ChecklistDescription_1 = require("./ChecklistDescription");
const ChecklistItemDescription_1 = require("./ChecklistItemDescription");
const ListDescription_1 = require("./ListDescription");
// https://wekan.github.io/api/v4.41/
class Wekan {
    constructor() {
        this.description = {
            displayName: 'Wekan',
            name: 'wekan',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:wekan.png',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Wekan API',
            defaults: {
                name: 'Wekan',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'wekanApi',
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
                            name: 'Board',
                            value: 'board',
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
                            name: 'Checklist Item',
                            value: 'checklistItem',
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
                ...BoardDescription_1.boardOperations,
                ...CardDescription_1.cardOperations,
                ...CardCommentDescription_1.cardCommentOperations,
                ...ChecklistDescription_1.checklistOperations,
                ...ChecklistItemDescription_1.checklistItemOperations,
                ...ListDescription_1.listOperations,
                // ----------------------------------
                //         fields
                // ----------------------------------
                ...BoardDescription_1.boardFields,
                ...CardDescription_1.cardFields,
                ...CardCommentDescription_1.cardCommentFields,
                ...ChecklistDescription_1.checklistFields,
                ...ChecklistItemDescription_1.checklistItemFields,
                ...ListDescription_1.listFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const users = yield GenericFunctions_1.apiRequest.call(this, 'GET', 'users', {}, {});
                        for (const user of users) {
                            returnData.push({
                                name: user.username,
                                value: user._id,
                            });
                        }
                        return returnData;
                    });
                },
                getBoards() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const user = yield GenericFunctions_1.apiRequest.call(this, 'GET', `user`, {}, {});
                        const boards = yield GenericFunctions_1.apiRequest.call(this, 'GET', `users/${user._id}/boards`, {}, {});
                        for (const board of boards) {
                            returnData.push({
                                name: board.title,
                                value: board._id,
                            });
                        }
                        return returnData;
                    });
                },
                getLists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const boardId = this.getCurrentNodeParameter('boardId');
                        const lists = yield GenericFunctions_1.apiRequest.call(this, 'GET', `boards/${boardId}/lists`, {}, {});
                        for (const list of lists) {
                            returnData.push({
                                name: list.title,
                                value: list._id,
                            });
                        }
                        return returnData;
                    });
                },
                getSwimlanes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const boardId = this.getCurrentNodeParameter('boardId');
                        const swimlanes = yield GenericFunctions_1.apiRequest.call(this, 'GET', `boards/${boardId}/swimlanes`, {}, {});
                        for (const swimlane of swimlanes) {
                            returnData.push({
                                name: swimlane.title,
                                value: swimlane._id,
                            });
                        }
                        return returnData;
                    });
                },
                getCards() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const boardId = this.getCurrentNodeParameter('boardId');
                        const listId = this.getCurrentNodeParameter('listId');
                        const cards = yield GenericFunctions_1.apiRequest.call(this, 'GET', `boards/${boardId}/lists/${listId}/cards`, {}, {});
                        for (const card of cards) {
                            returnData.push({
                                name: card.title,
                                value: card._id,
                            });
                        }
                        return returnData;
                    });
                },
                getChecklists() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const boardId = this.getCurrentNodeParameter('boardId');
                        const cardId = this.getCurrentNodeParameter('cardId');
                        const checklists = yield GenericFunctions_1.apiRequest.call(this, 'GET', `boards/${boardId}/cards/${cardId}/checklists`, {}, {});
                        for (const checklist of checklists) {
                            returnData.push({
                                name: checklist.title,
                                value: checklist._id,
                            });
                        }
                        return returnData;
                    });
                },
                getChecklistItems() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const boardId = this.getCurrentNodeParameter('boardId');
                        const cardId = this.getCurrentNodeParameter('cardId');
                        const checklistId = this.getCurrentNodeParameter('checklistId');
                        const checklist = yield GenericFunctions_1.apiRequest.call(this, 'GET', `boards/${boardId}/cards/${cardId}/checklists/${checklistId}`, {}, {});
                        for (const item of checklist.items) {
                            returnData.push({
                                name: item.title,
                                value: item._id,
                            });
                        }
                        return returnData;
                    });
                },
                getComments() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const boardId = this.getCurrentNodeParameter('boardId');
                        const cardId = this.getCurrentNodeParameter('cardId');
                        const comments = yield GenericFunctions_1.apiRequest.call(this, 'GET', `boards/${boardId}/cards/${cardId}/comments`, {}, {});
                        for (const comment of comments) {
                            returnData.push({
                                name: comment.comment,
                                value: comment._id,
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
            let returnAll;
            let limit;
            const operation = this.getNodeParameter('operation', 0);
            const resource = this.getNodeParameter('resource', 0);
            // For Post
            let body;
            // For Query string
            let qs;
            let requestMethod;
            let endpoint;
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
                            body.title = this.getNodeParameter('title', i);
                            body.owner = this.getNodeParameter('owner', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const boardId = this.getNodeParameter('boardId', i);
                            endpoint = `boards/${boardId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const boardId = this.getNodeParameter('boardId', i);
                            endpoint = `boards/${boardId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const userId = this.getNodeParameter('IdUser', i);
                            returnAll = this.getNodeParameter('returnAll', i);
                            endpoint = `users/${userId}/boards`;
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
                            const boardId = this.getNodeParameter('boardId', i);
                            const listId = this.getNodeParameter('listId', i);
                            endpoint = `boards/${boardId}/lists/${listId}/cards`;
                            body.title = this.getNodeParameter('title', i);
                            body.swimlaneId = this.getNodeParameter('swimlaneId', i);
                            body.authorId = this.getNodeParameter('authorId', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            Object.assign(body, additionalFields);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const boardId = this.getNodeParameter('boardId', i);
                            const listId = this.getNodeParameter('listId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            endpoint = `boards/${boardId}/lists/${listId}/cards/${cardId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const boardId = this.getNodeParameter('boardId', i);
                            const listId = this.getNodeParameter('listId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            endpoint = `boards/${boardId}/lists/${listId}/cards/${cardId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const boardId = this.getNodeParameter('boardId', i);
                            const fromObject = this.getNodeParameter('fromObject', i);
                            returnAll = this.getNodeParameter('returnAll', i);
                            if (fromObject === 'list') {
                                const listId = this.getNodeParameter('listId', i);
                                endpoint = `boards/${boardId}/lists/${listId}/cards`;
                            }
                            if (fromObject === 'swimlane') {
                                const swimlaneId = this.getNodeParameter('swimlaneId', i);
                                endpoint = `boards/${boardId}/swimlanes/${swimlaneId}/cards`;
                            }
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const boardId = this.getNodeParameter('boardId', i);
                            const listId = this.getNodeParameter('listId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            endpoint = `boards/${boardId}/lists/${listId}/cards/${cardId}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(body, updateFields);
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
                            requestMethod = 'POST';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/comments`;
                            body.authorId = this.getNodeParameter('authorId', i);
                            body.comment = this.getNodeParameter('comment', i);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            const commentId = this.getNodeParameter('commentId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/comments/${commentId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            const commentId = this.getNodeParameter('commentId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/comments/${commentId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/comments`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'list') {
                        if (operation === 'create') {
                            // ----------------------------------
                            //         create
                            // ----------------------------------
                            requestMethod = 'POST';
                            const boardId = this.getNodeParameter('boardId', i);
                            endpoint = `boards/${boardId}/lists`;
                            body.title = this.getNodeParameter('title', i);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const boardId = this.getNodeParameter('boardId', i);
                            const listId = this.getNodeParameter('listId', i);
                            endpoint = `boards/${boardId}/lists/${listId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const boardId = this.getNodeParameter('boardId', i);
                            const listId = this.getNodeParameter('listId', i);
                            endpoint = `boards/${boardId}/lists/${listId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const boardId = this.getNodeParameter('boardId', i);
                            returnAll = this.getNodeParameter('returnAll', i);
                            endpoint = `boards/${boardId}/lists`;
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
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/checklists`;
                            body.title = this.getNodeParameter('title', i);
                            body.items = this.getNodeParameter('items', i);
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            const checklistId = this.getNodeParameter('checklistId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/checklists/${checklistId}`;
                        }
                        else if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            const checklistId = this.getNodeParameter('checklistId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/checklists/${checklistId}`;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------
                            //         getAll
                            // ----------------------------------
                            requestMethod = 'GET';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            returnAll = this.getNodeParameter('returnAll', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/checklists`;
                        }
                        else if (operation === 'getCheckItem') {
                            // ----------------------------------
                            //         getCheckItem
                            // ----------------------------------
                            requestMethod = 'GET';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            const checklistId = this.getNodeParameter('checklistId', i);
                            const itemId = this.getNodeParameter('itemId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/checklists/${checklistId}/items/${itemId}`;
                        }
                        else if (operation === 'deleteCheckItem') {
                            // ----------------------------------
                            //         deleteCheckItem
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            const checklistId = this.getNodeParameter('checklistId', i);
                            const itemId = this.getNodeParameter('itemId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/checklists/${checklistId}/items/${itemId}`;
                        }
                        else if (operation === 'updateCheckItem') {
                            // ----------------------------------
                            //         updateCheckItem
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            const checklistId = this.getNodeParameter('checklistId', i);
                            const itemId = this.getNodeParameter('itemId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/checklists/${checklistId}/items/${itemId}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(body, updateFields);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                        }
                    }
                    else if (resource === 'checklistItem') {
                        if (operation === 'get') {
                            // ----------------------------------
                            //         get
                            // ----------------------------------
                            requestMethod = 'GET';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            const checklistId = this.getNodeParameter('checklistId', i);
                            const itemId = this.getNodeParameter('checklistItemId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/checklists/${checklistId}/items/${itemId}`;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------
                            //         delete
                            // ----------------------------------
                            requestMethod = 'DELETE';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            const checklistId = this.getNodeParameter('checklistId', i);
                            const itemId = this.getNodeParameter('checklistItemId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/checklists/${checklistId}/items/${itemId}`;
                        }
                        else if (operation === 'update') {
                            // ----------------------------------
                            //         update
                            // ----------------------------------
                            requestMethod = 'PUT';
                            const boardId = this.getNodeParameter('boardId', i);
                            const cardId = this.getNodeParameter('cardId', i);
                            const checklistId = this.getNodeParameter('checklistId', i);
                            const itemId = this.getNodeParameter('checklistItemId', i);
                            endpoint = `boards/${boardId}/cards/${cardId}/checklists/${checklistId}/items/${itemId}`;
                            const updateFields = this.getNodeParameter('updateFields', i);
                            Object.assign(body, updateFields);
                        }
                    }
                    let responseData = yield GenericFunctions_1.apiRequest.call(this, requestMethod, endpoint, body, qs);
                    if (returnAll === false) {
                        limit = this.getNodeParameter('limit', i);
                        responseData = responseData.splice(0, limit);
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
exports.Wekan = Wekan;
