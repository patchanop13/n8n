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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SseTrigger = void 0;
const eventsource_1 = __importDefault(require("eventsource"));
class SseTrigger {
    constructor() {
        this.description = {
            displayName: 'SSE Trigger',
            name: 'sseTrigger',
            icon: 'fa:cloud-download-alt',
            group: ['trigger'],
            version: 1,
            description: 'Triggers the workflow when Server-Sent Events occur',
            eventTriggerDescription: '',
            activationMessage: 'You can now make calls to your SSE URL to trigger executions.',
            defaults: {
                name: 'SSE Trigger',
                color: '#225577',
            },
            inputs: [],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'URL',
                    name: 'url',
                    type: 'string',
                    default: '',
                    placeholder: 'http://example.com',
                    description: 'The URL to receive the SSE from',
                    required: true,
                },
            ],
        };
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.getNodeParameter('url');
            const eventSource = new eventsource_1.default(url);
            eventSource.onmessage = (event) => {
                const eventData = JSON.parse(event.data);
                this.emit([this.helpers.returnJsonArray([eventData])]);
            };
            function closeFunction() {
                return __awaiter(this, void 0, void 0, function* () {
                    eventSource.close();
                });
            }
            return {
                closeFunction,
            };
        });
    }
}
exports.SseTrigger = SseTrigger;
