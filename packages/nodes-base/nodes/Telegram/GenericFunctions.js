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
exports.getPropertyName = exports.getImageBySize = exports.apiRequest = exports.addAdditionalFields = void 0;
const n8n_workflow_1 = require("n8n-workflow");
/**
 * Add the additional fields to the body
 *
 * @param {IExecuteFunctions} this
 * @param {IDataObject} body The body object to add fields to
 * @param {number} index The index of the item
 * @returns
 */
function addAdditionalFields(body, index) {
    // Add the additional fields
    const additionalFields = this.getNodeParameter('additionalFields', index);
    Object.assign(body, additionalFields);
    const operation = this.getNodeParameter('operation', index);
    // Add the reply markup
    let replyMarkupOption = '';
    if (operation !== 'sendMediaGroup') {
        replyMarkupOption = this.getNodeParameter('replyMarkup', index);
        if (replyMarkupOption === 'none') {
            return;
        }
    }
    body.reply_markup = {};
    if (['inlineKeyboard', 'replyKeyboard'].includes(replyMarkupOption)) {
        let setParameterName = 'inline_keyboard';
        if (replyMarkupOption === 'replyKeyboard') {
            setParameterName = 'keyboard';
        }
        const keyboardData = this.getNodeParameter(replyMarkupOption, index);
        // @ts-ignore
        body.reply_markup[setParameterName] = [];
        let sendButtonData;
        if (keyboardData.rows !== undefined) {
            for (const row of keyboardData.rows) {
                const sendRows = [];
                if (row.row === undefined || row.row.buttons === undefined) {
                    continue;
                }
                for (const button of row.row.buttons) {
                    sendButtonData = {};
                    sendButtonData.text = button.text;
                    if (button.additionalFields) {
                        Object.assign(sendButtonData, button.additionalFields);
                    }
                    sendRows.push(sendButtonData);
                }
                // @ts-ignore
                body.reply_markup[setParameterName].push(sendRows);
            }
        }
    }
    else if (replyMarkupOption === 'forceReply') {
        const forceReply = this.getNodeParameter('forceReply', index);
        body.reply_markup = forceReply;
    }
    else if (replyMarkupOption === 'replyKeyboardRemove') {
        const forceReply = this.getNodeParameter('replyKeyboardRemove', index);
        body.reply_markup = forceReply;
    }
    if (replyMarkupOption === 'replyKeyboard') {
        const replyKeyboardOptions = this.getNodeParameter('replyKeyboardOptions', index);
        Object.assign(body.reply_markup, replyKeyboardOptions);
    }
}
exports.addAdditionalFields = addAdditionalFields;
/**
 * Make an API request to Telegram
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
function apiRequest(method, endpoint, body, query, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('telegramApi');
        query = query || {};
        const options = {
            headers: {},
            method,
            uri: `https://api.telegram.org/bot${credentials.accessToken}/${endpoint}`,
            body,
            qs: query,
            json: true,
        };
        if (Object.keys(option).length > 0) {
            Object.assign(options, option);
        }
        if (Object.keys(body).length === 0) {
            delete options.body;
        }
        if (Object.keys(query).length === 0) {
            delete options.qs;
        }
        try {
            return yield this.helpers.request(options);
        }
        catch (error) {
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.apiRequest = apiRequest;
function getImageBySize(photos, size) {
    const sizes = {
        'small': 0,
        'medium': 1,
        'large': 2,
        'extraLarge': 3,
    };
    const index = sizes[size];
    return photos[index];
}
exports.getImageBySize = getImageBySize;
function getPropertyName(operation) {
    return operation.replace('send', '').toLowerCase();
}
exports.getPropertyName = getPropertyName;
