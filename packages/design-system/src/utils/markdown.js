"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeMarkdown = void 0;
const escapeMarkdown = (html) => {
    if (!html) {
        return '';
    }
    const escaped = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // unescape greater than quotes at start of line
    const withQuotes = escaped.replace(/^((\s)*(&gt;)+)+\s*/gm, (matches) => {
        return matches.replace(/&gt;/g, '>');
    });
    return withQuotes;
};
exports.escapeMarkdown = escapeMarkdown;
