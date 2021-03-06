"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramApi = void 0;
class TelegramApi {
    constructor() {
        this.name = 'telegramApi';
        this.displayName = 'Telegram API';
        this.documentationUrl = 'telegram';
        this.properties = [
            {
                displayName: 'Access Token',
                name: 'accessToken',
                type: 'string',
                default: '',
                description: 'Chat with the <a href="https://telegram.me/botfather">bot father</a> to obtain the access token',
            },
        ];
    }
}
exports.TelegramApi = TelegramApi;
