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
exports.getInstance = exports.Queue = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const bull_1 = __importDefault(require("bull"));
const config_1 = __importDefault(require("../config"));
// eslint-disable-next-line import/no-cycle
const ActiveExecutions = __importStar(require("./ActiveExecutions"));
// eslint-disable-next-line import/no-cycle
const WebhookHelpers = __importStar(require("./WebhookHelpers"));
class Queue {
    constructor() {
        this.activeExecutions = ActiveExecutions.getInstance();
        const prefix = config_1.default.getEnv('queue.bull.prefix');
        const redisOptions = config_1.default.getEnv('queue.bull.redis');
        // Disabling ready check is necessary as it allows worker to
        // quickly reconnect to Redis if Redis crashes or is unreachable
        // for some time. With it enabled, worker might take minutes to realize
        // redis is back up and resume working.
        // More here: https://github.com/OptimalBits/bull/issues/890
        // @ts-ignore
        this.jobQueue = new bull_1.default('jobs', { prefix, redis: redisOptions, enableReadyCheck: false });
        this.jobQueue.on('global:progress', (jobId, progress) => {
            this.activeExecutions.resolveResponsePromise(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            progress.executionId, WebhookHelpers.decodeWebhookResponse(progress.response));
        });
    }
    add(jobData, jobOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.jobQueue.add(jobData, jobOptions);
        });
    }
    getJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.jobQueue.getJob(jobId);
        });
    }
    getJobs(jobTypes) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.jobQueue.getJobs(jobTypes);
        });
    }
    getBullObjectInstance() {
        return this.jobQueue;
    }
    /**
     *
     * @param job A Bull.Job instance
     * @returns boolean true if we were able to securely stop the job
     */
    stopJob(job) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield job.isActive()) {
                // Job is already running so tell it to stop
                yield job.progress(-1);
                return true;
            }
            // Job did not get started yet so remove from queue
            try {
                yield job.remove();
                return true;
            }
            catch (e) {
                yield job.progress(-1);
            }
            return false;
        });
    }
}
exports.Queue = Queue;
let activeQueueInstance;
function getInstance() {
    if (activeQueueInstance === undefined) {
        activeQueueInstance = new Queue();
    }
    return activeQueueInstance;
}
exports.getInstance = getInstance;
