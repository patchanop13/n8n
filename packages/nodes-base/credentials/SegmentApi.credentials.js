"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentApi = void 0;
class SegmentApi {
    constructor() {
        this.name = 'segmentApi';
        this.displayName = 'Segment API';
        this.documentationUrl = 'segment';
        this.properties = [
            {
                displayName: 'Write Key',
                name: 'writekey',
                type: 'string',
                default: '',
            },
        ];
    }
}
exports.SegmentApi = SegmentApi;
