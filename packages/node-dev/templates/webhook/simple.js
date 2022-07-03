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
exports.ClassNameReplace = void 0;
class ClassNameReplace {
    constructor() {
        this.description = {
            displayName: 'DisplayNameReplace',
            name: 'N8nNameReplace',
            group: ['trigger'],
            version: 1,
            description: 'NodeDescriptionReplace',
            defaults: {
                name: 'DisplayNameReplace',
                color: '#885577',
            },
            inputs: [],
            outputs: ['main'],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    // Each webhook property can either be hardcoded
                    // like the above ones or referenced from a parameter
                    // like the "path" property bellow
                    path: '={{$parameter["path"]}}',
                },
            ],
            properties: [
                {
                    displayName: 'Path',
                    name: 'path',
                    type: 'string',
                    default: '',
                    placeholder: '',
                    required: true,
                    description: 'The path to listen to',
                },
            ],
        };
    }
    webhook() {
        return __awaiter(this, void 0, void 0, function* () {
            // The data to return and so start the workflow with
            const returnData = [];
            returnData.push({
                headers: this.getHeaderData(),
                params: this.getParamsData(),
                query: this.getQueryData(),
                body: this.getBodyData(),
            });
            return {
                workflowData: [this.helpers.returnJsonArray(returnData)],
            };
        });
    }
}
exports.ClassNameReplace = ClassNameReplace;
