"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventbriteApi = void 0;
class EventbriteApi {
    constructor() {
        this.name = 'eventbriteApi';
        this.displayName = 'Eventbrite API';
        this.documentationUrl = 'eventbrite';
        this.properties = [
            {
                displayName: 'Private Key',
                name: 'apiKey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.EventbriteApi = EventbriteApi;
