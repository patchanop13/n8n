"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowActivationError = void 0;
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
/**
 * Class for instantiating an workflow activation error
 */
class WorkflowActivationError extends _1.ExecutionBaseError {
    constructor(message, error, node) {
        super(error);
        this.node = node;
        this.cause = {
            message: error.message,
            stack: error.stack,
        };
        this.message = message;
    }
}
exports.WorkflowActivationError = WorkflowActivationError;
