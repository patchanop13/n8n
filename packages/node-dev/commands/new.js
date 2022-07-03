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
Object.defineProperty(exports, "__esModule", { value: true });
exports.New = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const changeCase = __importStar(require("change-case"));
const fs = __importStar(require("fs"));
const inquirer = __importStar(require("inquirer"));
const command_1 = require("@oclif/command");
const path_1 = require("path");
const src_1 = require("../src");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { promisify } = require('util');
const fsAccess = promisify(fs.access);
class New extends command_1.Command {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.log('\nCreate new credentials/node');
                this.log('=========================');
                // Ask for the type of not to be created
                const typeQuestion = {
                    name: 'type',
                    type: 'list',
                    default: 'Node',
                    message: 'What do you want to create?',
                    choices: ['Credentials', 'Node'],
                };
                const typeAnswers = yield inquirer.prompt(typeQuestion);
                let sourceFolder = '';
                const sourceFileName = 'simple.ts';
                let defaultName = '';
                let getDescription = false;
                if (typeAnswers.type === 'Node') {
                    // Create new node
                    getDescription = true;
                    const nodeTypeQuestion = {
                        name: 'nodeType',
                        type: 'list',
                        default: 'Execute',
                        message: 'What kind of node do you want to create?',
                        choices: ['Execute', 'Trigger', 'Webhook'],
                    };
                    const nodeTypeAnswers = yield inquirer.prompt(nodeTypeQuestion);
                    // Choose a the template-source-file depending on user input.
                    sourceFolder = 'execute';
                    defaultName = 'My Node';
                    if (nodeTypeAnswers.nodeType === 'Trigger') {
                        sourceFolder = 'trigger';
                        defaultName = 'My Trigger';
                    }
                    else if (nodeTypeAnswers.nodeType === 'Webhook') {
                        sourceFolder = 'webhook';
                        defaultName = 'My Webhook';
                    }
                }
                else {
                    // Create new credentials
                    sourceFolder = 'credentials';
                    defaultName = 'My Service API';
                }
                // Ask additional questions to know with what values the
                // variables in the template file should be replaced with
                const additionalQuestions = [
                    {
                        name: 'name',
                        type: 'input',
                        default: defaultName,
                        message: 'How should the node be called?',
                    },
                ];
                if (getDescription) {
                    // Get also a node description
                    additionalQuestions.push({
                        name: 'description',
                        type: 'input',
                        default: 'Node converts input data to chocolate',
                        message: 'What should the node description be?',
                    });
                }
                const additionalAnswers = yield inquirer.prompt(additionalQuestions);
                const nodeName = additionalAnswers.name;
                // Define the source file to be used and the location and name of the new
                // node file
                const destinationFilePath = (0, path_1.join)(process.cwd(), 
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                `${changeCase.pascalCase(nodeName)}.${typeAnswers.type.toLowerCase()}.ts`);
                const sourceFilePath = (0, path_1.join)(__dirname, '../../templates', sourceFolder, sourceFileName);
                // Check if node with the same name already exists in target folder
                // to not overwrite it by accident
                try {
                    yield fsAccess(destinationFilePath);
                    // File does already exist. So ask if it should be overwritten.
                    const overwriteQuestion = [
                        {
                            name: 'overwrite',
                            type: 'confirm',
                            default: false,
                            message: `The file "${destinationFilePath}" already exists and would be overwritten. Do you want to proceed and overwrite the file?`,
                        },
                    ];
                    const overwriteAnswers = yield inquirer.prompt(overwriteQuestion);
                    if (overwriteAnswers.overwrite === false) {
                        this.log('\nNode creation got canceled!');
                        return;
                    }
                }
                catch (error) {
                    // File does not exist. That is exactly what we want so go on.
                }
                // Make sure that the variables in the template file get formated
                // in the correct way
                const replaceValues = {
                    ClassNameReplace: changeCase.pascalCase(nodeName),
                    DisplayNameReplace: changeCase.capitalCase(nodeName),
                    N8nNameReplace: changeCase.camelCase(nodeName),
                    NodeDescriptionReplace: additionalAnswers.description,
                };
                yield (0, src_1.createTemplate)(sourceFilePath, destinationFilePath, replaceValues);
                this.log('\nExecution was successfull:');
                this.log('====================================');
                this.log(`Node got created: ${destinationFilePath}`);
            }
            catch (error) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                this.log(`\nGOT ERROR: "${error.message}"`);
                this.log('====================================');
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                this.log(error.stack);
            }
        });
    }
}
exports.New = New;
New.description = 'Create new credentials/node';
New.examples = [`$ n8n-node-dev new`];
