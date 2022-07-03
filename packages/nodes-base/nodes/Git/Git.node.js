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
exports.Git = void 0;
const descriptions_1 = require("./descriptions");
const simple_git_1 = __importDefault(require("simple-git"));
const promises_1 = require("fs/promises");
const url_1 = require("url");
class Git {
    constructor() {
        this.description = {
            displayName: 'Git',
            name: 'git',
            icon: 'file:git.svg',
            group: ['transform'],
            version: 1,
            description: 'Control git.',
            defaults: {
                name: 'Git',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'gitPassword',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'gitPassword',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Authenticate',
                            value: 'gitPassword',
                        },
                        {
                            name: 'None',
                            value: 'none',
                        },
                    ],
                    displayOptions: {
                        show: {
                            operation: [
                                'clone',
                                'push',
                            ],
                        },
                    },
                    default: 'none',
                    description: 'The way to authenticate',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    default: 'log',
                    options: [
                        {
                            name: 'Add',
                            value: 'add',
                            description: 'Add a file or folder to commit',
                        },
                        {
                            name: 'Add Config',
                            value: 'addConfig',
                            description: 'Add configuration property',
                        },
                        {
                            name: 'Clone',
                            value: 'clone',
                            description: 'Clone a repository',
                        },
                        {
                            name: 'Commit',
                            value: 'commit',
                            description: 'Commit files or folders to git',
                        },
                        {
                            name: 'Fetch',
                            value: 'fetch',
                            description: 'Fetch from remote repository',
                        },
                        {
                            name: 'List Config',
                            value: 'listConfig',
                            description: 'Return current configuration',
                        },
                        {
                            name: 'Log',
                            value: 'log',
                            description: 'Return git commit history',
                        },
                        {
                            name: 'Pull',
                            value: 'pull',
                            description: 'Pull from remote repository',
                        },
                        {
                            name: 'Push',
                            value: 'push',
                            description: 'Push to remote repository',
                        },
                        {
                            name: 'Push Tags',
                            value: 'pushTags',
                            description: 'Push Tags to remote repository',
                        },
                        {
                            name: 'Status',
                            value: 'status',
                            description: 'Return status of current repository',
                        },
                        {
                            name: 'Tag',
                            value: 'tag',
                            description: 'Create a new tag',
                        },
                        {
                            name: 'User Setup',
                            value: 'userSetup',
                            description: 'Set the user',
                        },
                    ],
                },
                {
                    displayName: 'Repository Path',
                    name: 'repositoryPath',
                    type: 'string',
                    displayOptions: {
                        hide: {
                            operation: [
                                'clone',
                            ],
                        },
                    },
                    default: '',
                    placeholder: '/tmp/repository',
                    required: true,
                    description: 'Local path of the git repository to operate on',
                },
                {
                    displayName: 'New Repository Path',
                    name: 'repositoryPath',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: [
                                'clone',
                            ],
                        },
                    },
                    default: '',
                    placeholder: '/tmp/repository',
                    required: true,
                    description: 'Local path to which the git repository should be cloned into',
                },
                ...descriptions_1.addFields,
                ...descriptions_1.addConfigFields,
                ...descriptions_1.cloneFields,
                ...descriptions_1.commitFields,
                ...descriptions_1.logFields,
                ...descriptions_1.pushFields,
                ...descriptions_1.tagFields,
                // ...userSetupFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const prepareRepository = (repositoryPath) => __awaiter(this, void 0, void 0, function* () {
                const authentication = this.getNodeParameter('authentication', 0);
                if (authentication === 'gitPassword') {
                    const gitCredentials = yield this.getCredentials('gitPassword');
                    const url = new url_1.URL(repositoryPath);
                    url.username = gitCredentials.username;
                    url.password = gitCredentials.password;
                    return url.toString();
                }
                return repositoryPath;
            });
            const operation = this.getNodeParameter('operation', 0);
            let item;
            const returnItems = [];
            for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
                try {
                    item = items[itemIndex];
                    const repositoryPath = this.getNodeParameter('repositoryPath', itemIndex, '');
                    const options = this.getNodeParameter('options', itemIndex, {});
                    if (operation === 'clone') {
                        // Create repository folder if it does not exist
                        try {
                            yield (0, promises_1.access)(repositoryPath);
                        }
                        catch (error) {
                            yield (0, promises_1.mkdir)(repositoryPath);
                        }
                    }
                    const gitOptions = {
                        baseDir: repositoryPath,
                    };
                    const git = (0, simple_git_1.default)(gitOptions)
                        // Tell git not to ask for any information via the terminal like for
                        // example the username. As nobody will be able to answer it would
                        // n8n keep on waiting forever.
                        .env('GIT_TERMINAL_PROMPT', '0');
                    if (operation === 'add') {
                        // ----------------------------------
                        //         add
                        // ----------------------------------
                        const pathsToAdd = this.getNodeParameter('pathsToAdd', itemIndex, '');
                        yield git.add(pathsToAdd.split(','));
                        returnItems.push({
                            json: {
                                success: true,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                    }
                    else if (operation === 'addConfig') {
                        // ----------------------------------
                        //         addConfig
                        // ----------------------------------
                        const key = this.getNodeParameter('key', itemIndex, '');
                        const value = this.getNodeParameter('value', itemIndex, '');
                        let append = false;
                        if (options.mode === 'append') {
                            append = true;
                        }
                        yield git.addConfig(key, value, append);
                        returnItems.push({
                            json: {
                                success: true,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                    }
                    else if (operation === 'clone') {
                        // ----------------------------------
                        //         clone
                        // ----------------------------------
                        let sourceRepository = this.getNodeParameter('sourceRepository', itemIndex, '');
                        sourceRepository = yield prepareRepository(sourceRepository);
                        yield git.clone(sourceRepository, '.');
                        returnItems.push({
                            json: {
                                success: true,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                    }
                    else if (operation === 'commit') {
                        // ----------------------------------
                        //         commit
                        // ----------------------------------
                        const message = this.getNodeParameter('message', itemIndex, '');
                        let pathsToAdd = undefined;
                        if (options.files !== undefined) {
                            pathsToAdd = options.pathsToAdd.split(',');
                        }
                        yield git.commit(message, pathsToAdd);
                        returnItems.push({
                            json: {
                                success: true,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                    }
                    else if (operation === 'fetch') {
                        // ----------------------------------
                        //         fetch
                        // ----------------------------------
                        yield git.fetch();
                        returnItems.push({
                            json: {
                                success: true,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                    }
                    else if (operation === 'log') {
                        // ----------------------------------
                        //         log
                        // ----------------------------------
                        const logOptions = {};
                        const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
                        if (returnAll === false) {
                            logOptions.maxCount = this.getNodeParameter('limit', itemIndex, 100);
                        }
                        if (options.file) {
                            logOptions.file = options.file;
                        }
                        const log = yield git.log(logOptions);
                        // @ts-ignore
                        returnItems.push(...this.helpers.returnJsonArray(log.all).map(item => {
                            return Object.assign(Object.assign({}, item), { pairedItem: { item: itemIndex } });
                        }));
                    }
                    else if (operation === 'pull') {
                        // ----------------------------------
                        //         pull
                        // ----------------------------------
                        yield git.pull();
                        returnItems.push({
                            json: {
                                success: true,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                    }
                    else if (operation === 'push') {
                        // ----------------------------------
                        //         push
                        // ----------------------------------
                        if (options.repository) {
                            const targetRepository = yield prepareRepository(options.targetRepository);
                            yield git.push(targetRepository);
                        }
                        else {
                            const authentication = this.getNodeParameter('authentication', 0);
                            if (authentication === 'gitPassword') {
                                // Try to get remote repository path from git repository itself to add
                                // authentication data
                                const config = yield git.listConfig();
                                let targetRepository;
                                for (const fileName of Object.keys(config.values)) {
                                    if (config.values[fileName]['remote.origin.url']) {
                                        targetRepository = config.values[fileName]['remote.origin.url'];
                                        break;
                                    }
                                }
                                targetRepository = yield prepareRepository(targetRepository);
                                yield git.push(targetRepository);
                            }
                            else {
                                yield git.push();
                            }
                        }
                        returnItems.push({
                            json: {
                                success: true,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                    }
                    else if (operation === 'pushTags') {
                        // ----------------------------------
                        //         pushTags
                        // ----------------------------------
                        yield git.pushTags();
                        returnItems.push({
                            json: {
                                success: true,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                    }
                    else if (operation === 'listConfig') {
                        // ----------------------------------
                        //         listConfig
                        // ----------------------------------
                        const config = yield git.listConfig();
                        const data = [];
                        for (const fileName of Object.keys(config.values)) {
                            data.push(Object.assign({ _file: fileName }, config.values[fileName]));
                        }
                        // @ts-ignore
                        returnItems.push(...this.helpers.returnJsonArray(data).map(item => {
                            return Object.assign(Object.assign({}, item), { pairedItem: { item: itemIndex } });
                        }));
                    }
                    else if (operation === 'status') {
                        // ----------------------------------
                        //         status
                        // ----------------------------------
                        const status = yield git.status();
                        // @ts-ignore
                        returnItems.push(...this.helpers.returnJsonArray([status]).map(item => {
                            return Object.assign(Object.assign({}, item), { pairedItem: { item: itemIndex } });
                        }));
                    }
                    else if (operation === 'tag') {
                        // ----------------------------------
                        //         tag
                        // ----------------------------------
                        const name = this.getNodeParameter('name', itemIndex, '');
                        yield git.addTag(name);
                        returnItems.push({
                            json: {
                                success: true,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnItems.push({
                            json: {
                                error: error.toString(),
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
exports.Git = Git;
