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
exports.MondayCom = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const BoardDescription_1 = require("./BoardDescription");
const BoardColumnDescription_1 = require("./BoardColumnDescription");
const BoardGroupDescription_1 = require("./BoardGroupDescription");
const BoardItemDescription_1 = require("./BoardItemDescription");
const change_case_1 = require("change-case");
class MondayCom {
    constructor() {
        this.description = {
            displayName: 'Monday.com',
            name: 'mondayCom',
            icon: 'file:mondayCom.svg',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume Monday.com API',
            defaults: {
                name: 'Monday.com',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'mondayComApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'accessToken',
                            ],
                        },
                    },
                },
                {
                    name: 'mondayComOAuth2Api',
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
                            name: 'Access Token',
                            value: 'accessToken',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'accessToken',
                },
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
                            name: 'Board Column',
                            value: 'boardColumn',
                        },
                        {
                            name: 'Board Group',
                            value: 'boardGroup',
                        },
                        {
                            name: 'Board Item',
                            value: 'boardItem',
                        },
                    ],
                    default: 'board',
                },
                //BOARD
                ...BoardDescription_1.boardOperations,
                ...BoardDescription_1.boardFields,
                // BOARD COLUMN
                ...BoardColumnDescription_1.boardColumnOperations,
                ...BoardColumnDescription_1.boardColumnFields,
                // BOARD GROUP
                ...BoardGroupDescription_1.boardGroupOperations,
                ...BoardGroupDescription_1.boardGroupFields,
                // BOARD ITEM
                ...BoardItemDescription_1.boardItemOperations,
                ...BoardItemDescription_1.boardItemFields,
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the available boards to display them to user so that he can
                // select them easily
                getBoards() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const body = {
                            query: `query ($page: Int, $limit: Int) {
							boards (page: $page, limit: $limit){
								id
								description
								name
							}
						}`,
                            variables: {
                                page: 1,
                            },
                        };
                        const boards = yield GenericFunctions_1.mondayComApiRequestAllItems.call(this, 'data.boards', body);
                        if (boards === undefined) {
                            return returnData;
                        }
                        for (const board of boards) {
                            const boardName = board.name;
                            const boardId = board.id;
                            const boardDescription = board.description;
                            returnData.push({
                                name: boardName,
                                value: boardId,
                                description: boardDescription,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available columns to display them to user so that he can
                // select them easily
                getColumns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const boardId = parseInt(this.getCurrentNodeParameter('boardId'), 10);
                        const body = {
                            query: `query ($boardId: [Int]) {
							boards (ids: $boardId){
								columns() {
									id
									title
								}
							}
						}`,
                            variables: {
                                page: 1,
                                boardId,
                            },
                        };
                        const { data } = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                        if (data === undefined) {
                            return returnData;
                        }
                        const columns = data.boards[0].columns;
                        for (const column of columns) {
                            const columnName = column.title;
                            const columnId = column.id;
                            returnData.push({
                                name: columnName,
                                value: columnId,
                            });
                        }
                        return returnData;
                    });
                },
                // Get all the available groups to display them to user so that he can
                // select them easily
                getGroups() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const boardId = parseInt(this.getCurrentNodeParameter('boardId'), 10);
                        const body = {
                            query: `query ($boardId: Int!) {
							boards ( ids: [$boardId]){
								groups () {
									id
									title
								}
							}
						}`,
                            variables: {
                                boardId,
                            },
                        };
                        const { data } = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                        if (data === undefined) {
                            return returnData;
                        }
                        const groups = data.boards[0].groups;
                        for (const group of groups) {
                            const groupName = group.title;
                            const groupId = group.id;
                            returnData.push({
                                name: groupName,
                                value: groupId,
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
            const qs = {};
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < length; i++) {
                try {
                    if (resource === 'board') {
                        if (operation === 'archive') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const body = {
                                query: `mutation ($id: Int!) {
									archive_board (board_id: $id) {
										id
									}
								}`,
                                variables: {
                                    id: boardId,
                                },
                            };
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.archive_board;
                        }
                        if (operation === 'create') {
                            const name = this.getNodeParameter('name', i);
                            const kind = this.getNodeParameter('kind', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                query: `mutation ($name: String!, $kind: BoardKind!, $templateId: Int) {
									create_board (board_name: $name, board_kind: $kind, template_id: $templateId) {
										id
									}
								}`,
                                variables: {
                                    name,
                                    kind,
                                },
                            };
                            if (additionalFields.templateId) {
                                body.variables.templateId = additionalFields.templateId;
                            }
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.create_board;
                        }
                        if (operation === 'get') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const body = {
                                query: `query ($id: [Int]) {
									boards (ids: $id){
										id
										name
										description
										state
										board_folder_id
										board_kind
										owner() {
											id
										}
									}
								}`,
                                variables: {
                                    id: boardId,
                                },
                            };
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.boards;
                        }
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const body = {
                                query: `query ($page: Int, $limit: Int) {
									boards (page: $page, limit: $limit){
										id
										name
										description
										state
										board_folder_id
										board_kind
										owner() {
											id
										}
									}
								}`,
                                variables: {
                                    page: 1,
                                },
                            };
                            if (returnAll === true) {
                                responseData = yield GenericFunctions_1.mondayComApiRequestAllItems.call(this, 'data.boards', body);
                            }
                            else {
                                body.variables.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                                responseData = responseData.data.boards;
                            }
                        }
                    }
                    if (resource === 'boardColumn') {
                        if (operation === 'create') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const title = this.getNodeParameter('title', i);
                            const columnType = this.getNodeParameter('columnType', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                query: `mutation ($boardId: Int!, $title: String!, $columnType: ColumnType, $defaults: JSON ) {
									create_column (board_id: $boardId, title: $title, column_type: $columnType, defaults: $defaults) {
										id
									}
								}`,
                                variables: {
                                    boardId,
                                    title,
                                    columnType: (0, change_case_1.snakeCase)(columnType),
                                },
                            };
                            if (additionalFields.defaults) {
                                try {
                                    JSON.parse(additionalFields.defaults);
                                }
                                catch (error) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Defauls must be a valid JSON');
                                }
                                body.variables.defaults = JSON.stringify(JSON.parse(additionalFields.defaults));
                            }
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.create_column;
                        }
                        if (operation === 'getAll') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const body = {
                                query: `query ($boardId: [Int]) {
									boards (ids: $boardId){
										columns() {
											id
											title
											type
											settings_str
											archived
										}
									}
								}`,
                                variables: {
                                    page: 1,
                                    boardId,
                                },
                            };
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.boards[0].columns;
                        }
                    }
                    if (resource === 'boardGroup') {
                        if (operation === 'create') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const name = this.getNodeParameter('name', i);
                            const body = {
                                query: `mutation ($boardId: Int!, $groupName: String!) {
									create_group (board_id: $boardId, group_name: $groupName) {
										id
									}
								}`,
                                variables: {
                                    boardId,
                                    groupName: name,
                                },
                            };
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.create_group;
                        }
                        if (operation === 'delete') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const groupId = this.getNodeParameter('groupId', i);
                            const body = {
                                query: `mutation ($boardId: Int!, $groupId: String!) {
									delete_group (board_id: $boardId, group_id: $groupId) {
										id
									}
								}`,
                                variables: {
                                    boardId,
                                    groupId,
                                },
                            };
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.delete_group;
                        }
                        if (operation === 'getAll') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const body = {
                                query: `query ($boardId: [Int]) {
									boards (ids: $boardId, ){
										id
										groups() {
											id
											title
											color
											position
											archived
										}
									}
								}`,
                                variables: {
                                    boardId,
                                },
                            };
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.boards[0].groups;
                        }
                    }
                    if (resource === 'boardItem') {
                        if (operation === 'addUpdate') {
                            const itemId = parseInt(this.getNodeParameter('itemId', i), 10);
                            const value = this.getNodeParameter('value', i);
                            const body = {
                                query: `mutation ($itemId: Int!, $value: String!) {
									create_update (item_id: $itemId, body: $value) {
										id
									}
								}`,
                                variables: {
                                    itemId,
                                    value,
                                },
                            };
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.create_update;
                        }
                        if (operation === 'changeColumnValue') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const itemId = parseInt(this.getNodeParameter('itemId', i), 10);
                            const columnId = this.getNodeParameter('columnId', i);
                            const value = this.getNodeParameter('value', i);
                            const body = {
                                query: `mutation ($boardId: Int!, $itemId: Int!, $columnId: String!, $value: JSON!) {
									change_column_value (board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
										id
									}
								}`,
                                variables: {
                                    boardId,
                                    itemId,
                                    columnId,
                                },
                            };
                            try {
                                JSON.parse(value);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Custom Values must be a valid JSON');
                            }
                            body.variables.value = JSON.stringify(JSON.parse(value));
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.change_column_value;
                        }
                        if (operation === 'changeMultipleColumnValues') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const itemId = parseInt(this.getNodeParameter('itemId', i), 10);
                            const columnValues = this.getNodeParameter('columnValues', i);
                            const body = {
                                query: `mutation ($boardId: Int!, $itemId: Int!, $columnValues: JSON!) {
									change_multiple_column_values (board_id: $boardId, item_id: $itemId, column_values: $columnValues) {
										id
									}
								}`,
                                variables: {
                                    boardId,
                                    itemId,
                                },
                            };
                            try {
                                JSON.parse(columnValues);
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Custom Values must be a valid JSON');
                            }
                            body.variables.columnValues = JSON.stringify(JSON.parse(columnValues));
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.change_multiple_column_values;
                        }
                        if (operation === 'create') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const groupId = this.getNodeParameter('groupId', i);
                            const itemName = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const body = {
                                query: `mutation ($boardId: Int!, $groupId: String!, $itemName: String!, $columnValues: JSON) {
									create_item (board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues) {
										id
									}
								}`,
                                variables: {
                                    boardId,
                                    groupId,
                                    itemName,
                                },
                            };
                            if (additionalFields.columnValues) {
                                try {
                                    JSON.parse(additionalFields.columnValues);
                                }
                                catch (error) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Custom Values must be a valid JSON');
                                }
                                body.variables.columnValues = JSON.stringify(JSON.parse(additionalFields.columnValues));
                            }
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.create_item;
                        }
                        if (operation === 'delete') {
                            const itemId = parseInt(this.getNodeParameter('itemId', i), 10);
                            const body = {
                                query: `mutation ($itemId: Int!) {
									delete_item (item_id: $itemId) {
										id
									}
								}`,
                                variables: {
                                    itemId,
                                },
                            };
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.delete_item;
                        }
                        if (operation === 'get') {
                            const itemIds = this.getNodeParameter('itemId', i).split(',').map((n) => parseInt(n, 10));
                            const body = {
                                query: `query ($itemId: [Int!]){
									items (ids: $itemId) {
										id
										name
										created_at
										state
										column_values() {
											id
											text
											title
											type
											value
											additional_info
										}
									}
								}`,
                                variables: {
                                    itemId: itemIds,
                                },
                            };
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.items;
                        }
                        if (operation === 'getAll') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const groupId = this.getNodeParameter('groupId', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const body = {
                                query: `query ($boardId: [Int], $groupId: [String], $page: Int, $limit: Int) {
									boards (ids: $boardId) {
										groups (ids: $groupId) {
											id
											items(limit: $limit, page: $page) {
												id
												name
												created_at
												state
												column_values() {
													id
													text
													title
													type
													value
													additional_info
												}
											}
										}
									}
								}`,
                                variables: {
                                    boardId,
                                    groupId,
                                },
                            };
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.mondayComApiRequestAllItems.call(this, 'data.boards[0].groups[0].items', body);
                            }
                            else {
                                body.variables.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                                responseData = responseData.data.boards[0].groups[0].items;
                            }
                        }
                        if (operation === 'getByColumnValue') {
                            const boardId = parseInt(this.getNodeParameter('boardId', i), 10);
                            const columnId = this.getNodeParameter('columnId', i);
                            const columnValue = this.getNodeParameter('columnValue', i);
                            const returnAll = this.getNodeParameter('returnAll', i);
                            const body = {
                                query: `query ($boardId: Int!, $columnId: String!, $columnValue: String!, $page: Int, $limit: Int ){
									items_by_column_values (board_id: $boardId, column_id: $columnId, column_value: $columnValue, page: $page, limit: $limit) {
										id
										name
										created_at
										state
										board {
											id
										}
										column_values() {
											id
											text
											title
											type
											value
											additional_info
										}
									}
								}`,
                                variables: {
                                    boardId,
                                    columnId,
                                    columnValue,
                                },
                            };
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.mondayComApiRequestAllItems.call(this, 'data.items_by_column_values', body);
                            }
                            else {
                                body.variables.limit = this.getNodeParameter('limit', i);
                                responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                                responseData = responseData.data.items_by_column_values;
                            }
                        }
                        if (operation === 'move') {
                            const groupId = this.getNodeParameter('groupId', i);
                            const itemId = parseInt(this.getNodeParameter('itemId', i), 10);
                            const body = {
                                query: `mutation ($groupId: String!, $itemId: Int!) {
									move_item_to_group (group_id: $groupId, item_id: $itemId) {
										id
									}
								}`,
                                variables: {
                                    groupId,
                                    itemId,
                                },
                            };
                            responseData = yield GenericFunctions_1.mondayComApiRequest.call(this, body);
                            responseData = responseData.data.move_item_to_group;
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
exports.MondayCom = MondayCom;
