"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowOperationError = void 0;
/**
 * Class for instantiating an operational error, e.g. a timeout error.
 */
class WorkflowOperationError extends Error {
    constructor(message, node) {
        super(message);
        this.name = this.constructor.name;
        this.node = node;
        this.timestamp = Date.now();
    }
}
exports.WorkflowOperationError = WorkflowOperationError;
