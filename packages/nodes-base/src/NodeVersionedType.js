"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeVersionedType = void 0;
class NodeVersionedType {
    constructor(nodeVersions, description) {
        var _a;
        this.nodeVersions = nodeVersions;
        this.currentVersion = (_a = description.defaultVersion) !== null && _a !== void 0 ? _a : this.getLatestVersion();
        this.description = description;
    }
    getLatestVersion() {
        return Math.max(...Object.keys(this.nodeVersions).map(Number));
    }
    getNodeType(version) {
        if (version) {
            return this.nodeVersions[version];
        }
        else {
            return this.nodeVersions[this.currentVersion];
        }
    }
}
exports.NodeVersionedType = NodeVersionedType;
