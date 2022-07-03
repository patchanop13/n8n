"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = exports.isString = exports.setPageTitle = exports.filterTemplateNodes = exports.getActivatableTriggerNodes = exports.getTriggerNodeServiceName = exports.getStyleTokenValue = exports.getAppNameFromCredType = exports.convertToHumanReadableDate = exports.convertToDisplayDate = exports.abbreviateNumber = void 0;
const constants_1 = require("@/constants");
const dateformat_1 = __importDefault(require("dateformat"));
const KEYWORDS_TO_FILTER = ['API', 'OAuth1', 'OAuth2'];
const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
function abbreviateNumber(num) {
    const tier = (Math.log10(Math.abs(num)) / 3) | 0;
    if (tier === 0)
        return num;
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = num / scale;
    return Number(scaled.toFixed(1)) + suffix;
}
exports.abbreviateNumber = abbreviateNumber;
function convertToDisplayDate(epochTime) {
    return (0, dateformat_1.default)(epochTime, 'yyyy-mm-dd HH:MM:ss');
}
exports.convertToDisplayDate = convertToDisplayDate;
function convertToHumanReadableDate(epochTime) {
    return (0, dateformat_1.default)(epochTime, 'd mmmm, yyyy @ HH:MM Z');
}
exports.convertToHumanReadableDate = convertToHumanReadableDate;
function getAppNameFromCredType(name) {
    return name.split(' ').filter((word) => !KEYWORDS_TO_FILTER.includes(word)).join(' ');
}
exports.getAppNameFromCredType = getAppNameFromCredType;
function getStyleTokenValue(name) {
    const style = getComputedStyle(document.body);
    return style.getPropertyValue(name);
}
exports.getStyleTokenValue = getStyleTokenValue;
function getTriggerNodeServiceName(nodeType) {
    return nodeType.displayName.replace(/ trigger/i, '');
}
exports.getTriggerNodeServiceName = getTriggerNodeServiceName;
function getActivatableTriggerNodes(nodes) {
    return nodes.filter((node) => {
        // Error Trigger does not behave like other triggers and workflows using it can not be activated
        return !node.disabled && node.type !== constants_1.ERROR_TRIGGER_NODE_TYPE;
    });
}
exports.getActivatableTriggerNodes = getActivatableTriggerNodes;
function filterTemplateNodes(nodes) {
    const notCoreNodes = nodes.filter((node) => {
        return !(node.categories || []).some((category) => category.name === constants_1.CORE_NODES_CATEGORY);
    });
    const results = notCoreNodes.length > 0 ? notCoreNodes : nodes;
    return results.filter((elem) => !constants_1.TEMPLATES_NODES_FILTER.includes(elem.name));
}
exports.filterTemplateNodes = filterTemplateNodes;
function setPageTitle(title) {
    window.document.title = title;
}
exports.setPageTitle = setPageTitle;
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
function isNumber(value) {
    return typeof value === 'number';
}
exports.isNumber = isNumber;
