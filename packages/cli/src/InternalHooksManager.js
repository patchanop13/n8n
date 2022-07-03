"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalHooksManager = void 0;
const InternalHooks_1 = require("./InternalHooks");
const telemetry_1 = require("./telemetry");
class InternalHooksManager {
    static getInstance() {
        if (this.internalHooksInstance) {
            return this.internalHooksInstance;
        }
        throw new Error('InternalHooks not initialized');
    }
    static init(instanceId, versionCli, nodeTypes) {
        if (!this.internalHooksInstance) {
            this.internalHooksInstance = new InternalHooks_1.InternalHooksClass(new telemetry_1.Telemetry(instanceId, versionCli), versionCli, nodeTypes);
        }
        return this.internalHooksInstance;
    }
}
exports.InternalHooksManager = InternalHooksManager;
