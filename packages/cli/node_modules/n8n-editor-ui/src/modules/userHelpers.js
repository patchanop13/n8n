"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonalizedNodeTypes = exports.isAuthorized = exports.PERMISSIONS = exports.LOGIN_STATUS = exports.ROLE = void 0;
const constants_1 = require("@/constants");
exports.ROLE = {
    Owner: 'owner',
    Member: 'member',
    Default: 'default', // default user with no email when setting up instance
};
exports.LOGIN_STATUS = {
    LoggedIn: 'LoggedIn',
    LoggedOut: 'LoggedOut', // Can only be logged out if UM has been setup
};
exports.PERMISSIONS = {
    TAGS: {
        CAN_DELETE_TAGS: {
            allow: {
                role: [exports.ROLE.Owner, exports.ROLE.Default],
            },
        },
    },
    PRIMARY_MENU: {
        CAN_ACCESS_USER_INFO: {
            allow: {
                loginStatus: [exports.LOGIN_STATUS.LoggedIn],
            },
            deny: {
                role: [exports.ROLE.Default],
            },
        },
    },
    USER_SETTINGS: {
        VIEW_UM_SETUP_WARNING: {
            allow: {
                role: [exports.ROLE.Default],
            },
        },
    },
};
const isAuthorized = (permissions, { currentUser, isUMEnabled, isPublicApiEnabled, }) => {
    const loginStatus = currentUser ? exports.LOGIN_STATUS.LoggedIn : exports.LOGIN_STATUS.LoggedOut;
    if (permissions.deny) {
        if (permissions.deny.hasOwnProperty('um') && permissions.deny.um === isUMEnabled) {
            return false;
        }
        if (permissions.deny.hasOwnProperty('api') && permissions.deny.api === isPublicApiEnabled) {
            return false;
        }
        if (permissions.deny.loginStatus && permissions.deny.loginStatus.includes(loginStatus)) {
            return false;
        }
        if (currentUser && currentUser.globalRole) {
            const role = currentUser.isDefaultUser ? exports.ROLE.Default : currentUser.globalRole.name;
            if (permissions.deny.role && permissions.deny.role.includes(role)) {
                return false;
            }
        }
        else if (permissions.deny.role) {
            return false;
        }
    }
    if (permissions.allow) {
        if (permissions.allow.hasOwnProperty('um') && permissions.allow.um === isUMEnabled) {
            return true;
        }
        if (permissions.allow.hasOwnProperty('api') && permissions.allow.api === isPublicApiEnabled) {
            return true;
        }
        if (permissions.allow.loginStatus && permissions.allow.loginStatus.includes(loginStatus)) {
            return true;
        }
        if (currentUser && currentUser.globalRole) {
            const role = currentUser.isDefaultUser ? exports.ROLE.Default : currentUser.globalRole.name;
            if (permissions.allow.role && permissions.allow.role.includes(role)) {
                return true;
            }
        }
    }
    return false;
};
exports.isAuthorized = isAuthorized;
function getPersonalizedNodeTypes(answers) {
    if (!answers) {
        return [];
    }
    // @ts-ignore
    if (answers.version === 'v2') {
        return getPersonalizationV2(answers);
    }
    return getPersonalizationV1(answers);
}
exports.getPersonalizedNodeTypes = getPersonalizedNodeTypes;
function getPersonalizationV2(answers) {
    let nodeTypes = [];
    const { version } = answers, data = __rest(answers, ["version"]);
    if (Object.keys(data).length === 0) {
        return [];
    }
    const companySize = answers[constants_1.COMPANY_SIZE_KEY];
    const companyType = answers[constants_1.COMPANY_TYPE_KEY];
    const automationGoal = answers[constants_1.AUTOMATION_GOAL_KEY];
    let codingSkill = null;
    if (answers[constants_1.CODING_SKILL_KEY]) {
        codingSkill = parseInt(answers[constants_1.CODING_SKILL_KEY], 10);
        codingSkill = isNaN(codingSkill) ? 0 : codingSkill;
    }
    // slot 1 trigger
    if (companyType === constants_1.ECOMMERCE_COMPANY_TYPE) {
        nodeTypes = nodeTypes.concat(constants_1.WOOCOMMERCE_TRIGGER_NODE_TYPE);
    }
    else if (companyType === constants_1.MSP_COMPANY_TYPE) {
        nodeTypes = nodeTypes.concat(constants_1.JIRA_TRIGGER_NODE_TYPE);
    }
    else if ((companyType === constants_1.PERSONAL_COMPANY_TYPE || automationGoal === constants_1.OTHER_AUTOMATION_GOAL || automationGoal === constants_1.NOT_SURE_YET_GOAL) && codingSkill !== null && codingSkill >= 4) {
        nodeTypes = nodeTypes.concat(constants_1.WEBHOOK_NODE_TYPE);
    }
    else if ((companyType === constants_1.PERSONAL_COMPANY_TYPE || automationGoal === constants_1.OTHER_AUTOMATION_GOAL || automationGoal === constants_1.NOT_SURE_YET_GOAL) && codingSkill !== null && codingSkill < 3) {
        nodeTypes = nodeTypes.concat(constants_1.CRON_NODE_TYPE);
    }
    else if (automationGoal === constants_1.CUSTOMER_INTEGRATIONS_GOAL) {
        nodeTypes = nodeTypes.concat(constants_1.WEBHOOK_NODE_TYPE);
    }
    else if (automationGoal === constants_1.CUSTOMER_SUPPORT_GOAL || automationGoal === constants_1.FINANCE_ACCOUNTING_GOAL) {
        nodeTypes = nodeTypes.concat(constants_1.ZENDESK_TRIGGER_NODE_TYPE);
    }
    else if (automationGoal === constants_1.SALES_MARKETING_GOAL) {
        nodeTypes = nodeTypes.concat(constants_1.HUBSPOT_TRIGGER_NODE_TYPE);
    }
    else if (automationGoal === constants_1.HR_GOAL) {
        nodeTypes = nodeTypes.concat(constants_1.WORKABLE_TRIGGER_NODE_TYPE);
    }
    else if (automationGoal === constants_1.OPERATIONS_GOAL) {
        nodeTypes = nodeTypes.concat(constants_1.CRON_NODE_TYPE);
    }
    else if (automationGoal === constants_1.PRODUCT_GOAL) {
        nodeTypes = nodeTypes.concat(constants_1.NOTION_TRIGGER_NODE_TYPE);
    }
    else if (automationGoal === constants_1.SECURITY_GOAL) {
        nodeTypes = nodeTypes.concat(constants_1.THE_HIVE_TRIGGER_NODE_TYPE);
    }
    else {
        nodeTypes = nodeTypes.concat(constants_1.WEBHOOK_NODE_TYPE);
    }
    // slot 2 data transformation
    if (codingSkill !== null && codingSkill >= 4) {
        nodeTypes = nodeTypes.concat(constants_1.FUNCTION_NODE_TYPE);
    }
    else {
        nodeTypes = nodeTypes.concat(constants_1.ITEM_LISTS_NODE_TYPE);
    }
    // slot 3 logic node
    if (codingSkill !== null && codingSkill < 3) {
        nodeTypes = nodeTypes.concat(constants_1.IF_NODE_TYPE);
    }
    else {
        nodeTypes = nodeTypes.concat(constants_1.SWITCH_NODE_TYPE);
    }
    // slot 4 usecase #1
    if (companySize === constants_1.COMPANY_SIZE_500_999 || companySize === constants_1.COMPANY_SIZE_1000_OR_MORE) {
        switch (automationGoal) {
            case constants_1.CUSTOMER_INTEGRATIONS_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.HTTP_REQUEST_NODE_TYPE);
                break;
            case constants_1.CUSTOMER_SUPPORT_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.ZENDESK_NODE_TYPE);
                break;
            case constants_1.SALES_MARKETING_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.SALESFORCE_NODE_TYPE);
                break;
            case constants_1.HR_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.SERVICENOW_NODE_TYPE);
                break;
            case constants_1.PRODUCT_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.JIRA_NODE_TYPE);
                break;
            case constants_1.FINANCE_ACCOUNTING_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.SPREADSHEET_FILE_NODE_TYPE);
                break;
            case constants_1.SECURITY_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.ELASTIC_SECURITY_NODE_TYPE);
                break;
            default:
                nodeTypes = nodeTypes.concat(constants_1.SLACK_NODE_TYPE);
        }
    }
    else {
        switch (automationGoal) {
            case constants_1.CUSTOMER_INTEGRATIONS_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.HTTP_REQUEST_NODE_TYPE);
                break;
            case constants_1.CUSTOMER_SUPPORT_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.ZENDESK_NODE_TYPE);
                break;
            case constants_1.FINANCE_ACCOUNTING_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.QUICKBOOKS_NODE_TYPE);
                break;
            case constants_1.HR_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.BAMBOO_HR_NODE_TYPE);
                break;
            case constants_1.PRODUCT_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.JIRA_NODE_TYPE);
                break;
            case constants_1.SALES_MARKETING_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.GOOGLE_SHEETS_NODE_TYPE);
                break;
            case constants_1.SECURITY_GOAL:
                nodeTypes = nodeTypes.concat(constants_1.ELASTIC_SECURITY_NODE_TYPE);
                break;
            default:
                nodeTypes = nodeTypes.concat(constants_1.SLACK_NODE_TYPE);
        }
    }
    // slot 4
    nodeTypes = nodeTypes.concat(constants_1.SET_NODE_TYPE);
    return nodeTypes;
}
function getPersonalizationV1(answers) {
    const companySize = answers[constants_1.COMPANY_SIZE_KEY];
    const workArea = answers[constants_1.WORK_AREA_KEY];
    function isWorkAreaAnswer(name) {
        if (Array.isArray(workArea)) {
            return workArea.includes(name);
        }
        else {
            return workArea === name;
        }
    }
    const workAreaIsEmpty = !workArea || workArea.length === 0;
    if (companySize === null && workAreaIsEmpty && answers[constants_1.CODING_SKILL_KEY] === null) {
        return [];
    }
    let codingSkill = null;
    if (answers[constants_1.CODING_SKILL_KEY]) {
        codingSkill = parseInt(answers[constants_1.CODING_SKILL_KEY], 10);
        codingSkill = isNaN(codingSkill) ? 0 : codingSkill;
    }
    let nodeTypes = [];
    if (isWorkAreaAnswer(constants_1.IT_ENGINEERING_WORK_AREA)) {
        nodeTypes = nodeTypes.concat(constants_1.WEBHOOK_NODE_TYPE);
    }
    else {
        nodeTypes = nodeTypes.concat(constants_1.CRON_NODE_TYPE);
    }
    if (codingSkill !== null && codingSkill >= 4) {
        nodeTypes = nodeTypes.concat(constants_1.FUNCTION_NODE_TYPE);
    }
    else {
        nodeTypes = nodeTypes.concat(constants_1.ITEM_LISTS_NODE_TYPE);
    }
    if (codingSkill !== null && codingSkill < 3) {
        nodeTypes = nodeTypes.concat(constants_1.IF_NODE_TYPE);
    }
    else {
        nodeTypes = nodeTypes.concat(constants_1.SWITCH_NODE_TYPE);
    }
    if (companySize === constants_1.COMPANY_SIZE_500_999 || companySize === constants_1.COMPANY_SIZE_1000_OR_MORE) {
        if (isWorkAreaAnswer(constants_1.SALES_BUSINESSDEV_WORK_AREA)) {
            nodeTypes = nodeTypes.concat(constants_1.SALESFORCE_NODE_TYPE);
        }
        else if (isWorkAreaAnswer(constants_1.SECURITY_WORK_AREA)) {
            nodeTypes = nodeTypes.concat([constants_1.ELASTIC_SECURITY_NODE_TYPE, constants_1.HTTP_REQUEST_NODE_TYPE]);
        }
        else if (isWorkAreaAnswer(constants_1.PRODUCT_WORK_AREA)) {
            nodeTypes = nodeTypes.concat([constants_1.JIRA_TRIGGER_NODE_TYPE, constants_1.SEGMENT_NODE_TYPE]);
        }
        else if (isWorkAreaAnswer(constants_1.IT_ENGINEERING_WORK_AREA)) {
            nodeTypes = nodeTypes.concat([constants_1.GITHUB_TRIGGER_NODE_TYPE, constants_1.HTTP_REQUEST_NODE_TYPE]);
        }
        else {
            nodeTypes = nodeTypes.concat([constants_1.MICROSOFT_EXCEL_NODE_TYPE, constants_1.MICROSOFT_TEAMS_NODE_TYPE]);
        }
    }
    else {
        if (isWorkAreaAnswer(constants_1.SALES_BUSINESSDEV_WORK_AREA)) {
            nodeTypes = nodeTypes.concat(constants_1.CLEARBIT_NODE_TYPE);
        }
        else if (isWorkAreaAnswer(constants_1.SECURITY_WORK_AREA)) {
            nodeTypes = nodeTypes.concat([constants_1.PAGERDUTY_NODE_TYPE, constants_1.HTTP_REQUEST_NODE_TYPE]);
        }
        else if (isWorkAreaAnswer(constants_1.PRODUCT_WORK_AREA)) {
            nodeTypes = nodeTypes.concat([constants_1.JIRA_TRIGGER_NODE_TYPE, constants_1.CALENDLY_TRIGGER_NODE_TYPE]);
        }
        else if (isWorkAreaAnswer(constants_1.IT_ENGINEERING_WORK_AREA)) {
            nodeTypes = nodeTypes.concat([constants_1.EXECUTE_COMMAND_NODE_TYPE, constants_1.HTTP_REQUEST_NODE_TYPE]);
        }
        else if (isWorkAreaAnswer(constants_1.FINANCE_WORK_AREA)) {
            nodeTypes = nodeTypes.concat([constants_1.XERO_NODE_TYPE, constants_1.QUICKBOOKS_NODE_TYPE, constants_1.SPREADSHEET_FILE_NODE_TYPE]);
        }
        else {
            nodeTypes = nodeTypes.concat([constants_1.EMAIL_SEND_NODE_TYPE, constants_1.SLACK_NODE_TYPE]);
        }
    }
    nodeTypes = nodeTypes.concat(constants_1.SET_NODE_TYPE);
    return nodeTypes;
}
