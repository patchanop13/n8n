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
exports.ActiveWebhooks = void 0;
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
class ActiveWebhooks {
    constructor() {
        this.workflowWebhooks = {};
        this.webhookUrls = {};
        this.testWebhooks = false;
    }
    /**
     * Adds a new webhook
     *
     * @param {IWebhookData} webhookData
     * @param {WorkflowExecuteMode} mode
     * @returns {Promise<void>}
     * @memberof ActiveWebhooks
     */
    add(workflow, webhookData, mode, activation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (workflow.id === undefined) {
                throw new Error('Webhooks can only be added for saved workflows as an id is needed!');
            }
            if (webhookData.path.endsWith('/')) {
                // eslint-disable-next-line no-param-reassign
                webhookData.path = webhookData.path.slice(0, -1);
            }
            const webhookKey = this.getWebhookKey(webhookData.httpMethod, webhookData.path, webhookData.webhookId);
            // check that there is not a webhook already registed with that path/method
            if (this.webhookUrls[webhookKey] && !webhookData.webhookId) {
                throw new Error(`The URL path that the "${webhookData.node}" node uses is already taken. Please change it to something else.`);
            }
            if (this.workflowWebhooks[webhookData.workflowId] === undefined) {
                this.workflowWebhooks[webhookData.workflowId] = [];
            }
            // Make the webhook available directly because sometimes to create it successfully
            // it gets called
            if (!this.webhookUrls[webhookKey]) {
                this.webhookUrls[webhookKey] = [];
            }
            this.webhookUrls[webhookKey].push(webhookData);
            try {
                const webhookExists = yield workflow.runWebhookMethod('checkExists', webhookData, _1.NodeExecuteFunctions, mode, activation, this.testWebhooks);
                if (webhookExists !== true) {
                    // If webhook does not exist yet create it
                    yield workflow.runWebhookMethod('create', webhookData, _1.NodeExecuteFunctions, mode, activation, this.testWebhooks);
                }
            }
            catch (error) {
                // If there was a problem unregister the webhook again
                if (this.webhookUrls[webhookKey].length <= 1) {
                    delete this.webhookUrls[webhookKey];
                }
                else {
                    this.webhookUrls[webhookKey] = this.webhookUrls[webhookKey].filter((webhook) => webhook.path !== webhookData.path);
                }
                throw error;
            }
            this.workflowWebhooks[webhookData.workflowId].push(webhookData);
        });
    }
    /**
     * Returns webhookData if a webhook with matches is currently registered
     *
     * @param {WebhookHttpMethod} httpMethod
     * @param {string} path
     * @param {(string | undefined)} webhookId
     * @returns {(IWebhookData | undefined)}
     * @memberof ActiveWebhooks
     */
    get(httpMethod, path, webhookId) {
        const webhookKey = this.getWebhookKey(httpMethod, path, webhookId);
        if (this.webhookUrls[webhookKey] === undefined) {
            return undefined;
        }
        let webhook;
        let maxMatches = 0;
        const pathElementsSet = new Set(path.split('/'));
        // check if static elements match in path
        // if more results have been returned choose the one with the most static-route matches
        this.webhookUrls[webhookKey].forEach((dynamicWebhook) => {
            const staticElements = dynamicWebhook.path.split('/').filter((ele) => !ele.startsWith(':'));
            const allStaticExist = staticElements.every((staticEle) => pathElementsSet.has(staticEle));
            if (allStaticExist && staticElements.length > maxMatches) {
                maxMatches = staticElements.length;
                webhook = dynamicWebhook;
            }
            // handle routes with no static elements
            else if (staticElements.length === 0 && !webhook) {
                webhook = dynamicWebhook;
            }
        });
        return webhook;
    }
    /**
     * Gets all request methods associated with a single webhook
     * @param path
     */
    getWebhookMethods(path) {
        const methods = [];
        Object.keys(this.webhookUrls)
            .filter((key) => key.includes(path))
            // eslint-disable-next-line array-callback-return
            .map((key) => {
            methods.push(key.split('|')[0]);
        });
        return methods;
    }
    /**
     * Returns the ids of all the workflows which have active webhooks
     *
     * @returns {string[]}
     * @memberof ActiveWebhooks
     */
    getWorkflowIds() {
        return Object.keys(this.workflowWebhooks);
    }
    /**
     * Returns key to uniquely identify a webhook
     *
     * @param {WebhookHttpMethod} httpMethod
     * @param {string} path
     * @param {(string | undefined)} webhookId
     * @returns {string}
     * @memberof ActiveWebhooks
     */
    getWebhookKey(httpMethod, path, webhookId) {
        if (webhookId) {
            if (path.startsWith(webhookId)) {
                const cutFromIndex = path.indexOf('/') + 1;
                // eslint-disable-next-line no-param-reassign
                path = path.slice(cutFromIndex);
            }
            return `${httpMethod}|${webhookId}|${path.split('/').length}`;
        }
        return `${httpMethod}|${path}`;
    }
    /**
     * Removes all webhooks of a workflow
     *
     * @param {Workflow} workflow
     * @returns {boolean}
     * @memberof ActiveWebhooks
     */
    removeWorkflow(workflow) {
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const workflowId = workflow.id.toString();
            if (this.workflowWebhooks[workflowId] === undefined) {
                // If it did not exist then there is nothing to remove
                return false;
            }
            const webhooks = this.workflowWebhooks[workflowId];
            const mode = 'internal';
            // Go through all the registered webhooks of the workflow and remove them
            // eslint-disable-next-line no-restricted-syntax
            for (const webhookData of webhooks) {
                // eslint-disable-next-line no-await-in-loop
                yield workflow.runWebhookMethod('delete', webhookData, _1.NodeExecuteFunctions, mode, 'update', this.testWebhooks);
                delete this.webhookUrls[this.getWebhookKey(webhookData.httpMethod, webhookData.path, webhookData.webhookId)];
            }
            // Remove also the workflow-webhook entry
            delete this.workflowWebhooks[workflowId];
            return true;
        });
    }
    /**
     * Removes all the webhooks of the given workflows
     */
    removeAll(workflows) {
        return __awaiter(this, void 0, void 0, function* () {
            const removePromises = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const workflow of workflows) {
                removePromises.push(this.removeWorkflow(workflow));
            }
            yield Promise.all(removePromises);
        });
    }
}
exports.ActiveWebhooks = ActiveWebhooks;
