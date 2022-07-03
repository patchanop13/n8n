"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
exports.FreshworksCrm = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
const descriptions_1 = require("./descriptions");
const moment_timezone_1 = require("moment-timezone");
class FreshworksCrm {
    constructor() {
        this.description = {
            displayName: 'Freshworks CRM',
            name: 'freshworksCrm',
            icon: 'file:freshworksCrm.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Consume the Freshworks CRM API',
            defaults: {
                name: 'Freshworks CRM',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'freshworksCrmApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Account',
                            value: 'account',
                        },
                        {
                            name: 'Appointment',
                            value: 'appointment',
                        },
                        {
                            name: 'Contact',
                            value: 'contact',
                        },
                        {
                            name: 'Deal',
                            value: 'deal',
                        },
                        {
                            name: 'Note',
                            value: 'note',
                        },
                        {
                            name: 'Sales Activity',
                            value: 'salesActivity',
                        },
                        {
                            name: 'Task',
                            value: 'task',
                        },
                    ],
                    default: 'account',
                },
                ...descriptions_1.accountOperations,
                ...descriptions_1.accountFields,
                ...descriptions_1.appointmentOperations,
                ...descriptions_1.appointmentFields,
                ...descriptions_1.contactOperations,
                ...descriptions_1.contactFields,
                ...descriptions_1.dealOperations,
                ...descriptions_1.dealFields,
                ...descriptions_1.noteOperations,
                ...descriptions_1.noteFields,
                ...descriptions_1.salesActivityOperations,
                ...descriptions_1.salesActivityFields,
                ...descriptions_1.taskOperations,
                ...descriptions_1.taskFields,
            ],
        };
        this.methods = {
            loadOptions: {
                getAccounts() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const viewId = yield GenericFunctions_1.getAllItemsViewId.call(this, { fromLoadOptions: true });
                        const responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', `/sales_accounts/view/${viewId}`);
                        return responseData.map(({ name, id }) => ({ name, value: id }));
                    });
                },
                getAccountViews() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/sales_accounts/filters');
                        return responseData.map(({ name, id }) => ({ name, value: id }));
                    });
                },
                getBusinessTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'business_types');
                    });
                },
                getCampaigns() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'campaigns');
                    });
                },
                getContactStatuses() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'contact_statuses');
                    });
                },
                getContactViews() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/contacts/filters');
                        return responseData.map(({ name, id }) => ({ name, value: id }));
                    });
                },
                getCurrencies() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const response = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'GET', '/selector/currencies');
                        const key = Object.keys(response)[0];
                        return response[key].map(({ currency_code, id }) => ({ name: currency_code, value: id }));
                    });
                },
                getDealPaymentStatuses() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'deal_payment_statuses');
                    });
                },
                getDealPipelines() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'deal_pipelines');
                    });
                },
                getDealProducts() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'deal_products');
                    });
                },
                getDealReasons() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'deal_reasons');
                    });
                },
                getDealStages() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'deal_stages');
                    });
                },
                getDealTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'deal_types');
                    });
                },
                getDealViews() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/deals/filters');
                        return responseData.map(({ name, id }) => ({ name, value: id }));
                    });
                },
                getIndustryTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'industry_types');
                    });
                },
                getLifecycleStages() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'lifecycle_stages');
                    });
                },
                getOutcomes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'sales_activity_outcomes');
                    });
                },
                getSalesActivityTypes() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'sales_activity_types');
                    });
                },
                getTerritories() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return yield GenericFunctions_1.loadResource.call(this, 'territories');
                    });
                },
                getUsers() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const response = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'GET', `/selector/owners`);
                        const key = Object.keys(response)[0];
                        return response[key].map(({ display_name, id }) => ({ name: display_name, value: id }));
                    });
                },
            },
        };
    }
    execute() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            const defaultTimezone = this.getTimezone();
            let responseData;
            for (let i = 0; i < items.length; i++) {
                try {
                    if (resource === 'account') {
                        // **********************************************************************
                        //                                account
                        // **********************************************************************
                        // https://developers.freshworks.com/crm/api/#accounts
                        if (operation === 'create') {
                            // ----------------------------------------
                            //             account: create
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#create_account
                            const body = {
                                name: this.getNodeParameter('name', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'POST', '/sales_accounts', body);
                            responseData = responseData.sales_account;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //             account: delete
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#delete_account
                            const accountId = this.getNodeParameter('accountId', i);
                            const endpoint = `/sales_accounts/${accountId}`;
                            yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'DELETE', endpoint);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //               account: get
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#view_account
                            const accountId = this.getNodeParameter('accountId', i);
                            const endpoint = `/sales_accounts/${accountId}`;
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.sales_account;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             account: getAll
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#list_all_accounts
                            const view = this.getNodeParameter('view', i);
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', `/sales_accounts/view/${view}`);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //             account: update
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#update_a_account
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, updateFields);
                            }
                            else {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const accountId = this.getNodeParameter('accountId', i);
                            const endpoint = `/sales_accounts/${accountId}`;
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'PUT', endpoint, body);
                            responseData = responseData.sales_account;
                        }
                    }
                    else if (resource === 'appointment') {
                        // **********************************************************************
                        //                              appointment
                        // **********************************************************************
                        // https://developers.freshworks.com/crm/api/#appointments
                        if (operation === 'create') {
                            // ----------------------------------------
                            //           appointment: create
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#create_appointment
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const startDate = this.getNodeParameter('fromDate', i);
                            const endDate = this.getNodeParameter('endDate', i);
                            const attendees = this.getNodeParameter('attendees.attendee', i, []);
                            const timezone = (_a = additionalFields.time_zone) !== null && _a !== void 0 ? _a : defaultTimezone;
                            let allDay = false;
                            if (additionalFields.is_allday) {
                                allDay = additionalFields.is_allday;
                            }
                            const start = (0, moment_timezone_1.tz)(startDate, timezone);
                            const end = (0, moment_timezone_1.tz)(endDate, timezone);
                            const body = {
                                title: this.getNodeParameter('title', i),
                                from_date: start.format(),
                                end_date: (allDay) ? start.format() : end.format(),
                            };
                            Object.assign(body, additionalFields);
                            if (attendees.length) {
                                body['appointment_attendees_attributes'] = (0, GenericFunctions_1.adjustAttendees)(attendees);
                            }
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'POST', '/appointments', body);
                            responseData = responseData.appointment;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //           appointment: delete
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#delete_a_appointment
                            const appointmentId = this.getNodeParameter('appointmentId', i);
                            const endpoint = `/appointments/${appointmentId}`;
                            yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'DELETE', endpoint);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //             appointment: get
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#view_a_appointment
                            const appointmentId = this.getNodeParameter('appointmentId', i);
                            const endpoint = `/appointments/${appointmentId}`;
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.appointment;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //           appointment: getAll
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#list_all_appointments
                            const { filter, include } = this.getNodeParameter('filters', i);
                            const qs = {};
                            if (filter) {
                                qs.filter = filter;
                            }
                            if (include) {
                                qs.include = include;
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/appointments', {}, qs);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //           appointment: update
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#update_a_appointment
                            const updateFields = this.getNodeParameter('updateFields', i);
                            const attendees = this.getNodeParameter('updateFields.attendees.attendee', i, []);
                            if (!Object.keys(updateFields).length) {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const body = {};
                            const { from_date, end_date } = updateFields, rest = __rest(updateFields, ["from_date", "end_date"]);
                            const timezone = (_b = rest.time_zone) !== null && _b !== void 0 ? _b : defaultTimezone;
                            if (from_date) {
                                body.from_date = (0, moment_timezone_1.tz)(from_date, timezone).format();
                            }
                            if (end_date) {
                                body.end_date = (0, moment_timezone_1.tz)(end_date, timezone).format();
                            }
                            Object.assign(body, rest);
                            if (attendees.length) {
                                body['appointment_attendees_attributes'] = (0, GenericFunctions_1.adjustAttendees)(attendees);
                                delete body.attendees;
                            }
                            const appointmentId = this.getNodeParameter('appointmentId', i);
                            const endpoint = `/appointments/${appointmentId}`;
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'PUT', endpoint, body);
                            responseData = responseData.appointment;
                        }
                    }
                    else if (resource === 'contact') {
                        // **********************************************************************
                        //                                contact
                        // **********************************************************************
                        // https://developers.freshworks.com/crm/api/#contacts
                        if (operation === 'create') {
                            // ----------------------------------------
                            //             contact: create
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#create_contact
                            const body = {
                                first_name: this.getNodeParameter('firstName', i),
                                last_name: this.getNodeParameter('lastName', i),
                                emails: this.getNodeParameter('emails', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, (0, GenericFunctions_1.adjustAccounts)(additionalFields));
                            }
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'POST', '/contacts', body);
                            responseData = responseData.contact;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //             contact: delete
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#delete_a_contact
                            const contactId = this.getNodeParameter('contactId', i);
                            const endpoint = `/contacts/${contactId}`;
                            yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'DELETE', endpoint);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //               contact: get
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#view_a_contact
                            const contactId = this.getNodeParameter('contactId', i);
                            const endpoint = `/contacts/${contactId}`;
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.contact;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //             contact: getAll
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#list_all_contacts
                            const view = this.getNodeParameter('view', i);
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', `/contacts/view/${view}`);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //             contact: update
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#update_a_contact
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, (0, GenericFunctions_1.adjustAccounts)(updateFields));
                            }
                            else {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const contactId = this.getNodeParameter('contactId', i);
                            const endpoint = `/contacts/${contactId}`;
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'PUT', endpoint, body);
                            responseData = responseData.contact;
                        }
                    }
                    else if (resource === 'deal') {
                        // **********************************************************************
                        //                                  deal
                        // **********************************************************************
                        // https://developers.freshworks.com/crm/api/#deals
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               deal: create
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#create_deal
                            const body = {
                                name: this.getNodeParameter('name', i),
                                amount: this.getNodeParameter('amount', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, (0, GenericFunctions_1.adjustAccounts)(additionalFields));
                            }
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'POST', '/deals', body);
                            responseData = responseData.deal;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //               deal: delete
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#delete_a_deal
                            const dealId = this.getNodeParameter('dealId', i);
                            yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'DELETE', `/deals/${dealId}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                deal: get
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#view_a_deal
                            const dealId = this.getNodeParameter('dealId', i);
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'GET', `/deals/${dealId}`);
                            responseData = responseData.deal;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               deal: getAll
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#list_all_deals
                            const view = this.getNodeParameter('view', i);
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', `/deals/view/${view}`);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               deal: update
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#update_a_deal
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, (0, GenericFunctions_1.adjustAccounts)(updateFields));
                            }
                            else {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const dealId = this.getNodeParameter('dealId', i);
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'PUT', `/deals/${dealId}`, body);
                            responseData = responseData.deal;
                        }
                    }
                    else if (resource === 'note') {
                        // **********************************************************************
                        //                                  note
                        // **********************************************************************
                        // https://developers.freshworks.com/crm/api/#notes
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               note: create
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#create_note
                            const body = {
                                description: this.getNodeParameter('description', i),
                                targetable_id: this.getNodeParameter('targetable_id', i),
                                targetable_type: this.getNodeParameter('targetableType', i),
                            };
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'POST', '/notes', body);
                            responseData = responseData.note;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //               note: delete
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#delete_a_note
                            const noteId = this.getNodeParameter('noteId', i);
                            yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'DELETE', `/notes/${noteId}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               note: update
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#update_a_note
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (Object.keys(updateFields).length) {
                                Object.assign(body, updateFields);
                            }
                            else {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const noteId = this.getNodeParameter('noteId', i);
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'PUT', `/notes/${noteId}`, body);
                            responseData = responseData.note;
                        }
                    }
                    else if (resource === 'salesActivity') {
                        // **********************************************************************
                        //                             salesActivity
                        // **********************************************************************
                        // https://developers.freshworks.com/crm/api/#sales-activities
                        if (operation === 'create') {
                            // ----------------------------------------
                            //          salesActivity: create
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#create_sales_activity
                            const startDate = this.getNodeParameter('from_date', i);
                            const endDate = this.getNodeParameter('end_date', i);
                            const body = {
                                sales_activity_type_id: this.getNodeParameter('sales_activity_type_id', i),
                                title: this.getNodeParameter('title', i),
                                owner_id: this.getNodeParameter('ownerId', i),
                                start_date: (0, moment_timezone_1.tz)(startDate, defaultTimezone).format(),
                                end_date: (0, moment_timezone_1.tz)(endDate, defaultTimezone).format(),
                                targetable_type: this.getNodeParameter('targetableType', i),
                                targetable_id: this.getNodeParameter('targetable_id', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'POST', '/sales_activities', { sales_activity: body });
                            responseData = responseData.sales_activity;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //          salesActivity: delete
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#delete_a_sales_activity
                            const salesActivityId = this.getNodeParameter('salesActivityId', i);
                            const endpoint = `/sales_activities/${salesActivityId}`;
                            yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'DELETE', endpoint);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //            salesActivity: get
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#view_a_sales_activity
                            const salesActivityId = this.getNodeParameter('salesActivityId', i);
                            const endpoint = `/sales_activities/${salesActivityId}`;
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'GET', endpoint);
                            responseData = responseData.sales_activity;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //          salesActivity: getAll
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#list_all_sales_activities
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/sales_activities');
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //          salesActivity: update
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#update_a_sales_activity
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (!Object.keys(updateFields).length) {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const body = {};
                            const { from_date, end_date } = updateFields, rest = __rest(updateFields, ["from_date", "end_date"]);
                            if (from_date) {
                                body.from_date = (0, moment_timezone_1.tz)(from_date, defaultTimezone).format();
                            }
                            if (end_date) {
                                body.end_date = (0, moment_timezone_1.tz)(end_date, defaultTimezone).format();
                            }
                            if (Object.keys(rest).length) {
                                Object.assign(body, rest);
                            }
                            const salesActivityId = this.getNodeParameter('salesActivityId', i);
                            const endpoint = `/sales_activities/${salesActivityId}`;
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'PUT', endpoint, body);
                            responseData = responseData.sales_activity;
                        }
                    }
                    else if (resource === 'task') {
                        // **********************************************************************
                        //                                  task
                        // **********************************************************************
                        // https://developers.freshworks.com/crm/api/#tasks
                        if (operation === 'create') {
                            // ----------------------------------------
                            //               task: create
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#create_task
                            const dueDate = this.getNodeParameter('dueDate', i);
                            const body = {
                                title: this.getNodeParameter('title', i),
                                owner_id: this.getNodeParameter('ownerId', i),
                                due_date: (0, moment_timezone_1.tz)(dueDate, defaultTimezone).format(),
                                targetable_type: this.getNodeParameter('targetableType', i),
                                targetable_id: this.getNodeParameter('targetable_id', i),
                            };
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (Object.keys(additionalFields).length) {
                                Object.assign(body, additionalFields);
                            }
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'POST', '/tasks', body);
                            responseData = responseData.task;
                        }
                        else if (operation === 'delete') {
                            // ----------------------------------------
                            //               task: delete
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#delete_a_task
                            const taskId = this.getNodeParameter('taskId', i);
                            yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'DELETE', `/tasks/${taskId}`);
                            responseData = { success: true };
                        }
                        else if (operation === 'get') {
                            // ----------------------------------------
                            //                task: get
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#view_a_task
                            const taskId = this.getNodeParameter('taskId', i);
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'GET', `/tasks/${taskId}`);
                            responseData = responseData.task;
                        }
                        else if (operation === 'getAll') {
                            // ----------------------------------------
                            //               task: getAll
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#list_all_tasks
                            const { filter, include } = this.getNodeParameter('filters', i);
                            const qs = {
                                filter: 'open',
                            };
                            if (filter) {
                                qs.filter = filter;
                            }
                            if (include) {
                                qs.include = include;
                            }
                            responseData = yield GenericFunctions_1.handleListing.call(this, 'GET', '/tasks', {}, qs);
                        }
                        else if (operation === 'update') {
                            // ----------------------------------------
                            //               task: update
                            // ----------------------------------------
                            // https://developers.freshworks.com/crm/api/#update_a_task
                            const body = {};
                            const updateFields = this.getNodeParameter('updateFields', i);
                            if (!Object.keys(updateFields).length) {
                                GenericFunctions_1.throwOnEmptyUpdate.call(this, resource);
                            }
                            const { dueDate } = updateFields, rest = __rest(updateFields, ["dueDate"]);
                            if (dueDate) {
                                body.due_date = (0, moment_timezone_1.tz)(dueDate, defaultTimezone).format();
                            }
                            if (Object.keys(rest).length) {
                                Object.assign(body, rest);
                            }
                            const taskId = this.getNodeParameter('taskId', i);
                            responseData = yield GenericFunctions_1.freshworksCrmApiRequest.call(this, 'PUT', `/tasks/${taskId}`, body);
                            responseData = responseData.task;
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ json: { error: error.message } });
                        continue;
                    }
                    throw error;
                }
                Array.isArray(responseData)
                    ? returnData.push(...responseData)
                    : returnData.push(responseData);
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.FreshworksCrm = FreshworksCrm;
