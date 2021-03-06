"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeaTableApi = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// Get options for timezones
const timezones = moment_timezone_1.default.tz.countries().reduce((timezones, country) => {
    const zonesForCountry = moment_timezone_1.default.tz.zonesForCountry(country).map(zone => ({ value: zone, name: zone }));
    return timezones.concat(zonesForCountry);
}, []);
class SeaTableApi {
    constructor() {
        this.name = 'seaTableApi';
        this.displayName = 'SeaTable API';
        this.documentationUrl = 'seaTable';
        this.properties = [
            {
                displayName: 'Environment',
                name: 'environment',
                type: 'options',
                default: 'cloudHosted',
                options: [
                    {
                        name: 'Cloud-Hosted',
                        value: 'cloudHosted',
                    },
                    {
                        name: 'Self-Hosted',
                        value: 'selfHosted',
                    },
                ],
            },
            {
                displayName: 'Self-Hosted Domain',
                name: 'domain',
                type: 'string',
                default: '',
                placeholder: 'https://www.mydomain.com',
                displayOptions: {
                    show: {
                        environment: [
                            'selfHosted',
                        ],
                    },
                },
            },
            {
                displayName: 'API Token (of a Base)',
                name: 'token',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Timezone',
                name: 'timezone',
                type: 'options',
                default: '',
                description: 'Seatable server\'s timezone',
                options: [
                    ...timezones,
                ],
            },
        ];
    }
}
exports.SeaTableApi = SeaTableApi;
