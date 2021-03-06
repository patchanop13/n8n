"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionDescription = void 0;
const customer = __importStar(require("./customer"));
const ticket = __importStar(require("./ticket"));
const contact = __importStar(require("./contact"));
const rmm = __importStar(require("./rmm"));
exports.versionDescription = {
    displayName: 'SyncroMSP',
    name: 'syncroMsp',
    // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
    icon: 'file:syncromsp.png',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Gets data from SyncroMSP',
    defaults: {
        name: 'SyncroMSP',
        color: '#08a4ab',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
        {
            name: 'syncroMspApi',
            required: true,
            testedBy: 'syncroMspApiCredentialTest',
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
                    name: 'Contact',
                    value: 'contact',
                },
                {
                    name: 'Customer',
                    value: 'customer',
                },
                {
                    name: 'RMM',
                    value: 'rmm',
                },
                {
                    name: 'Ticket',
                    value: 'ticket',
                },
            ],
            default: 'contact',
        },
        ...customer.descriptions,
        ...ticket.descriptions,
        ...contact.descriptions,
        ...rmm.descriptions,
    ],
};
