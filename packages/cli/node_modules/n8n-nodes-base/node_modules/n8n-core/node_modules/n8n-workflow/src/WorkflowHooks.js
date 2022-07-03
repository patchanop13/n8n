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
exports.WorkflowHooks = void 0;
class WorkflowHooks {
    constructor(hookFunctions, mode, executionId, workflowData, optionalParameters) {
        // eslint-disable-next-line no-param-reassign, @typescript-eslint/prefer-nullish-coalescing
        optionalParameters = optionalParameters || {};
        this.hookFunctions = hookFunctions;
        this.mode = mode;
        this.executionId = executionId;
        this.workflowData = workflowData;
        this.sessionId = optionalParameters.sessionId;
        this.retryOf = optionalParameters.retryOf;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    executeHookFunctions(hookName, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-line:no-any
            if (this.hookFunctions[hookName] !== undefined && Array.isArray(this.hookFunctions[hookName])) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, no-restricted-syntax
                for (const hookFunction of this.hookFunctions[hookName]) {
                    // eslint-disable-next-line no-await-in-loop
                    yield hookFunction.apply(this, parameters);
                }
            }
        });
    }
}
exports.WorkflowHooks = WorkflowHooks;
