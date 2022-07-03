"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IF_NODE_TYPE = exports.HUBSPOT_TRIGGER_NODE_TYPE = exports.HTTP_REQUEST_NODE_TYPE = exports.EXECUTE_COMMAND_NODE_TYPE = exports.EMAIL_SEND_NODE_TYPE = exports.ELASTIC_SECURITY_NODE_TYPE = exports.ERROR_TRIGGER_NODE_TYPE = exports.GOOGLE_SHEETS_NODE_TYPE = exports.GITHUB_TRIGGER_NODE_TYPE = exports.FUNCTION_NODE_TYPE = exports.CLEARBIT_NODE_TYPE = exports.CRON_NODE_TYPE = exports.CALENDLY_TRIGGER_NODE_TYPE = exports.BAMBOO_HR_NODE_TYPE = exports.N8N_IO_BASE_URL = exports.BREAKPOINT_XL = exports.BREAKPOINT_LG = exports.BREAKPOINT_MD = exports.BREAKPOINT_SM = exports.WORKFLOW_ACTIVE_MODAL_KEY = exports.EXECUTIONS_MODAL_KEY = exports.VALUE_SURVEY_MODAL_KEY = exports.CONTACT_PROMPT_MODAL_KEY = exports.PERSONALIZATION_MODAL_KEY = exports.CREDENTIAL_LIST_MODAL_KEY = exports.WORKFLOW_SETTINGS_MODAL_KEY = exports.VERSIONS_MODAL_KEY = exports.WORKFLOW_OPEN_MODAL_KEY = exports.TAGS_MANAGER_MODAL_KEY = exports.DUPLICATE_MODAL_KEY = exports.INVITE_USER_MODAL_KEY = exports.DELETE_USER_MODAL_KEY = exports.CREDENTIAL_SELECT_MODAL_KEY = exports.CREDENTIAL_EDIT_MODAL_KEY = exports.CHANGE_PASSWORD_MODAL_KEY = exports.ABOUT_MODAL_KEY = exports.MAX_TAG_NAME_LENGTH = exports.QUICKSTART_NOTE_NAME = exports.NODE_OUTPUT_DEFAULT_KEY = exports.DUPLICATE_POSTFFIX = exports.MAX_WORKFLOW_NAME_LENGTH = exports.MIN_WORKFLOW_NAME_LENGTH = exports.DEFAULT_NEW_WORKFLOW_NAME = exports.DEFAULT_NODETYPE_VERSION = exports.PLACEHOLDER_EMPTY_WORKFLOW_ID = exports.CUSTOM_API_CALL_KEY = exports.PLACEHOLDER_FILLED_AT_EXECUTION_TIME = exports.NODE_NAME_PREFIX = exports.MAX_DISPLAY_ITEMS_AUTO_ALL = exports.MAX_DISPLAY_DATA_SIZE = void 0;
exports.AUTOMATION_AGENCY_COMPANY_TYPE = exports.DIGITAL_AGENCY_COMPANY_TYPE = exports.MSP_COMPANY_TYPE = exports.ECOMMERCE_COMPANY_TYPE = exports.SAAS_COMPANY_TYPE = exports.COMPANY_TYPE_KEY = exports.SECURITY_WORK_AREA = exports.SALES_BUSINESSDEV_WORK_AREA = exports.PRODUCT_WORK_AREA = exports.IT_ENGINEERING_WORK_AREA = exports.FINANCE_WORK_AREA = exports.WORK_AREA_KEY = exports.WAIT_TIME_UNLIMITED = exports.INSTANCE_ID_HEADER = exports.REQUEST_NODE_FORM_URL = exports.HIDDEN_NODES = exports.PERSONALIZED_CATEGORY = exports.UNCATEGORIZED_SUBCATEGORY = exports.UNCATEGORIZED_CATEGORY = exports.ALL_NODE_FILTER = exports.TRIGGER_NODE_FILTER = exports.REGULAR_NODE_FILTER = exports.SUBCATEGORY_DESCRIPTIONS = exports.CUSTOM_NODES_CATEGORY = exports.CORE_NODES_CATEGORY = exports.ZENDESK_TRIGGER_NODE_TYPE = exports.ZENDESK_NODE_TYPE = exports.XERO_NODE_TYPE = exports.WOOCOMMERCE_TRIGGER_NODE_TYPE = exports.WORKABLE_TRIGGER_NODE_TYPE = exports.WEBHOOK_NODE_TYPE = exports.QUICKBOOKS_NODE_TYPE = exports.THE_HIVE_TRIGGER_NODE_TYPE = exports.SWITCH_NODE_TYPE = exports.START_NODE_TYPE = exports.SPREADSHEET_FILE_NODE_TYPE = exports.SLACK_NODE_TYPE = exports.SERVICENOW_NODE_TYPE = exports.SET_NODE_TYPE = exports.SEGMENT_NODE_TYPE = exports.SALESFORCE_NODE_TYPE = exports.PAGERDUTY_NODE_TYPE = exports.NOTION_TRIGGER_NODE_TYPE = exports.STICKY_NODE_TYPE = exports.NO_OP_NODE_TYPE = exports.MICROSOFT_TEAMS_NODE_TYPE = exports.MICROSOFT_EXCEL_NODE_TYPE = exports.JIRA_TRIGGER_NODE_TYPE = exports.JIRA_NODE_TYPE = exports.ITEM_LISTS_NODE_TYPE = void 0;
exports.OTHER_AUTOMATION_GOAL = exports.SECURITY_GOAL = exports.SALES_MARKETING_GOAL = exports.PRODUCT_GOAL = exports.OPERATIONS_GOAL = exports.HR_GOAL = exports.FINANCE_ACCOUNTING_GOAL = exports.CUSTOMER_SUPPORT_GOAL = exports.CUSTOMER_INTEGRATIONS_GOAL = exports.AUTOMATION_GOAL_OTHER_KEY = exports.AUTOMATION_GOAL_KEY = exports.CODING_SKILL_KEY = exports.COMPANY_SIZE_PERSONAL_USE = exports.COMPANY_SIZE_1000_OR_MORE = exports.COMPANY_SIZE_500_999 = exports.COMPANY_SIZE_100_499 = exports.COMPANY_SIZE_20_99 = exports.COMPANY_SIZE_20_OR_LESS = exports.COMPANY_SIZE_KEY = exports.OTHER_INDUSTRY_OPTION = exports.TELECOMS_INDUSTRY = exports.SECURITY_INDUSTRY = exports.IT_INDUSTRY = exports.FINANCE_INSURANCE_INDUSTRY = exports.HEALTHCARE_INDUSTRY = exports.MANUFACTURING_INDUSTRY = exports.MEDIA_INDUSTRY = exports.MARKETING_INDUSTRY = exports.LEGAL_INDUSTRY = exports.GOVERNMENT_INDUSTRY = exports.REAL_ESTATE_OR_CONSTRUCTION = exports.PHYSICAL_RETAIL_OR_SERVICES = exports.EDUCATION_INDUSTRY = exports.OTHER_COMPANY_INDUSTRY_EXTENDED_KEY = exports.COMPANY_INDUSTRY_EXTENDED_KEY = exports.OTHER_FOCUS = exports.SECURITY_FOCUS = exports.NETWORKING_COMMUNICATION_FOCUS = exports.IT_SUPPORT_FOCUS = exports.CLOUD_INFRA_FOCUS = exports.MSP_FOCUS_OTHER_KEY = exports.MSP_FOCUS_KEY = exports.LARGE_CUSTOMER_TYPE = exports.MEDIUM_CUSTOMER_TYPE = exports.SMALL_CUSTOMER_TYPE = exports.INDIVIDUAL_CUSTOMER_TYPE = exports.CUSTOMER_TYPE_KEY = exports.PERSONAL_COMPANY_TYPE = exports.OTHER_COMPANY_TYPE = exports.SYSTEMS_INTEGRATOR_COMPANY_TYPE = void 0;
exports.VIEWS = exports.TEMPLATES_NODES_FILTER = exports.HIRING_BANNER = exports.BASE_NODE_SURVEY_URL = exports.LOCAL_STORAGE_ACTIVATION_FLAG = exports.VALID_EMAIL_REGEX = exports.MODAL_CONFIRMED = exports.MODAL_CLOSE = exports.MODAL_CANCEL = exports.NOT_SURE_YET_GOAL = void 0;
exports.MAX_DISPLAY_DATA_SIZE = 204800;
exports.MAX_DISPLAY_ITEMS_AUTO_ALL = 250;
exports.NODE_NAME_PREFIX = 'node-';
exports.PLACEHOLDER_FILLED_AT_EXECUTION_TIME = '[filled at execution time]';
// parameter input
exports.CUSTOM_API_CALL_KEY = '__CUSTOM_API_CALL__';
// workflows
exports.PLACEHOLDER_EMPTY_WORKFLOW_ID = '__EMPTY__';
exports.DEFAULT_NODETYPE_VERSION = 1;
exports.DEFAULT_NEW_WORKFLOW_NAME = 'My workflow';
exports.MIN_WORKFLOW_NAME_LENGTH = 1;
exports.MAX_WORKFLOW_NAME_LENGTH = 128;
exports.DUPLICATE_POSTFFIX = ' copy';
exports.NODE_OUTPUT_DEFAULT_KEY = '_NODE_OUTPUT_DEFAULT_KEY_';
exports.QUICKSTART_NOTE_NAME = '_QUICKSTART_NOTE_';
// tags
exports.MAX_TAG_NAME_LENGTH = 24;
// modals
exports.ABOUT_MODAL_KEY = 'about';
exports.CHANGE_PASSWORD_MODAL_KEY = 'changePassword';
exports.CREDENTIAL_EDIT_MODAL_KEY = 'editCredential';
exports.CREDENTIAL_SELECT_MODAL_KEY = 'selectCredential';
exports.DELETE_USER_MODAL_KEY = 'deleteUser';
exports.INVITE_USER_MODAL_KEY = 'inviteUser';
exports.DUPLICATE_MODAL_KEY = 'duplicate';
exports.TAGS_MANAGER_MODAL_KEY = 'tagsManager';
exports.WORKFLOW_OPEN_MODAL_KEY = 'workflowOpen';
exports.VERSIONS_MODAL_KEY = 'versions';
exports.WORKFLOW_SETTINGS_MODAL_KEY = 'settings';
exports.CREDENTIAL_LIST_MODAL_KEY = 'credentialsList';
exports.PERSONALIZATION_MODAL_KEY = 'personalization';
exports.CONTACT_PROMPT_MODAL_KEY = 'contactPrompt';
exports.VALUE_SURVEY_MODAL_KEY = 'valueSurvey';
exports.EXECUTIONS_MODAL_KEY = 'executions';
exports.WORKFLOW_ACTIVE_MODAL_KEY = 'activation';
// breakpoints
exports.BREAKPOINT_SM = 768;
exports.BREAKPOINT_MD = 992;
exports.BREAKPOINT_LG = 1200;
exports.BREAKPOINT_XL = 1920;
exports.N8N_IO_BASE_URL = `https://api.n8n.io/api/`;
// node types
exports.BAMBOO_HR_NODE_TYPE = 'n8n-nodes-base.bambooHr';
exports.CALENDLY_TRIGGER_NODE_TYPE = 'n8n-nodes-base.calendlyTrigger';
exports.CRON_NODE_TYPE = 'n8n-nodes-base.cron';
exports.CLEARBIT_NODE_TYPE = 'n8n-nodes-base.clearbit';
exports.FUNCTION_NODE_TYPE = 'n8n-nodes-base.function';
exports.GITHUB_TRIGGER_NODE_TYPE = 'n8n-nodes-base.githubTrigger';
exports.GOOGLE_SHEETS_NODE_TYPE = 'n8n-nodes-base.googleSheets';
exports.ERROR_TRIGGER_NODE_TYPE = 'n8n-nodes-base.errorTrigger';
exports.ELASTIC_SECURITY_NODE_TYPE = 'n8n-nodes-base.elasticSecurity';
exports.EMAIL_SEND_NODE_TYPE = 'n8n-nodes-base.emailSend';
exports.EXECUTE_COMMAND_NODE_TYPE = 'n8n-nodes-base.executeCommand';
exports.HTTP_REQUEST_NODE_TYPE = 'n8n-nodes-base.httpRequest';
exports.HUBSPOT_TRIGGER_NODE_TYPE = 'n8n-nodes-base.hubspotTrigger';
exports.IF_NODE_TYPE = 'n8n-nodes-base.if';
exports.ITEM_LISTS_NODE_TYPE = 'n8n-nodes-base.itemLists';
exports.JIRA_NODE_TYPE = 'n8n-nodes-base.jira';
exports.JIRA_TRIGGER_NODE_TYPE = 'n8n-nodes-base.jiraTrigger';
exports.MICROSOFT_EXCEL_NODE_TYPE = 'n8n-nodes-base.microsoftExcel';
exports.MICROSOFT_TEAMS_NODE_TYPE = 'n8n-nodes-base.microsoftTeams';
exports.NO_OP_NODE_TYPE = 'n8n-nodes-base.noOp';
exports.STICKY_NODE_TYPE = 'n8n-nodes-base.stickyNote';
exports.NOTION_TRIGGER_NODE_TYPE = 'n8n-nodes-base.notionTrigger';
exports.PAGERDUTY_NODE_TYPE = 'n8n-nodes-base.pagerDuty';
exports.SALESFORCE_NODE_TYPE = 'n8n-nodes-base.salesforce';
exports.SEGMENT_NODE_TYPE = 'n8n-nodes-base.segment';
exports.SET_NODE_TYPE = 'n8n-nodes-base.set';
exports.SERVICENOW_NODE_TYPE = 'n8n-nodes-base.serviceNow';
exports.SLACK_NODE_TYPE = 'n8n-nodes-base.slack';
exports.SPREADSHEET_FILE_NODE_TYPE = 'n8n-nodes-base.spreadsheetFile';
exports.START_NODE_TYPE = 'n8n-nodes-base.start';
exports.SWITCH_NODE_TYPE = 'n8n-nodes-base.switch';
exports.THE_HIVE_TRIGGER_NODE_TYPE = 'n8n-nodes-base.theHiveTrigger';
exports.QUICKBOOKS_NODE_TYPE = 'n8n-nodes-base.quickbooks';
exports.WEBHOOK_NODE_TYPE = 'n8n-nodes-base.webhook';
exports.WORKABLE_TRIGGER_NODE_TYPE = 'n8n-nodes-base.workableTrigger';
exports.WOOCOMMERCE_TRIGGER_NODE_TYPE = 'n8n-nodes-base.wooCommerceTrigger';
exports.XERO_NODE_TYPE = 'n8n-nodes-base.xero';
exports.ZENDESK_NODE_TYPE = 'n8n-nodes-base.zendesk';
exports.ZENDESK_TRIGGER_NODE_TYPE = 'n8n-nodes-base.zendeskTrigger';
// Node creator
exports.CORE_NODES_CATEGORY = 'Core Nodes';
exports.CUSTOM_NODES_CATEGORY = 'Custom Nodes';
exports.SUBCATEGORY_DESCRIPTIONS = {
    'Core Nodes': {
        Flow: 'Branches, core triggers, merge data',
        Files: 'Work with CSV, XML, text, images etc.',
        'Data Transformation': 'Manipulate data fields, run code',
        Helpers: 'HTTP Requests (API calls), date and time, scrape HTML',
    },
};
exports.REGULAR_NODE_FILTER = 'Regular';
exports.TRIGGER_NODE_FILTER = 'Trigger';
exports.ALL_NODE_FILTER = 'All';
exports.UNCATEGORIZED_CATEGORY = 'Miscellaneous';
exports.UNCATEGORIZED_SUBCATEGORY = 'Helpers';
exports.PERSONALIZED_CATEGORY = 'Suggested Nodes';
exports.HIDDEN_NODES = [exports.START_NODE_TYPE];
exports.REQUEST_NODE_FORM_URL = 'https://n8n-community.typeform.com/to/K1fBVTZ3';
// General
exports.INSTANCE_ID_HEADER = 'n8n-instance-id';
exports.WAIT_TIME_UNLIMITED = '3000-01-01T00:00:00.000Z';
exports.WORK_AREA_KEY = 'workArea';
exports.FINANCE_WORK_AREA = 'finance';
exports.IT_ENGINEERING_WORK_AREA = 'IT-Engineering';
exports.PRODUCT_WORK_AREA = 'product';
exports.SALES_BUSINESSDEV_WORK_AREA = 'sales-businessDevelopment';
exports.SECURITY_WORK_AREA = 'security';
exports.COMPANY_TYPE_KEY = 'companyType';
exports.SAAS_COMPANY_TYPE = 'saas';
exports.ECOMMERCE_COMPANY_TYPE = 'ecommerce';
exports.MSP_COMPANY_TYPE = 'msp';
exports.DIGITAL_AGENCY_COMPANY_TYPE = 'digital-agency';
exports.AUTOMATION_AGENCY_COMPANY_TYPE = 'automation-agency';
exports.SYSTEMS_INTEGRATOR_COMPANY_TYPE = 'systems-integrator';
exports.OTHER_COMPANY_TYPE = 'other';
exports.PERSONAL_COMPANY_TYPE = 'personal';
exports.CUSTOMER_TYPE_KEY = 'customerType';
exports.INDIVIDUAL_CUSTOMER_TYPE = 'individual';
exports.SMALL_CUSTOMER_TYPE = 'small';
exports.MEDIUM_CUSTOMER_TYPE = 'medium';
exports.LARGE_CUSTOMER_TYPE = 'large';
exports.MSP_FOCUS_KEY = 'mspFocus';
exports.MSP_FOCUS_OTHER_KEY = 'mspFocusOther';
exports.CLOUD_INFRA_FOCUS = 'cloud-infra';
exports.IT_SUPPORT_FOCUS = 'it-support';
exports.NETWORKING_COMMUNICATION_FOCUS = 'networking-communication';
exports.SECURITY_FOCUS = 'security';
exports.OTHER_FOCUS = 'other';
exports.COMPANY_INDUSTRY_EXTENDED_KEY = 'companyIndustryExtended';
exports.OTHER_COMPANY_INDUSTRY_EXTENDED_KEY = 'otherCompanyIndustryExtended';
exports.EDUCATION_INDUSTRY = 'education';
exports.PHYSICAL_RETAIL_OR_SERVICES = 'physical-retail-or-services';
exports.REAL_ESTATE_OR_CONSTRUCTION = 'real-estate-or-construction';
exports.GOVERNMENT_INDUSTRY = 'government';
exports.LEGAL_INDUSTRY = 'legal-industry';
exports.MARKETING_INDUSTRY = 'marketing-industry';
exports.MEDIA_INDUSTRY = 'media-industry';
exports.MANUFACTURING_INDUSTRY = 'manufacturing-industry';
exports.HEALTHCARE_INDUSTRY = 'healthcare';
exports.FINANCE_INSURANCE_INDUSTRY = 'finance-insurance-industry';
exports.IT_INDUSTRY = 'it-industry';
exports.SECURITY_INDUSTRY = 'security-industry';
exports.TELECOMS_INDUSTRY = 'telecoms';
exports.OTHER_INDUSTRY_OPTION = 'other';
exports.COMPANY_SIZE_KEY = 'companySize';
exports.COMPANY_SIZE_20_OR_LESS = '<20';
exports.COMPANY_SIZE_20_99 = '20-99';
exports.COMPANY_SIZE_100_499 = '100-499';
exports.COMPANY_SIZE_500_999 = '500-999';
exports.COMPANY_SIZE_1000_OR_MORE = '1000+';
exports.COMPANY_SIZE_PERSONAL_USE = 'personalUser';
exports.CODING_SKILL_KEY = 'codingSkill';
exports.AUTOMATION_GOAL_KEY = 'automationGoal';
exports.AUTOMATION_GOAL_OTHER_KEY = 'otherAutomationGoal';
exports.CUSTOMER_INTEGRATIONS_GOAL = 'customer-integrations';
exports.CUSTOMER_SUPPORT_GOAL = 'customer-support';
exports.FINANCE_ACCOUNTING_GOAL = 'finance-accounting';
exports.HR_GOAL = 'hr';
exports.OPERATIONS_GOAL = 'operations';
exports.PRODUCT_GOAL = 'product';
exports.SALES_MARKETING_GOAL = 'sales-marketing';
exports.SECURITY_GOAL = 'security';
exports.OTHER_AUTOMATION_GOAL = 'other';
exports.NOT_SURE_YET_GOAL = 'not-sure-yet';
exports.MODAL_CANCEL = 'cancel';
exports.MODAL_CLOSE = 'close';
exports.MODAL_CONFIRMED = 'confirmed';
exports.VALID_EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
exports.LOCAL_STORAGE_ACTIVATION_FLAG = 'N8N_HIDE_ACTIVATION_ALERT';
exports.BASE_NODE_SURVEY_URL = 'https://n8n-community.typeform.com/to/BvmzxqYv#nodename=';
exports.HIRING_BANNER = `
                                                                    //////
                                                                 ///////////
                                                               /////      ////
                                               ///////////////////         ////
                                             //////////////////////       ////
     ///////               ///////          ////                /////////////
  ////////////          ////////////       ////                    ///////
 ////       ////       ////       ////    ////
/////        /////////////         //////////
 /////     ////       ////       ////     ////
  ////////////          ////////////       ////           ////////
    ///////                //////           ////        /////////////
                                             /////////////        ////
                                                //////////        ////
                                                       ////      ////
                                                        ///////////
                                                          //////

Love n8n? Help us build the future of automation! https://n8n.io/careers
`;
exports.TEMPLATES_NODES_FILTER = [
    'n8n-nodes-base.start',
    'n8n-nodes-base.respondToWebhook',
];
var VIEWS;
(function (VIEWS) {
    VIEWS["HOMEPAGE"] = "Homepage";
    VIEWS["COLLECTION"] = "TemplatesCollectionView";
    VIEWS["EXECUTION"] = "ExecutionById";
    VIEWS["TEMPLATE"] = "TemplatesWorkflowView";
    VIEWS["TEMPLATES"] = "TemplatesSearchView";
    VIEWS["NEW_WORKFLOW"] = "NodeViewNew";
    VIEWS["WORKFLOW"] = "NodeViewExisting";
    VIEWS["DEMO"] = "WorkflowDemo";
    VIEWS["TEMPLATE_IMPORT"] = "WorkflowTemplate";
    VIEWS["SIGNIN"] = "SigninView";
    VIEWS["SIGNUP"] = "SignupView";
    VIEWS["SETUP"] = "SetupView";
    VIEWS["FORGOT_PASSWORD"] = "ForgotMyPasswordView";
    VIEWS["CHANGE_PASSWORD"] = "ChangePasswordView";
    VIEWS["USERS_SETTINGS"] = "UsersSettings";
    VIEWS["PERSONAL_SETTINGS"] = "PersonalSettings";
    VIEWS["API_SETTINGS"] = "APISettings";
    VIEWS["NOT_FOUND"] = "NotFoundView";
})(VIEWS = exports.VIEWS || (exports.VIEWS = {}));
