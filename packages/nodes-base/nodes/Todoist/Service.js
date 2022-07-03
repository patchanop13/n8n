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
exports.OperationType = exports.TodoistService = void 0;
const OperationHandler_1 = require("./OperationHandler");
class TodoistService {
    constructor() {
        this.handlers = {
            'create': new OperationHandler_1.CreateHandler(),
            'close': new OperationHandler_1.CloseHandler(),
            'delete': new OperationHandler_1.DeleteHandler(),
            'get': new OperationHandler_1.GetHandler(),
            'getAll': new OperationHandler_1.GetAllHandler(),
            'reopen': new OperationHandler_1.ReopenHandler(),
            'update': new OperationHandler_1.UpdateHandler(),
            'move': new OperationHandler_1.MoveHandler(),
            'sync': new OperationHandler_1.SyncHandler(),
        };
    }
    execute(ctx, operation) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.handlers[operation].handleOperation(ctx, 0);
        });
    }
}
exports.TodoistService = TodoistService;
var OperationType;
(function (OperationType) {
    OperationType["create"] = "create";
    OperationType["close"] = "close";
    OperationType["delete"] = "delete";
    OperationType["get"] = "get";
    OperationType["getAll"] = "getAll";
    OperationType["reopen"] = "reopen";
    OperationType["update"] = "update";
    OperationType["move"] = "move";
    OperationType["sync"] = "sync";
})(OperationType = exports.OperationType || (exports.OperationType = {}));
