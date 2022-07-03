"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StickyNote = void 0;
class StickyNote {
    constructor() {
        this.description = {
            displayName: 'Sticky Note',
            name: 'stickyNote',
            icon: 'fa:sticky-note',
            group: ['input'],
            version: 1,
            description: 'Make your workflow easier to understand',
            defaults: {
                name: 'Note',
                color: '#FFD233',
            },
            // eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
            inputs: [],
            // eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
            outputs: [],
            properties: [
                {
                    displayName: 'Content',
                    name: 'content',
                    type: 'string',
                    required: true,
                    default: `## I'm a note \n**Double click** to edit me. [Guide](https://docs.n8n.io/workflows/sticky-notes/)`,
                },
                {
                    displayName: 'Height',
                    name: 'height',
                    type: 'number',
                    required: true,
                    default: 160,
                },
                {
                    displayName: 'Width',
                    name: 'width',
                    type: 'number',
                    required: true,
                    default: 240,
                },
            ],
        };
    }
    execute() {
        const items = this.getInputData();
        return this.prepareOutputData(items);
    }
}
exports.StickyNote = StickyNote;
