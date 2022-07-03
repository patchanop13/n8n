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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Onfleet = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const formatAddress = (unparsed, address, addressNumber, addressStreet, addressCity, addressCountry, additionalFields) => {
    let destination;
    if (unparsed) {
        destination = { address: { unparsed: address } };
    }
    else {
        destination = {
            address: {
                number: addressNumber,
                street: addressStreet,
                city: addressCity,
                country: addressCountry,
            },
        };
    }
    // Adding destination extra fields
    if (additionalFields.addressName) {
        destination.address.name = additionalFields.addressName;
    }
    if (additionalFields.addressApartment) {
        destination.address.apartment = additionalFields.addressApartment;
    }
    if (additionalFields.addressState) {
        destination.address.state = additionalFields.addressState;
    }
    if (additionalFields.addressPostalCode) {
        destination.address.postalCode = additionalFields.addressPostalCode;
    }
    if (additionalFields.addressNotes) {
        destination.notes = additionalFields.addressNotes;
    }
    return destination;
};
class Onfleet {
    /**
     * Returns a valid formatted destination object
     * @param unparsed Whether the address is parsed or not
     * @param address Destination address
     * @param addressNumber Destination number
     * @param addressStreet Destination street
     * @param addressCity Destination city
     * @param addressCountry Destination country
     * @param additionalFields Destination additional fields
     * @returns
     */
    /**
     * Gets the properties of a destination according to the operation chose
     * @param item Current execution data
     * @param operation Current destination operation
     * @param shared Whether the collection is in other resource or not
     * @returns {OnfleetDestination} Destination information
     */
    static getDestinationFields(item, operation, shared = false) {
        if (['create', 'update'].includes(operation)) {
            /* -------------------------------------------------------------------------- */
            /*               Get fields for create and update a destination               */
            /* -------------------------------------------------------------------------- */
            if (shared !== false) {
                let destination;
                if (typeof shared === 'boolean' && shared) {
                    const { destinationProperties = {} } = this.getNodeParameter('destination', item);
                    destination = destinationProperties;
                }
                else if (typeof shared !== 'boolean') {
                    const { destination: destinationCollection = {} } = this.getNodeParameter(shared.parent, item);
                    destination = destinationCollection.destinationProperties;
                }
                if (!destination || Object.keys((destination)).length === 0) {
                    return [];
                }
                const _a = destination, { unparsed, address, addressNumber, addressStreet, addressCity, addressCountry } = _a, additionalFields = __rest(_a, ["unparsed", "address", "addressNumber", "addressStreet", "addressCity", "addressCountry"]);
                return formatAddress(unparsed, address, addressNumber, addressStreet, addressCity, addressCountry, additionalFields);
            }
            else {
                let unparsed, address, addressNumber, addressStreet, addressCity, addressCountry, additionalFields;
                unparsed = this.getNodeParameter('unparsed', item);
                if (unparsed) {
                    address = this.getNodeParameter('address', item);
                }
                else {
                    addressNumber = this.getNodeParameter('addressNumber', item);
                    addressStreet = this.getNodeParameter('addressStreet', item);
                    addressCity = this.getNodeParameter('addressCity', item);
                    addressCountry = this.getNodeParameter('addressCountry', item);
                }
                additionalFields = this.getNodeParameter('additionalFields', item);
                return formatAddress(unparsed, address, addressNumber, addressStreet, addressCity, addressCountry, additionalFields);
            }
        }
        return null;
    }
    /**
     * Gets the properties of an administrator according to the operation chose
     * @param item Current execution data
     * @param operation Current administrator operation
     * @returns {OnfleetAdmins} Administrator information
     */
    static getAdminFields(item, operation) {
        if (operation === 'create') {
            /* -------------------------------------------------------------------------- */
            /*                         Get fields for create admin                        */
            /* -------------------------------------------------------------------------- */
            const name = this.getNodeParameter('name', item);
            const email = this.getNodeParameter('email', item);
            const additionalFields = this.getNodeParameter('additionalFields', item);
            const adminData = { name, email };
            // Adding additional fields
            Object.assign(adminData, additionalFields);
            return adminData;
        }
        else if (operation === 'update') {
            /* -------------------------------------------------------------------------- */
            /*                         Get fields for update admin                        */
            /* -------------------------------------------------------------------------- */
            const updateFields = this.getNodeParameter('updateFields', item);
            const adminData = {};
            if (!Object.keys(updateFields).length) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Select at least one field to be updated');
            }
            // Adding additional fields
            Object.assign(adminData, updateFields);
            return adminData;
        }
        return null;
    }
    /**
     * Gets the properties of a hub according to the operation chose
     * @param item Current execution data
     * @param operation Current hub operation
     * @returns {OnfleetHubs|null} Hub information
     */
    static getHubFields(item, operation) {
        if (operation === 'create') {
            /* -------------------------------------------------------------------------- */
            /*                          Get fields for create hub                         */
            /* -------------------------------------------------------------------------- */
            const destination = Onfleet.getDestinationFields.call(this, item, operation, true);
            const name = this.getNodeParameter('name', item);
            const additionalFields = this.getNodeParameter('additionalFields', item);
            const hubData = Object.assign({ name }, destination);
            // Adding additional fields
            Object.assign(hubData, additionalFields);
            return hubData;
        }
        else if (operation === 'update') {
            /* -------------------------------------------------------------------------- */
            /*                          Get fields for update hub                         */
            /* -------------------------------------------------------------------------- */
            const destination = Onfleet.getDestinationFields.call(this, item, operation, { parent: 'updateFields' });
            const hubData = Object.assign({}, destination);
            // Adding additional fields
            const updateFields = this.getNodeParameter('updateFields', item);
            if (!Object.keys(updateFields).length) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Select at least one field to be updated');
            }
            Object.assign(hubData, updateFields);
            return hubData;
        }
        return null;
    }
    /**
     * Gets the properties of a worker according to the operation chose
     * @param item Current execution data
     * @param operation Current worker operation
     * @returns {OnfleetWorker|OnfleetWorkerFilter|OnfleetWorkerSchedule|null} Worker information
     */
    static getWorkerFields(item, operation) {
        if (operation === 'create') {
            /* -------------------------------------------------------------------------- */
            /*                        Get fields for create worker                        */
            /* -------------------------------------------------------------------------- */
            const name = this.getNodeParameter('name', item);
            const phone = this.getNodeParameter('phone', item);
            const teams = this.getNodeParameter('teams', item);
            const workerData = { name, phone, teams };
            // Adding additional fields
            const additionalFields = this.getNodeParameter('additionalFields', item);
            if (additionalFields.vehicle) {
                const { vehicleProperties } = additionalFields.vehicle;
                Object.assign(workerData, { vehicle: vehicleProperties });
                delete additionalFields.vehicle;
            }
            Object.assign(workerData, additionalFields);
            return workerData;
        }
        else if (operation === 'update') {
            /* -------------------------------------------------------------------------- */
            /*                        Get fields for update worker                        */
            /* -------------------------------------------------------------------------- */
            const workerData = {};
            // Adding additional fields
            const updateFields = this.getNodeParameter('updateFields', item);
            if (!Object.keys(updateFields).length) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Select at least one field to be updated');
            }
            Object.assign(workerData, updateFields);
            return workerData;
        }
        else if (operation === 'get') {
            const options = this.getNodeParameter('options', item, {});
            const workerFilter = {};
            if (options.filter) {
                options.filter = options.filter.join(',');
            }
            if (typeof options.analytics === 'boolean') {
                options.analytics = options.analytics ? 'true' : 'false';
            }
            Object.assign(workerFilter, options);
            return workerFilter;
        }
        else if (operation === 'getAll') {
            /* -------------------------------------------------------------------------- */
            /*                    Get fields for get and getAll workers                   */
            /* -------------------------------------------------------------------------- */
            const options = this.getNodeParameter('options', item, {});
            const filters = this.getNodeParameter('filters', item, {});
            const workerFilter = {};
            if (filters.states) {
                filters.states = filters.states.join(',');
            }
            if (filters.teams) {
                filters.teams = filters.teams.join(',');
            }
            if (filters.phones) {
                filters.phones = filters.phones.join(',');
            }
            if (options.filter) {
                options.filter = options.filter.join(',');
            }
            Object.assign(workerFilter, options);
            Object.assign(workerFilter, filters);
            return workerFilter;
        }
        else if (operation === 'setSchedule') {
            /* -------------------------------------------------------------------------- */
            /*                            Set a worker schedule                           */
            /* -------------------------------------------------------------------------- */
            const { scheduleProperties } = this.getNodeParameter('schedule', item);
            const entries = (scheduleProperties || []).map(entry => {
                const { timezone, date, shifts } = entry;
                const { shiftsProperties } = shifts;
                return {
                    timezone: timezone,
                    date: (0, moment_timezone_1.default)(date).format('YYYY-MM-DD'),
                    shifts: shiftsProperties.map(({ start, end }) => [
                        new Date(start).getTime(),
                        new Date(end).getTime(),
                    ]),
                };
            });
            return { entries };
        }
        return null;
    }
    /**
     * Gets the properties of a webhooks according to the operation chose
     * @param item Current execution data
     * @param operation Current webhooks operation
     * @returns {OnfleetWebhook} Webhooks information
     */
    static getWebhookFields(item, operation) {
        if (operation === 'create') {
            /* -------------------------------------------------------------------------- */
            /*                        Get fields for create webhook                       */
            /* -------------------------------------------------------------------------- */
            const url = this.getNodeParameter('url', item);
            const name = this.getNodeParameter('name', item);
            const trigger = this.getNodeParameter('trigger', item);
            const additionalFields = this.getNodeParameter('additionalFields', item);
            const webhookData = { url, name, trigger };
            // Adding additional fields
            Object.assign(webhookData, additionalFields);
            return webhookData;
        }
        return null;
    }
    /**
     * Returns a valid formatted recipient object
     * @param name Recipient name
     * @param phone Recipient phone
     * @param additionalFields Recipient additional fields
     * @returns
     */
    static formatRecipient(name, phone, additionalFields, options = {}) {
        const recipient = { name, phone };
        // Adding recipient extra fields
        if (additionalFields.recipientNotes) {
            recipient.notes = additionalFields.recipientNotes;
        }
        if (additionalFields.recipientSkipSMSNotifications) {
            recipient.skipSMSNotifications = additionalFields.recipientSkipSMSNotifications;
        }
        if ('recipientSkipPhoneNumberValidation' in options) {
            recipient.skipPhoneNumberValidation = options.recipientSkipPhoneNumberValidation || false;
        }
        return recipient;
    }
    /**
     * Gets the properties of a recipient according to the operation chose
     * @param item Current execution data
     * @param operation Current recipient operation
     * @param shared Whether the collection is in other resource or not
     * @returns {OnfleetRecipient} Recipient information
     */
    static getRecipientFields(item, operation, shared = false) {
        if (operation === 'create') {
            /* -------------------------------------------------------------------------- */
            /*                       Get fields to create recipient                       */
            /* -------------------------------------------------------------------------- */
            if (shared) {
                const { recipient: recipientData = {} } = this.getNodeParameter('additionalFields', item, {});
                const options = this.getNodeParameter('options', item, {});
                const { recipientProperties: recipient = {} } = recipientData;
                if (!recipient || Object.keys(recipient).length === 0) {
                    return null;
                }
                const _a = recipient, { recipientName: name, recipientPhone: phone } = _a, additionalFields = __rest(_a, ["recipientName", "recipientPhone"]);
                return Onfleet.formatRecipient(name, phone, additionalFields, options);
            }
            else {
                const name = this.getNodeParameter('recipientName', item);
                const phone = this.getNodeParameter('recipientPhone', item);
                const additionalFields = this.getNodeParameter('additionalFields', item);
                const options = this.getNodeParameter('options', item);
                return Onfleet.formatRecipient(name, phone, additionalFields, options);
            }
        }
        else if (operation === 'update') {
            /* -------------------------------------------------------------------------- */
            /*                       Get fields to update recipient                       */
            /* -------------------------------------------------------------------------- */
            const _b = this.getNodeParameter('updateFields', item), { recipientName: name = '', recipientPhone: phone = '' } = _b, additionalFields = __rest(_b, ["recipientName", "recipientPhone"]);
            const recipientData = {};
            // Adding additional fields
            if (name) {
                recipientData.name = name;
            }
            if (phone) {
                recipientData.phone = phone;
            }
            Object.assign(recipientData, additionalFields);
            return recipientData;
        }
        return null;
    }
    /**
     * Gets the properties of a task according to the operation chose
     * @param item Current execution data
     * @param operation Current task operation
     * @returns {OnfleetListTaskFilters | OnfleetTask } Task information
     */
    static getTaskFields(item, operation) {
        if (operation === 'create') {
            /* -------------------------------------------------------------------------- */
            /*                         Get fields to create a task                        */
            /* -------------------------------------------------------------------------- */
            const additionalFields = this.getNodeParameter('additionalFields', item);
            const destination = Onfleet.getDestinationFields.call(this, item, operation, true);
            // Adding recipients information
            const recipient = Onfleet.getRecipientFields.call(this, item, operation, true);
            const taskData = { destination, recipients: [recipient] };
            const { completeAfter = null, completeBefore = null } = additionalFields, extraFields = __rest(additionalFields, ["completeAfter", "completeBefore"]);
            if (completeAfter)
                taskData.completeAfter = new Date(completeAfter).getTime();
            if (completeBefore)
                taskData.completeBefore = new Date(completeBefore).getTime();
            Object.assign(taskData, extraFields);
            return taskData;
        }
        else if (operation === 'update') {
            /* -------------------------------------------------------------------------- */
            /*                          Get fields to update task                         */
            /* -------------------------------------------------------------------------- */
            const updateFields = this.getNodeParameter('updateFields', item);
            const taskData = {};
            if (!Object.keys(updateFields).length) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Select at least one field to be updated');
            }
            const { completeAfter = null, completeBefore = null } = updateFields, extraFields = __rest(updateFields, ["completeAfter", "completeBefore"]);
            if (completeAfter)
                taskData.completeAfter = new Date(completeAfter).getTime();
            if (completeBefore)
                taskData.completeBefore = new Date(completeBefore).getTime();
            Object.assign(taskData, extraFields);
            return taskData;
        }
        else if (operation === 'clone') {
            /* -------------------------------------------------------------------------- */
            /*                          Get fields to clone task                          */
            /* -------------------------------------------------------------------------- */
            const overrideFields = this.getNodeParameter('overrideFields', item);
            const options = {};
            if (overrideFields.includeMetadata)
                options.includeMetadata = overrideFields.includeMetadata;
            if (overrideFields.includeBarcodes)
                options.includeBarcodes = overrideFields.includeBarcodes;
            if (overrideFields.includeDependencies)
                options.includeDependencies = overrideFields.includeDependencies;
            // Adding overrides data
            const { notes, pickupTask, serviceTime, completeAfter, completeBefore, } = overrideFields;
            const overridesData = {};
            if (notes)
                overridesData.notes = notes;
            if (typeof pickupTask !== 'undefined')
                overridesData.pickupTask = pickupTask;
            if (serviceTime)
                overridesData.serviceTime = serviceTime;
            if (completeAfter)
                overridesData.completeAfter = new Date(completeAfter).getTime();
            if (completeBefore)
                overridesData.completeBefore = new Date(completeBefore).getTime();
            if (overridesData && Object.keys(overridesData).length > 0) {
                options.overrides = overridesData;
            }
            return { options };
        }
        else if (operation === 'getAll') {
            /* -------------------------------------------------------------------------- */
            /*                          Get fields to list tasks                          */
            /* -------------------------------------------------------------------------- */
            const filters = this.getNodeParameter('filters', item);
            const listTaskData = {};
            const allStates = '0,1,2,3';
            const twoWeeksInMilisecods = () => (604800 * 1000);
            // Adding extra fields to search tasks
            if (filters.from) {
                listTaskData.from = new Date(filters.from).getTime();
            }
            else {
                listTaskData.from = new Date().getTime() - twoWeeksInMilisecods();
            }
            if (filters.to) {
                listTaskData.to = new Date(filters.to).getTime();
            }
            if (filters.state) {
                listTaskData.state = filters.state.join(',');
                if (listTaskData.state.includes('all')) {
                    listTaskData.state = allStates;
                }
            }
            return listTaskData;
        }
        else if (operation === 'complete') {
            /* -------------------------------------------------------------------------- */
            /*                        Get fields to complete a task                       */
            /* -------------------------------------------------------------------------- */
            const additionalFields = this.getNodeParameter('additionalFields', item);
            const success = this.getNodeParameter('success', item);
            const taskData = { completionDetails: { success } };
            if (additionalFields.notes)
                taskData.completionDetails.notes = additionalFields.notes;
            return taskData;
        }
        return null;
    }
    /**
     * Gets the properties of a team according to the operation chose
     * @param item Current execution data
     * @param operation Current team operation
     * @returns {OnfleetTeams} Team information
     */
    static getTeamFields(item, operation) {
        if (operation === 'create') {
            /* -------------------------------------------------------------------------- */
            /*                         Get fields to create a team                        */
            /* -------------------------------------------------------------------------- */
            const name = this.getNodeParameter('name', item);
            const workers = this.getNodeParameter('workers', item);
            const managers = this.getNodeParameter('managers', item);
            const additionalFields = this.getNodeParameter('additionalFields', item);
            const teamData = { name, workers, managers };
            // Adding additional fields
            Object.assign(teamData, additionalFields);
            return teamData;
        }
        else if (operation === 'update') {
            /* -------------------------------------------------------------------------- */
            /*                         Get fields to update a team                        */
            /* -------------------------------------------------------------------------- */
            const teamData = {};
            // Adding additional fields
            const updateFields = this.getNodeParameter('updateFields', item);
            if (!Object.keys(updateFields).length) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Select at least one field to be updated');
            }
            Object.assign(teamData, updateFields);
            return teamData;
        }
        else if (operation === 'getTimeEstimates') {
            /* -------------------------------------------------------------------------- */
            /*      Get driver time estimates for tasks that haven't been created yet     */
            /* -------------------------------------------------------------------------- */
            const _a = this.getNodeParameter('filters', item), { dropOff = {}, pickUp = {} } = _a, additionalFields = __rest(_a, ["dropOff", "pickUp"]);
            const { dropOffProperties = {} } = dropOff;
            const { pickUpProperties = {} } = pickUp;
            const hasPickUp = pickUp && Object.keys(pickUpProperties).length > 0;
            const hasDropOff = dropOffProperties && Object.keys(dropOffProperties).length > 0;
            if (!hasPickUp && !hasDropOff) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'At least 1 of Drop-Off location or Pick-Up location must be selected');
            }
            const workerTimeEstimates = {};
            if (hasPickUp) {
                const { pickupLongitude: longitude, pickupLatitude: latitude, pickupTime, } = pickUpProperties;
                workerTimeEstimates.pickupLocation = `${longitude},${latitude}`;
                if (pickupTime) {
                    workerTimeEstimates.pickupTime = (0, moment_timezone_1.default)(new Date(pickupTime)).local().unix();
                }
            }
            if (hasDropOff) {
                const { dropOffLongitude: longitude, dropOffLatitude: latitude } = dropOffProperties;
                workerTimeEstimates.dropoffLocation = `${longitude},${latitude}`;
            }
            Object.assign(workerTimeEstimates, additionalFields);
            return workerTimeEstimates;
        }
        else if (operation === 'autoDispatch') {
            /* -------------------------------------------------------------------------- */
            /*                  Dynamically dispatching tasks on the fly                  */
            /* -------------------------------------------------------------------------- */
            const teamAutoDispatch = {};
            const _b = this.getNodeParameter('additionalFields', item), { scheduleTimeWindow = {}, taskTimeWindow = {}, endingRoute = {} } = _b, additionalFields = __rest(_b, ["scheduleTimeWindow", "taskTimeWindow", "endingRoute"]);
            const { endingRouteProperties = {} } = endingRoute;
            const { scheduleTimeWindowProperties = {} } = scheduleTimeWindow;
            const { taskTimeWindowProperties = {} } = taskTimeWindow;
            if (scheduleTimeWindowProperties && Object.keys(scheduleTimeWindowProperties).length > 0) {
                const { startTime, endTime } = scheduleTimeWindowProperties;
                teamAutoDispatch.scheduleTimeWindow = [
                    (0, moment_timezone_1.default)(new Date(startTime)).local().unix(), (0, moment_timezone_1.default)(new Date(endTime)).local().unix(),
                ];
            }
            if (endingRouteProperties && Object.keys(endingRouteProperties).length > 0) {
                const { routeEnd, hub } = endingRouteProperties;
                teamAutoDispatch.routeEnd = ({
                    'anywhere': null,
                    'hub': `hub://${hub}`,
                    'team_hub': 'teams://DEFAULT',
                    'worker_routing_address': 'workers://ROUTING_ADDRESS',
                })[routeEnd];
            }
            if (taskTimeWindowProperties && Object.keys(taskTimeWindowProperties).length > 0) {
                const { startTime, endTime } = taskTimeWindowProperties;
                teamAutoDispatch.taskTimeWindow = [
                    (0, moment_timezone_1.default)(new Date(startTime)).local().unix(), (0, moment_timezone_1.default)(new Date(endTime)).local().unix(),
                ];
            }
            Object.assign(teamAutoDispatch, additionalFields);
            return teamAutoDispatch;
        }
        return null;
    }
    /**
     * Execute the task operations
     * @param resource Resource to be executed (Task)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     * @returns Task information
     */
    static executeTaskOperations(resource, operation, items) {
        return __awaiter(this, void 0, void 0, function* () {
            if (operation === 'create' && Object.keys(items).length > 1) {
                /* -------------------------------------------------------------------------- */
                /*                       Create multiple tasks by batch                       */
                /* -------------------------------------------------------------------------- */
                const path = `${resource}/batch`;
                const tasksData = { tasks: items.map((_item, index) => Onfleet.getTaskFields.call(this, index, operation)) };
                //@ts-ignore
                const { tasks: tasksCreated } = yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', path, tasksData);
                return tasksCreated;
            }
            const responseData = [];
            for (const key of Object.keys(items)) {
                const index = Number(key);
                try {
                    if (operation === 'create') {
                        /* -------------------------------------------------------------------------- */
                        /*                              Create a new task                             */
                        /* -------------------------------------------------------------------------- */
                        const taskData = Onfleet.getTaskFields.call(this, index, operation);
                        if (!taskData) {
                            continue;
                        }
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', resource, taskData));
                    }
                    else if (operation === 'get') {
                        /* -------------------------------------------------------------------------- */
                        /*                              Get a single task                             */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const shortId = String(id).length <= 8;
                        const path = `${resource}${(shortId ? '/shortId' : '')}/${id}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path));
                    }
                    else if (operation === 'clone') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Clone a task                                */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        // tslint:disable-next-line: no-any
                        const taskData = Onfleet.getTaskFields.call(this, index, operation);
                        if (!taskData) {
                            continue;
                        }
                        const path = `${resource}/${id}/clone`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', path, taskData));
                    }
                    else if (operation === 'delete') {
                        /* -------------------------------------------------------------------------- */
                        /*                            Delete a single task                            */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const path = `${resource}/${id}`;
                        yield GenericFunctions_1.onfleetApiRequest.call(this, 'DELETE', path);
                        responseData.push({ success: true });
                    }
                    else if (operation === 'getAll') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Get all tasks                               */
                        /* -------------------------------------------------------------------------- */
                        const taskData = Onfleet.getTaskFields.call(this, 0, operation);
                        if (!taskData)
                            return [];
                        const returnAll = this.getNodeParameter('returnAll', 0, false);
                        const path = `${resource}/all`;
                        let tasks;
                        if (returnAll === true) {
                            tasks = yield GenericFunctions_1.onfleetApiRequestAllItems.call(this, 'tasks', 'GET', path, {}, taskData);
                        }
                        else {
                            const limit = this.getNodeParameter('limit', 0);
                            tasks = yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path, {}, taskData);
                            tasks = tasks.tasks;
                            tasks = tasks.splice(0, limit);
                        }
                        responseData.push(...tasks);
                    }
                    else if (operation === 'complete') {
                        /* -------------------------------------------------------------------------- */
                        /*                            Force complete a task                           */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const taskData = Onfleet.getTaskFields.call(this, index, operation);
                        if (!taskData) {
                            continue;
                        }
                        const path = `${resource}/${id}/complete`;
                        yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', path, taskData);
                        responseData.push({ success: true });
                    }
                    else if (operation === 'update') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Update a task                               */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', 0);
                        const path = `${resource}/${id}`;
                        const taskData = Onfleet.getTaskFields.call(this, index, operation);
                        if (!taskData) {
                            continue;
                        }
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'PUT', path, taskData));
                    }
                }
                catch (error) {
                    //@ts-ignore
                    if (this.continueOnFail()) {
                        responseData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            return responseData;
        });
    }
    /**
     * Execute the destination operations
     * @param resource Resource to be executed (Destination)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     * @returns Destination information
     */
    static executeDestinationOperations(resource, operation, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = [];
            for (const key of Object.keys(items)) {
                const index = Number(key);
                try {
                    if (operation === 'create') {
                        /* -------------------------------------------------------------------------- */
                        /*                             Create destination                             */
                        /* -------------------------------------------------------------------------- */
                        const destinationData = Onfleet.getDestinationFields.call(this, index, operation);
                        if (!destinationData) {
                            continue;
                        }
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', resource, destinationData));
                    }
                    else if (operation === 'get') {
                        /* -------------------------------------------------------------------------- */
                        /*                           Get single destination                           */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const path = `${resource}/${id}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path));
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        responseData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            return responseData;
        });
    }
    /**
     * Execute the organization operations
     * @param resource Resource to be executed (Organization)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     * @returns Organization information
     */
    static executeOrganizationOperations(resource, operation, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = [];
            for (const key of Object.keys(items)) {
                const index = Number(key);
                try {
                    if (operation === 'get') {
                        /* -------------------------------------------------------------------------- */
                        /*                          Get organization details                          */
                        /* -------------------------------------------------------------------------- */
                        const path = 'organization';
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path));
                    }
                    else if (operation === 'getDelegatee') {
                        /* -------------------------------------------------------------------------- */
                        /*                         Get organization delegatee                         */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const path = `${resource}/${id}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path));
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        responseData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            return responseData;
        });
    }
    /**
     * Execute the recipient operations
     * @param resource Resource to be executed (Recipient)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     * @returns Recipient information
     */
    static executeRecipientOperations(resource, operation, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = [];
            for (const key of Object.keys(items)) {
                const index = Number(key);
                try {
                    if (operation === 'create') {
                        /* -------------------------------------------------------------------------- */
                        /*                           Create a new recipient                           */
                        /* -------------------------------------------------------------------------- */
                        const recipientData = Onfleet.getRecipientFields.call(this, index, operation);
                        if (!recipientData) {
                            continue;
                        }
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', resource, recipientData));
                    }
                    else if (operation === 'update') {
                        /* -------------------------------------------------------------------------- */
                        /*                             Update a recipient                             */
                        /* -------------------------------------------------------------------------- */
                        const recipientData = Onfleet.getRecipientFields.call(this, index, operation);
                        if (!recipientData) {
                            continue;
                        }
                        const id = this.getNodeParameter('id', index);
                        const path = `${resource}/${id}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'PUT', path, recipientData));
                    }
                    else if (operation === 'get') {
                        /* -------------------------------------------------------------------------- */
                        /*                          Get recipient information                         */
                        /* -------------------------------------------------------------------------- */
                        const lookupBy = this.getNodeParameter('getBy', index);
                        const lookupByValue = this.getNodeParameter(lookupBy, index);
                        const path = `${resource}${lookupBy === 'id' ? '' : ('/' + lookupBy)}/${lookupByValue}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path));
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        responseData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            return responseData;
        });
    }
    /**
     * Execute the administrator operations
     * @param resource Resource to be executed (Administrator)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     * @returns Administrator information
     */
    static executeAdministratorOperations(resource, operation, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = [];
            for (const key of Object.keys(items)) {
                const index = Number(key);
                try {
                    if (operation === 'getAll') {
                        /* -------------------------------------------------------------------------- */
                        /*                             Get administrators                             */
                        /* -------------------------------------------------------------------------- */
                        const returnAll = this.getNodeParameter('returnAll', 0, false);
                        let adminUsers = yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', resource);
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', 0);
                            adminUsers = adminUsers.slice(0, limit);
                        }
                        responseData.push(...adminUsers);
                    }
                    else if (operation === 'create') {
                        /* -------------------------------------------------------------------------- */
                        /*                             Create a new admin                             */
                        /* -------------------------------------------------------------------------- */
                        const adminData = Onfleet.getAdminFields.call(this, index, operation);
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', resource, adminData));
                    }
                    else if (operation === 'update') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Update admin                                */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const adminData = Onfleet.getAdminFields.call(this, index, operation);
                        const path = `${resource}/${id}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'PUT', path, adminData));
                    }
                    else if (operation === 'delete') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Delete admin                                */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const path = `${resource}/${id}`;
                        yield GenericFunctions_1.onfleetApiRequest.call(this, 'DELETE', path);
                        responseData.push({ success: true });
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        responseData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            return responseData;
        });
    }
    /**
     * Execute the hub operations
     * @param resource Resource to be executed (Hub)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     * @returns Hub information
     */
    static executeHubOperations(resource, operation, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = [];
            for (const key of Object.keys(items)) {
                const index = Number(key);
                try {
                    if (operation === 'getAll') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Get all hubs                                */
                        /* -------------------------------------------------------------------------- */
                        const returnAll = this.getNodeParameter('returnAll', 0, false);
                        let hubs = yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', resource);
                        if (returnAll === false) {
                            const limit = this.getNodeParameter('limit', 0);
                            hubs = hubs.slice(0, limit);
                        }
                        responseData.push(...hubs);
                    }
                    else if (operation === 'create') {
                        /* -------------------------------------------------------------------------- */
                        /*                              Create a new hub                              */
                        /* -------------------------------------------------------------------------- */
                        const hubData = Onfleet.getHubFields.call(this, index, operation);
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', resource, hubData));
                    }
                    if (operation === 'update') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Update a hub                                */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const hubData = Onfleet.getHubFields.call(this, index, operation);
                        const path = `${resource}/${id}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'PUT', path, hubData));
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        responseData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            return responseData;
        });
    }
    /**
     * Execute the worker operations
     * @param resource Resource to be executed (Worker)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     * @returns Workers information
     */
    static executeWorkerOperations(resource, operation, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = [];
            for (const key of Object.keys(items)) {
                const index = Number(key);
                try {
                    if (operation === 'getAll') {
                        /* -------------------------------------------------------------------------- */
                        /*                               Get all workers                              */
                        /* -------------------------------------------------------------------------- */
                        const byLocation = this.getNodeParameter('byLocation', index);
                        const returnAll = this.getNodeParameter('returnAll', index, false);
                        let workers;
                        if (byLocation) {
                            const longitude = this.getNodeParameter('longitude', index);
                            const latitude = this.getNodeParameter('latitude', index);
                            const filters = this.getNodeParameter('filters', index);
                            const path = `${resource}/location`;
                            workers = yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path, {}, Object.assign({ longitude, latitude }, filters));
                            workers = workers.workers;
                        }
                        else {
                            const workerFilters = Onfleet.getWorkerFields.call(this, 0, operation);
                            workers = yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', resource, {}, workerFilters);
                        }
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', index);
                            workers = workers.slice(0, limit);
                        }
                        responseData.push(...workers);
                    }
                    else if (operation === 'get') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Get a worker                                */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const workerFilters = Onfleet.getWorkerFields.call(this, index, operation);
                        const path = `${resource}/${id}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path, {}, workerFilters));
                    }
                    else if (operation === 'create') {
                        /* -------------------------------------------------------------------------- */
                        /*                             Create a new worker                            */
                        /* -------------------------------------------------------------------------- */
                        const workerData = Onfleet.getWorkerFields.call(this, index, operation);
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', resource, workerData));
                    }
                    else if (operation === 'update') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Update worker                               */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const workerData = Onfleet.getWorkerFields.call(this, index, operation);
                        const path = `${resource}/${id}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'PUT', path, workerData));
                    }
                    else if (operation === 'delete') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Delete worker                               */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const path = `${resource}/${id}`;
                        yield GenericFunctions_1.onfleetApiRequest.call(this, 'DELETE', path);
                        responseData.push({ success: true });
                    }
                    else if (operation === 'getSchedule') {
                        /* -------------------------------------------------------------------------- */
                        /*                             Get worker schedule                            */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const path = `${resource}/${id}/schedule`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path));
                    }
                    else if (operation === 'setSchedule') {
                        /* -------------------------------------------------------------------------- */
                        /*                            Set a worker schedule                           */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const workerSchedule = Onfleet.getWorkerFields.call(this, index, operation);
                        const path = `${resource}/${id}/schedule`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', path, workerSchedule));
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        responseData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            return responseData;
        });
    }
    /**
     * Execute the webhook operations
     * @param resource Resource to be executed (Webhook)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     * @returns Webhook information
     */
    static executeWebhookOperations(resource, operation, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = [];
            for (const key of Object.keys(items)) {
                const index = Number(key);
                try {
                    if (operation === 'getAll') {
                        /* -------------------------------------------------------------------------- */
                        /*                              Get all webhooks                              */
                        /* -------------------------------------------------------------------------- */
                        responseData.push(...yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', resource));
                    }
                    else if (operation === 'create') {
                        /* -------------------------------------------------------------------------- */
                        /*                            Create a new webhook                            */
                        /* -------------------------------------------------------------------------- */
                        const webhookData = Onfleet.getWebhookFields.call(this, index, operation);
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', resource, webhookData));
                    }
                    else if (operation === 'delete') {
                        /* -------------------------------------------------------------------------- */
                        /*                              Delete a webhook                              */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const path = `${resource}/${id}`;
                        yield GenericFunctions_1.onfleetApiRequest.call(this, 'DELETE', path);
                        responseData.push({ success: true });
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        responseData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            return responseData;
        });
    }
    /**
     * Execute the containers operations
     * @param resource Resource to be executed (Container)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     * @returns Container information
     */
    static executeContainerOperations(resource, operation, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = [];
            for (const key of Object.keys(items)) {
                const index = Number(key);
                try {
                    if (operation === 'get') {
                        /* -------------------------------------------------------------------------- */
                        /*                        Get container by id and type                        */
                        /* -------------------------------------------------------------------------- */
                        const containerId = this.getNodeParameter('containerId', index);
                        const containerType = this.getNodeParameter('containerType', index);
                        const path = `${resource}/${containerType}/${containerId}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path));
                    }
                    else if (['addTask', 'updateTask'].includes(operation)) {
                        /* -------------------------------------------------------------------------- */
                        /*                      Add or update tasks to container                      */
                        /* -------------------------------------------------------------------------- */
                        const containerId = this.getNodeParameter('containerId', index);
                        const containerType = this.getNodeParameter('containerType', index, 'workers');
                        const options = this.getNodeParameter('options', index);
                        const tasks = this.getNodeParameter('tasks', index);
                        if (operation === 'addTask') {
                            const type = this.getNodeParameter('type', index);
                            if (type === 1) {
                                const tasksIndex = this.getNodeParameter('index', index);
                                tasks.unshift(tasksIndex);
                            }
                            else {
                                tasks.unshift(type);
                            }
                        }
                        const path = `${resource}/${containerType}/${containerId}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'PUT', path, Object.assign({ tasks }, options)));
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        responseData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            return responseData;
        });
    }
    /**
     * Execute the team operations
     * @param resource Resource to be executed (Team)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     * @returns Team information
     */
    static executeTeamOperations(resource, operation, items) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseData = [];
            for (const key of Object.keys(items)) {
                const index = Number(key);
                try {
                    if (operation === 'getAll') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Get all teams                               */
                        /* -------------------------------------------------------------------------- */
                        const returnAll = this.getNodeParameter('returnAll', 0, false);
                        let teams = yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', resource);
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', 0);
                            teams = teams.slice(0, limit);
                        }
                        responseData.push(...teams);
                    }
                    else if (operation === 'get') {
                        /* -------------------------------------------------------------------------- */
                        /*                              Get a single team                             */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const path = `${resource}/${id}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path));
                    }
                    else if (operation === 'create') {
                        /* -------------------------------------------------------------------------- */
                        /*                              Create a new team                             */
                        /* -------------------------------------------------------------------------- */
                        const teamData = Onfleet.getTeamFields.call(this, index, operation);
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', resource, teamData));
                    }
                    else if (operation === 'update') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Update a team                               */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const teamData = Onfleet.getTeamFields.call(this, index, operation);
                        const path = `${resource}/${id}`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'PUT', path, teamData));
                    }
                    else if (operation === 'delete') {
                        /* -------------------------------------------------------------------------- */
                        /*                                Delete a team                               */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const path = `${resource}/${id}`;
                        yield GenericFunctions_1.onfleetApiRequest.call(this, 'DELETE', path);
                        responseData.push({ success: true });
                    }
                    else if (operation === 'getTimeEstimates') {
                        /* -------------------------------------------------------------------------- */
                        /*      Get driver time estimates for tasks that haven't been created yet     */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const workerTimeEstimates = Onfleet.getTeamFields.call(this, index, operation);
                        const path = `${resource}/${id}/estimate`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'GET', path, {}, workerTimeEstimates));
                    }
                    else if (operation === 'autoDispatch') {
                        /* -------------------------------------------------------------------------- */
                        /*                  Dynamically dispatching tasks on the fly                  */
                        /* -------------------------------------------------------------------------- */
                        const id = this.getNodeParameter('id', index);
                        const teamAutoDispatch = Onfleet.getTeamFields.call(this, index, operation);
                        const path = `${resource}/${id}/dispatch`;
                        responseData.push(yield GenericFunctions_1.onfleetApiRequest.call(this, 'POST', path, teamAutoDispatch));
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        responseData.push({ error: error.toString() });
                        continue;
                    }
                    throw error;
                }
            }
            return responseData;
        });
    }
}
exports.Onfleet = Onfleet;
