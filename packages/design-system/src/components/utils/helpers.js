"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTargetBlank = void 0;
function addTargetBlank(html) {
    return html && html.includes('href=')
        ? html.replace(/href=/g, 'target="_blank" href=')
        : html;
}
exports.addTargetBlank = addTargetBlank;
