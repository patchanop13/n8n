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
exports.ExecuteCommand = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const child_process_1 = require("child_process");
/**
 * Promisifiy exec manually to also get the exit code
 *
 * @param {string} command
 * @returns {Promise<IExecReturnData>}
 */
function execPromise(command) {
    const returnData = {
        error: undefined,
        exitCode: 0,
        stderr: '',
        stdout: '',
    };
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
            returnData.stdout = stdout.trim();
            returnData.stderr = stderr.trim();
            if (error) {
                returnData.error = error;
            }
            resolve(returnData);
        }).on('exit', code => { returnData.exitCode = code || 0; });
    });
}
class ExecuteCommand {
    constructor() {
        this.description = {
            displayName: 'Execute Command',
            name: 'executeCommand',
            icon: 'fa:terminal',
            group: ['transform'],
            version: 1,
            description: 'Executes a command on the host',
            defaults: {
                name: 'Execute Command',
                color: '#886644',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Execute Once',
                    name: 'executeOnce',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to execute only once instead of once for each entry',
                },
                {
                    displayName: 'Command',
                    name: 'command',
                    typeOptions: {
                        rows: 5,
                    },
                    type: 'string',
                    default: '',
                    placeholder: 'echo "test"',
                    description: 'The command to execute',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let items = this.getInputData();
            let command;
            const executeOnce = this.getNodeParameter('executeOnce', 0);
            if (executeOnce === true) {
                items = [items[0]];
            }
            const returnItems = [];
            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                try {
                    command = this.getNodeParameter('command', itemIndex);
                    const { error, exitCode, stdout, stderr, } = yield execPromise(command);
                    if (error !== undefined) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), error.message);
                    }
                    returnItems.push({
                        json: {
                            exitCode,
                            stderr,
                            stdout,
                        },
                        pairedItem: {
                            item: itemIndex,
                        },
                    });
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnItems.push({
                            json: {
                                error: error.message,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                        continue;
                    }
                    throw error;
                }
            }
            return this.prepareOutputData(returnItems);
        });
    }
}
exports.ExecuteCommand = ExecuteCommand;
