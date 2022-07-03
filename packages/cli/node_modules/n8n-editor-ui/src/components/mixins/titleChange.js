"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleChange = void 0;
const vue_1 = __importDefault(require("vue"));
exports.titleChange = vue_1.default.extend({
    methods: {
        /**
         * Change title of n8n tab
         *
         * @param {string} workflow Name of workflow
         * @param {WorkflowTitleStatus} status Status of workflow
         */
        $titleSet(workflow, status) {
            let icon = '⚠️';
            if (status === 'EXECUTING') {
                icon = '🔄';
            }
            else if (status === 'IDLE') {
                icon = '▶️';
            }
            window.document.title = `n8n - ${icon} ${workflow}`;
        },
        $titleReset() {
            document.title = `n8n - Workflow Automation`;
        },
    },
});
