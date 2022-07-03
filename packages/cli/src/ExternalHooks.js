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
exports.ExternalHooks = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
const config_1 = __importDefault(require("../config"));
class ExternalHooksClass {
    constructor() {
        this.externalHooks = {};
        this.initDidRun = false;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.initDidRun) {
                return;
            }
            yield this.loadHooksFiles();
            this.initDidRun = true;
        });
    }
    reload(externalHooks) {
        return __awaiter(this, void 0, void 0, function* () {
            this.externalHooks = {};
            if (externalHooks === undefined) {
                yield this.loadHooksFiles(true);
            }
            else {
                this.loadHooks(externalHooks);
            }
        });
    }
    loadHooksFiles(reload = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const externalHookFiles = config_1.default.getEnv('externalHookFiles').split(':');
            // Load all the provided hook-files
            for (let hookFilePath of externalHookFiles) {
                hookFilePath = hookFilePath.trim();
                if (hookFilePath !== '') {
                    try {
                        if (reload) {
                            delete require.cache[require.resolve(hookFilePath)];
                        }
                        // eslint-disable-next-line import/no-dynamic-require
                        // eslint-disable-next-line global-require
                        const hookFile = require(hookFilePath);
                        this.loadHooks(hookFile);
                    }
                    catch (error) {
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                        throw new Error(`Problem loading external hook file "${hookFilePath}": ${error.message}`);
                    }
                }
            }
        });
    }
    loadHooks(hookFileData) {
        for (const resource of Object.keys(hookFileData)) {
            for (const operation of Object.keys(hookFileData[resource])) {
                // Save all the hook functions directly under their string
                // format in an array
                const hookString = `${resource}.${operation}`;
                if (this.externalHooks[hookString] === undefined) {
                    this.externalHooks[hookString] = [];
                }
                // eslint-disable-next-line prefer-spread
                this.externalHooks[hookString].push.apply(this.externalHooks[hookString], hookFileData[resource][operation]);
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    run(hookName, hookParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const externalHookFunctions = {
                dbCollections: _1.Db.collections,
            };
            if (this.externalHooks[hookName] === undefined) {
                return;
            }
            for (const externalHookFunction of this.externalHooks[hookName]) {
                // eslint-disable-next-line no-await-in-loop
                yield externalHookFunction.apply(externalHookFunctions, hookParameters);
            }
        });
    }
    exists(hookName) {
        return !!this.externalHooks[hookName];
    }
}
let externalHooksInstance;
// eslint-disable-next-line @typescript-eslint/naming-convention
function ExternalHooks() {
    if (externalHooksInstance === undefined) {
        externalHooksInstance = new ExternalHooksClass();
    }
    return externalHooksInstance;
}
exports.ExternalHooks = ExternalHooks;
