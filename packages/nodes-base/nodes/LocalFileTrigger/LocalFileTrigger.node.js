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
exports.LocalFileTrigger = void 0;
const chokidar_1 = require("chokidar");
class LocalFileTrigger {
    constructor() {
        this.description = {
            displayName: 'Local File Trigger',
            name: 'localFileTrigger',
            icon: 'fa:folder-open',
            group: ['trigger'],
            version: 1,
            subtitle: '=Path: {{$parameter["path"]}}',
            description: 'Triggers a workflow on file system changes',
            eventTriggerDescription: '',
            defaults: {
                name: 'Local File Trigger',
                color: '#404040',
            },
            inputs: [],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Trigger On',
                    name: 'triggerOn',
                    type: 'options',
                    options: [
                        {
                            name: 'Changes to a Specific File',
                            value: 'file',
                        },
                        {
                            name: 'Changes Involving a Specific Folder',
                            value: 'folder',
                        },
                    ],
                    required: true,
                    default: '',
                },
                {
                    displayName: 'File to Watch',
                    name: 'path',
                    type: 'string',
                    displayOptions: {
                        show: {
                            triggerOn: [
                                'file',
                            ],
                        },
                    },
                    default: '',
                    placeholder: '/data/invoices/1.pdf',
                },
                {
                    displayName: 'Folder to Watch',
                    name: 'path',
                    type: 'string',
                    displayOptions: {
                        show: {
                            triggerOn: [
                                'folder',
                            ],
                        },
                    },
                    default: '',
                    placeholder: '/data/invoices',
                },
                {
                    displayName: 'Watch for',
                    name: 'events',
                    type: 'multiOptions',
                    displayOptions: {
                        show: {
                            triggerOn: [
                                'folder',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'File Added',
                            value: 'add',
                            description: 'Triggers whenever a new file was added',
                        },
                        {
                            name: 'File Changed',
                            value: 'change',
                            description: 'Triggers whenever a file was changed',
                        },
                        {
                            name: 'File Deleted',
                            value: 'unlink',
                            description: 'Triggers whenever a file was deleted',
                        },
                        {
                            name: 'Folder Added',
                            value: 'addDir',
                            description: 'Triggers whenever a new folder was added',
                        },
                        {
                            name: 'Folder Deleted',
                            value: 'unlinkDir',
                            description: 'Triggers whenever a folder was deleted',
                        },
                    ],
                    required: true,
                    default: [],
                    description: 'The events to listen to',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Include Linked Files/Folders',
                            name: 'followSymlinks',
                            type: 'boolean',
                            default: true,
                            description: 'Whether linked files/folders will also be watched (this includes symlinks, aliases on MacOS and shortcuts on Windows). Otherwise only the links themselves will be monitored).',
                        },
                        {
                            displayName: 'Ignore',
                            name: 'ignored',
                            type: 'string',
                            default: '',
                            placeholder: '**/*.txt',
                            description: 'Files or paths to ignore. The whole path is tested, not just the filename.??Supports <a href="https://github.com/micromatch/anymatch">Anymatch</a>- syntax.',
                        },
                        // eslint-disable-next-line n8n-nodes-base/node-param-default-missing
                        {
                            displayName: 'Max Folder Depth',
                            name: 'depth',
                            type: 'options',
                            options: [
                                {
                                    name: '1 Levels Down',
                                    value: 1,
                                },
                                {
                                    name: '2 Levels Down',
                                    value: 2,
                                },
                                {
                                    name: '3 Levels Down',
                                    value: 3,
                                },
                                {
                                    name: '4 Levels Down',
                                    value: 4,
                                },
                                {
                                    name: '5 Levels Down',
                                    value: 5,
                                },
                                {
                                    name: 'Top Folder Only',
                                    value: 0,
                                },
                                {
                                    name: 'Unlimited',
                                    value: -1,
                                },
                            ],
                            default: -1,
                            description: 'How deep into the folder structure to watch for changes',
                        },
                    ],
                },
            ],
        };
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            const triggerOn = this.getNodeParameter('triggerOn');
            const path = this.getNodeParameter('path');
            const options = this.getNodeParameter('options', {});
            let events;
            if (triggerOn === 'file') {
                events = ['change'];
            }
            else {
                events = this.getNodeParameter('events', []);
            }
            const watcher = (0, chokidar_1.watch)(path, {
                ignored: options.ignored,
                persistent: true,
                ignoreInitial: true,
                followSymlinks: options.followSymlinks === undefined ? true : options.followSymlinks,
                depth: [-1, undefined].includes(options.depth) ? undefined : options.depth,
            });
            const executeTrigger = (event, path) => {
                this.emit([this.helpers.returnJsonArray([{ event, path }])]);
            };
            for (const eventName of events) {
                watcher.on(eventName, path => executeTrigger(eventName, path));
            }
            function closeFunction() {
                return watcher.close();
            }
            return {
                closeFunction,
            };
        });
    }
}
exports.LocalFileTrigger = LocalFileTrigger;
