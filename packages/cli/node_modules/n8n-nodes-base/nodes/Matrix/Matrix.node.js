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
exports.Matrix = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const AccountDescription_1 = require("./AccountDescription");
const EventDescription_1 = require("./EventDescription");
const MediaDescription_1 = require("./MediaDescription");
const MessageDescription_1 = require("./MessageDescription");
const RoomDescription_1 = require("./RoomDescription");
const RoomMemberDescription_1 = require("./RoomMemberDescription");
class Matrix {
    constructor() {
        this.description = {
            displayName: 'Matrix',
            name: 'matrix',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:matrix.png',
            group: ['output'],
            version: 1,
            description: 'Consume Matrix API',
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            defaults: {
                name: 'Matrix',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'matrixApi',
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
                            name: 'Account',
                            value: 'account',
                        },
                        {
                            name: 'Event',
                            value: 'event',
                        },
                        {
                            name: 'Media',
                            value: 'media',
                        },
                        {
                            name: 'Message',
                            value: 'message',
                        },
                        {
                            name: 'Room',
                            value: 'room',
                        },
                        {
                            name: 'Room Member',
                            value: 'roomMember',
                        },
                    ],
                    default: 'message',
                },
                ...AccountDescription_1.accountOperations,
                ...EventDescription_1.eventOperations,
                ...EventDescription_1.eventFields,
                ...MediaDescription_1.mediaOperations,
                ...MediaDescription_1.mediaFields,
                ...MessageDescription_1.messageOperations,
                ...MessageDescription_1.messageFields,
                ...RoomDescription_1.roomOperations,
                ...RoomDescription_1.roomFields,
                ...RoomMemberDescription_1.roomMemberOperations,
                ...RoomMemberDescription_1.roomMemberFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getChannels() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const returnData = [];
                        const joinedRoomsResponse = yield GenericFunctions_1.matrixApiRequest.call(this, 'GET', '/joined_rooms');
                        yield Promise.all(joinedRoomsResponse.joined_rooms.map((roomId) => __awaiter(this, void 0, void 0, function* () {
                            try {
                                const roomNameResponse = yield GenericFunctions_1.matrixApiRequest.call(this, 'GET', `/rooms/${roomId}/state/m.room.name`);
                                returnData.push({
                                    name: roomNameResponse.name,
                                    value: roomId,
                                });
                            }
                            catch (error) {
                                // TODO: Check, there is probably another way to get the name of this private-chats
                                returnData.push({
                                    name: `Unknown: ${roomId}`,
                                    value: roomId,
                                });
                            }
                        })));
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
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
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                try {
                    const responseData = yield GenericFunctions_1.handleMatrixCall.call(this, items[i], i, resource, operation);
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
exports.Matrix = Matrix;
