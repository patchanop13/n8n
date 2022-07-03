"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Telemetry = void 0;
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const rudder_sdk_node_1 = __importDefault(require("@rudderstack/rudder-sdk-node"));
const n8n_workflow_1 = require("n8n-workflow");
const config = __importStar(require("../../config"));
const Logger_1 = require("../Logger");
class Telemetry {
    constructor(instanceId, versionCli) {
        this.executionCountsBuffer = {
            counts: {},
            firstExecutions: {
                first_manual_error: undefined,
                first_manual_success: undefined,
                first_prod_error: undefined,
                first_prod_success: undefined,
            },
        };
        this.instanceId = instanceId;
        this.versionCli = versionCli;
        const enabled = config.getEnv('diagnostics.enabled');
        const logLevel = config.getEnv('logs.level');
        if (enabled) {
            const conf = config.getEnv('diagnostics.config.backend');
            const [key, url] = conf.split(';');
            if (!key || !url) {
                const logger = (0, Logger_1.getLogger)();
                n8n_workflow_1.LoggerProxy.init(logger);
                logger.warn('Diagnostics backend config is invalid');
                return;
            }
            this.client = new rudder_sdk_node_1.default(key, url, { logLevel });
            this.pulseIntervalReference = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                void this.pulse();
            }), 6 * 60 * 60 * 1000); // every 6 hours
        }
    }
    pulse() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                return Promise.resolve();
            }
            const allPromises = Object.keys(this.executionCountsBuffer.counts).map((workflowId) => __awaiter(this, void 0, void 0, function* () {
                const promise = this.track('Workflow execution count', Object.assign(Object.assign({ version_cli: this.versionCli, workflow_id: workflowId }, this.executionCountsBuffer.counts[workflowId]), this.executionCountsBuffer.firstExecutions));
                this.executionCountsBuffer.counts[workflowId].manual_error_count = 0;
                this.executionCountsBuffer.counts[workflowId].manual_success_count = 0;
                this.executionCountsBuffer.counts[workflowId].prod_error_count = 0;
                this.executionCountsBuffer.counts[workflowId].prod_success_count = 0;
                return promise;
            }));
            allPromises.push(this.track('pulse', { version_cli: this.versionCli }));
            return Promise.all(allPromises);
        });
    }
    trackWorkflowExecution(properties) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client) {
                const workflowId = properties.workflow_id;
                this.executionCountsBuffer.counts[workflowId] = (_a = this.executionCountsBuffer.counts[workflowId]) !== null && _a !== void 0 ? _a : {
                    manual_error_count: 0,
                    manual_success_count: 0,
                    prod_error_count: 0,
                    prod_success_count: 0,
                };
                let countKey;
                let firstExecKey;
                if (properties.success === false &&
                    properties.error_node_type &&
                    properties.error_node_type.startsWith('n8n-nodes-base')) {
                    // errored exec
                    void this.track('Workflow execution errored', properties);
                    if (properties.is_manual) {
                        firstExecKey = 'first_manual_error';
                        countKey = 'manual_error_count';
                    }
                    else {
                        firstExecKey = 'first_prod_error';
                        countKey = 'prod_error_count';
                    }
                }
                else if (properties.is_manual) {
                    countKey = 'manual_success_count';
                    firstExecKey = 'first_manual_success';
                }
                else {
                    countKey = 'prod_success_count';
                    firstExecKey = 'first_prod_success';
                }
                if (!this.executionCountsBuffer.firstExecutions[firstExecKey] &&
                    this.executionCountsBuffer.counts[workflowId][countKey] === 0) {
                    this.executionCountsBuffer.firstExecutions[firstExecKey] = new Date();
                }
                this.executionCountsBuffer.counts[workflowId][countKey]++;
            }
        });
    }
    trackN8nStop() {
        return __awaiter(this, void 0, void 0, function* () {
            clearInterval(this.pulseIntervalReference);
            void this.track('User instance stopped');
            return new Promise((resolve) => {
                if (this.client) {
                    this.client.flush(resolve);
                }
                else {
                    resolve();
                }
            });
        });
    }
    identify(traits) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (this.client) {
                    this.client.identify({
                        userId: this.instanceId,
                        anonymousId: '000000000000',
                        traits: Object.assign(Object.assign({}, traits), { instanceId: this.instanceId }),
                    }, resolve);
                }
                else {
                    resolve();
                }
            });
        });
    }
    track(eventName, properties = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                if (this.client) {
                    const { user_id } = properties;
                    Object.assign(properties, { instance_id: this.instanceId });
                    this.client.track({
                        userId: `${this.instanceId}${user_id ? `#${user_id}` : ''}`,
                        anonymousId: '000000000000',
                        event: eventName,
                        properties,
                    }, resolve);
                }
                else {
                    resolve();
                }
            });
        });
    }
}
exports.Telemetry = Telemetry;
