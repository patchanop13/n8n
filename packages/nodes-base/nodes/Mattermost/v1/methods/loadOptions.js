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
exports.getUsers = exports.getTeams = exports.getChannelsInTeam = exports.getChannels = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const transport_1 = require("../transport");
// Get all the available channels
function getChannels() {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = 'channels';
        const responseData = yield transport_1.apiRequest.call(this, 'GET', endpoint, {});
        if (responseData === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
        }
        const returnData = [];
        let name;
        for (const data of responseData) {
            if (data.delete_at !== 0 || (!data.display_name || !data.name)) {
                continue;
            }
            name = `${data.team_display_name} - ${data.display_name || data.name} (${data.type === 'O' ? 'public' : 'private'})`;
            returnData.push({
                name,
                value: data.id,
            });
        }
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
}
exports.getChannels = getChannels;
// Get all the channels in a team
function getChannelsInTeam() {
    return __awaiter(this, void 0, void 0, function* () {
        const teamId = this.getCurrentNodeParameter('teamId');
        const endpoint = `users/me/teams/${teamId}/channels`;
        const responseData = yield transport_1.apiRequest.call(this, 'GET', endpoint, {});
        if (responseData === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
        }
        const returnData = [];
        let name;
        for (const data of responseData) {
            if (data.delete_at !== 0 || (!data.display_name || !data.name)) {
                continue;
            }
            const channelTypes = {
                'D': 'direct',
                'G': 'group',
                'O': 'public',
                'P': 'private',
            };
            name = `${data.display_name} (${channelTypes[data.type]})`;
            returnData.push({
                name,
                value: data.id,
            });
        }
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
}
exports.getChannelsInTeam = getChannelsInTeam;
function getTeams() {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = 'users/me/teams';
        const responseData = yield transport_1.apiRequest.call(this, 'GET', endpoint, {});
        if (responseData === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
        }
        const returnData = [];
        let name;
        for (const data of responseData) {
            if (data.delete_at !== 0) {
                continue;
            }
            name = `${data.display_name} (${data.type === 'O' ? 'public' : 'private'})`;
            returnData.push({
                name,
                value: data.id,
            });
        }
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
}
exports.getTeams = getTeams;
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const endpoint = 'users';
        const responseData = yield transport_1.apiRequest.call(this, 'GET', endpoint, {});
        if (responseData === undefined) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
        }
        const returnData = [];
        for (const data of responseData) {
            if (data.delete_at !== 0) {
                continue;
            }
            returnData.push({
                name: data.username,
                value: data.id,
            });
        }
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
}
exports.getUsers = getUsers;
