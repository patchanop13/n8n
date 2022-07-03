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
exports.WorkflowCredentials = void 0;
// eslint-disable-next-line import/no-cycle
const _1 = require(".");
// eslint-disable-next-line @typescript-eslint/naming-convention
function WorkflowCredentials(nodes) {
    return __awaiter(this, void 0, void 0, function* () {
        // Go through all nodes to find which credentials are needed to execute the workflow
        const returnCredentials = {};
        let node;
        let type;
        let nodeCredentials;
        let foundCredentials;
        // eslint-disable-next-line no-restricted-syntax
        for (node of nodes) {
            if (node.disabled === true || !node.credentials) {
                // eslint-disable-next-line no-continue
                continue;
            }
            // eslint-disable-next-line no-restricted-syntax
            for (type of Object.keys(node.credentials)) {
                if (!returnCredentials[type]) {
                    returnCredentials[type] = {};
                }
                nodeCredentials = node.credentials[type];
                if (!nodeCredentials.id) {
                    throw new Error(`Credentials with name "${nodeCredentials.name}" for type "${type}" miss an ID.`);
                }
                if (!returnCredentials[type][nodeCredentials.id]) {
                    // eslint-disable-next-line no-await-in-loop
                    foundCredentials = yield _1.Db.collections.Credentials.findOne({
                        id: nodeCredentials.id,
                        type,
                    });
                    if (!foundCredentials) {
                        throw new Error(`Could not find credentials for type "${type}" with ID "${nodeCredentials.id}".`);
                    }
                    // eslint-disable-next-line prefer-destructuring
                    returnCredentials[type][nodeCredentials.id] = foundCredentials;
                }
            }
        }
        return returnCredentials;
    });
}
exports.WorkflowCredentials = WorkflowCredentials;
