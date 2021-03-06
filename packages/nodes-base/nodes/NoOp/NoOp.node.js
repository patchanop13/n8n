"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoOp = void 0;
class NoOp {
    constructor() {
        this.description = {
            displayName: 'No Operation, do nothing',
            name: 'noOp',
            icon: 'fa:arrow-right',
            group: ['organization'],
            version: 1,
            description: 'No Operation',
            defaults: {
                name: 'NoOp',
                color: '#b0b0b0',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [],
        };
    }
    execute() {
        const items = this.getInputData();
        return this.prepareOutputData(items);
    }
}
exports.NoOp = NoOp;
