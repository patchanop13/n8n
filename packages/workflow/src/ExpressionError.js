"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionError = void 0;
// eslint-disable-next-line import/no-cycle
const NodeErrors_1 = require("./NodeErrors");
/**
 * Class for instantiating an expression error
 */
class ExpressionError extends NodeErrors_1.ExecutionBaseError {
    constructor(message, options) {
        super(new Error(message));
        if ((options === null || options === void 0 ? void 0 : options.description) !== undefined) {
            this.description = options.description;
        }
        if ((options === null || options === void 0 ? void 0 : options.causeDetailed) !== undefined) {
            this.context.causeDetailed = options.causeDetailed;
        }
        if ((options === null || options === void 0 ? void 0 : options.runIndex) !== undefined) {
            this.context.runIndex = options.runIndex;
        }
        if ((options === null || options === void 0 ? void 0 : options.itemIndex) !== undefined) {
            this.context.itemIndex = options.itemIndex;
        }
        if ((options === null || options === void 0 ? void 0 : options.parameter) !== undefined) {
            this.context.parameter = options.parameter;
        }
        if ((options === null || options === void 0 ? void 0 : options.messageTemplate) !== undefined) {
            this.context.messageTemplate = options.messageTemplate;
        }
        this.context.failExecution = !!(options === null || options === void 0 ? void 0 : options.failExecution);
    }
}
exports.ExpressionError = ExpressionError;
