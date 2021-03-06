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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nasa = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
const moment_1 = __importDefault(require("moment"));
class Nasa {
    constructor() {
        this.description = {
            displayName: 'NASA',
            name: 'nasa',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:nasa.png',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
            description: 'Retrieve data from the NASA API',
            defaults: {
                name: 'NASA',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'nasaApi',
                    required: true,
                },
            ],
            properties: [
                // ----------------------------------
                //            resources
                // ----------------------------------
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Asteroid Neo-Browse',
                            value: 'asteroidNeoBrowse',
                        },
                        {
                            name: 'Asteroid Neo-Feed',
                            value: 'asteroidNeoFeed',
                        },
                        {
                            name: 'Asteroid Neo-Lookup',
                            value: 'asteroidNeoLookup',
                        },
                        {
                            name: 'Astronomy Picture of the Day',
                            value: 'astronomyPictureOfTheDay',
                        },
                        {
                            name: 'DONKI Coronal Mass Ejection',
                            value: 'donkiCoronalMassEjection',
                        },
                        {
                            name: 'DONKI High Speed Stream',
                            value: 'donkiHighSpeedStream',
                        },
                        // {
                        // 	name: 'DONKI Geomagnetic Storm',
                        // 	value: 'donkiGeomagneticStorm',
                        // },
                        {
                            name: 'DONKI Interplanetary Shock',
                            value: 'donkiInterplanetaryShock',
                        },
                        {
                            name: 'DONKI Magnetopause Crossing',
                            value: 'donkiMagnetopauseCrossing',
                        },
                        {
                            name: 'DONKI Notification',
                            value: 'donkiNotifications',
                        },
                        {
                            name: 'DONKI Radiation Belt Enhancement',
                            value: 'donkiRadiationBeltEnhancement',
                        },
                        {
                            name: 'DONKI Solar Energetic Particle',
                            value: 'donkiSolarEnergeticParticle',
                        },
                        {
                            name: 'DONKI Solar Flare',
                            value: 'donkiSolarFlare',
                        },
                        {
                            name: 'DONKI WSA+EnlilSimulation',
                            value: 'donkiWsaEnlilSimulation',
                        },
                        {
                            name: 'Earth Asset',
                            value: 'earthAssets',
                        },
                        {
                            name: 'Earth Imagery',
                            value: 'earthImagery',
                        },
                    ],
                    default: 'astronomyPictureOfTheDay',
                },
                // ----------------------------------
                //            operations
                // ----------------------------------
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'astronomyPictureOfTheDay',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Get the Astronomy Picture of the Day',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'asteroidNeoFeed',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve a list of asteroids based on their closest approach date to Earth',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'asteroidNeoLookup',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Look up an asteroid based on its NASA SPK-ID',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'asteroidNeoBrowse',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Browse the overall asteroid dataset',
                        },
                    ],
                    default: 'getAll',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'donkiCoronalMassEjection',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve DONKI coronal mass ejection data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'donkiGeomagneticStorm',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve DONKI geomagnetic storm data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'donkiInterplanetaryShock',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve DONKI interplanetary shock data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'donkiSolarFlare',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve DONKI solar flare data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'donkiSolarEnergeticParticle',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve DONKI solar energetic particle data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'donkiMagnetopauseCrossing',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve data on DONKI magnetopause crossings',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'donkiRadiationBeltEnhancement',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve DONKI radiation belt enhancement data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'donkiHighSpeedStream',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve DONKI high speed stream data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'donkiWsaEnlilSimulation',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve DONKI WSA+EnlilSimulation data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'donkiNotifications',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve DONKI notifications data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'earthImagery',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve Earth imagery',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'earthAssets',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve Earth assets',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'inSightMarsWeatherService',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve Insight Mars Weather Service data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'imageAndVideoLibrary',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve Image and Video Library data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'techTransfer',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve TechTransfer data',
                        },
                    ],
                    default: 'get',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'twoLineElementSet',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Get',
                            value: 'get',
                            description: 'Retrieve Two-Line Element Set data',
                        },
                    ],
                    default: 'get',
                },
                // ----------------------------------
                //            fields
                // ----------------------------------
                /* asteroidId and additionalFields (includeCloseApproachData) for asteroidNeoLookup */
                {
                    displayName: 'Asteroid ID',
                    name: 'asteroidId',
                    type: 'string',
                    required: true,
                    default: '',
                    placeholder: '3542519',
                    description: 'The ID of the asteroid to be returned',
                    displayOptions: {
                        show: {
                            resource: [
                                'asteroidNeoLookup',
                            ],
                            operation: [
                                'get',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'asteroidNeoLookup',
                            ],
                            operation: [
                                'get',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Include Close Approach Data',
                            name: 'includeCloseApproachData',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to include all the close approach data in the asteroid lookup',
                        },
                    ],
                },
                {
                    displayName: 'Download Image',
                    name: 'download',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            resource: [
                                'astronomyPictureOfTheDay',
                            ],
                        },
                    },
                    default: true,
                    // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                    description: 'By default just the URL of the image is returned. When set to true the image will be downloaded.',
                },
                {
                    displayName: 'Binary Property',
                    name: 'binaryPropertyName',
                    type: 'string',
                    required: true,
                    default: 'data',
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                            ],
                            resource: [
                                'astronomyPictureOfTheDay',
                            ],
                            download: [
                                true,
                            ],
                        },
                    },
                    description: 'Name of the binary property to which to write to',
                },
                /* date for astronomyPictureOfTheDay */
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    default: {},
                    placeholder: 'Add field',
                    displayOptions: {
                        show: {
                            resource: [
                                'astronomyPictureOfTheDay',
                            ],
                            operation: [
                                'get',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Date',
                            name: 'date',
                            type: 'dateTime',
                            default: '',
                            placeholder: 'YYYY-MM-DD',
                        },
                    ],
                },
                /* startDate and endDate for various resources */
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    default: {},
                    placeholder: 'Add field',
                    displayOptions: {
                        show: {
                            resource: [
                                'asteroidNeoFeed',
                                'donkiCoronalMassEjection',
                                'donkiGeomagneticStorm',
                                'donkiSolarFlare',
                                'donkiSolarEnergeticParticle',
                                'donkiMagnetopauseCrossing',
                                'donkiRadiationBeltEnhancement',
                                'donkiHighSpeedStream',
                                'donkiWsaEnlilSimulation',
                                'donkiNotifications',
                            ],
                            operation: [
                                'get',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Start Date',
                            name: 'startDate',
                            type: 'dateTime',
                            default: '',
                            placeholder: 'YYYY-MM-DD',
                        },
                        {
                            displayName: 'End Date',
                            name: 'endDate',
                            type: 'dateTime',
                            default: '',
                            placeholder: 'YYYY-MM-DD',
                        },
                    ],
                },
                /* startDate, endDate, location and catalog for donkiInterplanetaryShock */
                // Note: If I move startDate and endDate to the Additional Fields above,
                // then this resource gets _two_ Additional Fields with two fields each,
                // instead of _one_ Additional Fields with four fields. So I cannot avoid
                // duplication without cluttering up the UI. Ideas?
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    default: {},
                    placeholder: 'Add field',
                    displayOptions: {
                        show: {
                            resource: [
                                'donkiInterplanetaryShock',
                            ],
                            operation: [
                                'get',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Start Date',
                            name: 'startDate',
                            type: 'dateTime',
                            default: '',
                            placeholder: 'YYYY-MM-DD',
                        },
                        {
                            displayName: 'End Date',
                            name: 'endDate',
                            type: 'dateTime',
                            default: '',
                            placeholder: 'YYYY-MM-DD',
                        },
                        {
                            displayName: 'Location',
                            name: 'location',
                            type: 'options',
                            default: 'ALL',
                            description: 'The location of the geomagnetic storm',
                            options: [
                                {
                                    name: 'All',
                                    value: 'ALL',
                                },
                                {
                                    name: 'Earth',
                                    value: 'earth',
                                },
                                {
                                    name: 'Messenger',
                                    value: 'MESSENGER',
                                },
                                {
                                    name: 'Stereo A',
                                    value: 'STEREO A',
                                },
                                {
                                    name: 'Stereo B',
                                    value: 'STEREO B',
                                },
                            ],
                        },
                        {
                            displayName: 'Catalog',
                            name: 'catalog',
                            type: 'options',
                            default: 'ALL',
                            description: 'The catalog of the geomagnetic storm',
                            options: [
                                {
                                    name: 'All',
                                    value: 'ALL',
                                },
                                {
                                    name: 'SWRC Catalog',
                                    value: 'SWRC_CATALOG',
                                },
                                {
                                    name: 'Winslow Messenger ICME Catalog',
                                    value: 'WINSLOW_MESSENGER_ICME_CATALOG',
                                },
                            ],
                        },
                    ],
                },
                /* latitude, longitude and additionaFields (date, degrees) for earthImagery and earthAssets*/
                {
                    displayName: 'Latitude',
                    name: 'lat',
                    type: 'number',
                    default: '',
                    placeholder: '47.751076',
                    description: 'Latitude for the location of the image',
                    displayOptions: {
                        show: {
                            resource: [
                                'earthImagery',
                                'earthAssets',
                            ],
                            operation: [
                                'get',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Longitude',
                    name: 'lon',
                    type: 'number',
                    default: '',
                    placeholder: '-120.740135',
                    description: 'Longitude for the location of the image',
                    displayOptions: {
                        show: {
                            resource: [
                                'earthImagery',
                                'earthAssets',
                            ],
                            operation: [
                                'get',
                            ],
                        },
                    },
                },
                {
                    displayName: 'Binary Property',
                    name: 'binaryPropertyName',
                    type: 'string',
                    required: true,
                    default: 'data',
                    displayOptions: {
                        show: {
                            operation: [
                                'get',
                            ],
                            resource: [
                                'earthImagery',
                            ],
                        },
                    },
                    description: 'Name of the binary property to which to write to',
                },
                //aqui
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    default: {},
                    placeholder: 'Add field',
                    displayOptions: {
                        show: {
                            resource: [
                                'earthImagery',
                                'earthAssets',
                            ],
                            operation: [
                                'get',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Date',
                            name: 'date',
                            type: 'dateTime',
                            default: '',
                            placeholder: 'YYYY-MM-DD',
                            description: 'Date of the image',
                        },
                        {
                            displayName: 'Degrees',
                            name: 'dim',
                            type: 'number',
                            default: '',
                            placeholder: '0.025',
                            description: 'Width and height of the image in degrees',
                        },
                    ],
                },
                {
                    displayName: 'Return All',
                    name: 'returnAll',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether to return all results or only up to a given limit',
                },
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                    },
                    description: 'Max number of results to return',
                    default: 20,
                    displayOptions: {
                        show: {
                            operation: [
                                'getAll',
                            ],
                            returnAll: [
                                false,
                            ],
                        },
                    },
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            let responseData;
            const qs = {};
            let returnAll = false;
            let propertyName = '';
            let download = false;
            for (let i = 0; i < items.length; i++) {
                try {
                    let endpoint = '';
                    let includeCloseApproachData = false;
                    // additionalFields are brought up here to prevent repetition on most endpoints.
                    // The few endpoints like asteroidNeoBrowse that do not have additionalFields
                    // trigger an error in getNodeParameter dealt with in the catch block.
                    let additionalFields;
                    try {
                        additionalFields = this.getNodeParameter('additionalFields', i);
                    }
                    catch (error) {
                        additionalFields = {};
                    }
                    if (resource === 'astronomyPictureOfTheDay') {
                        if (operation === 'get') {
                            endpoint = '/planetary/apod';
                            qs.date = (0, moment_1.default)(additionalFields.date).format('YYYY-MM-DD') || (0, moment_1.default)().format('YYYY-MM-DD');
                        }
                    }
                    if (resource === 'asteroidNeoFeed') {
                        if (operation === 'get') {
                            endpoint = '/neo/rest/v1/feed';
                            propertyName = 'near_earth_objects';
                            // The range defaults to the current date to reduce the number of results.
                            const currentDate = (0, moment_1.default)().format('YYYY-MM-DD');
                            qs.start_date = (0, moment_1.default)(additionalFields.startDate).format('YYYY-MM-DD') || currentDate;
                            qs.end_date = (0, moment_1.default)(additionalFields.endDate).format('YYYY-MM-DD') || currentDate;
                        }
                    }
                    if (resource === 'asteroidNeoLookup') {
                        if (operation === 'get') {
                            const asteroidId = this.getNodeParameter('asteroidId', i);
                            includeCloseApproachData = additionalFields.includeCloseApproachData;
                            endpoint = `/neo/rest/v1/neo/${asteroidId}`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation '${operation}' is unknown!`);
                        }
                    }
                    if (resource === 'asteroidNeoBrowse') {
                        if (operation === 'getAll') {
                            returnAll = this.getNodeParameter('returnAll', 0);
                            if (returnAll === false) {
                                qs.size = this.getNodeParameter('limit', 0);
                            }
                            propertyName = 'near_earth_objects';
                            endpoint = `/neo/rest/v1/neo/browse`;
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation '${operation}' is unknown!`);
                        }
                    }
                    if (resource.startsWith('donki')) {
                        if (additionalFields.startDate) {
                            qs.startDate = (0, moment_1.default)(additionalFields.startDate).format('YYYY-MM-DD');
                        }
                        else {
                            qs.startDate = (0, moment_1.default)().subtract(30, 'days').format('YYYY-MM-DD');
                        }
                        if (additionalFields.endDate) {
                            qs.endDate = (0, moment_1.default)(additionalFields.endDate).format('YYYY-MM-DD');
                        }
                        else {
                            qs.endDate = (0, moment_1.default)().format('YYYY-MM-DD');
                        }
                        if (resource === 'donkiCoronalMassEjection') {
                            if (operation === 'get') {
                                endpoint = '/DONKI/CME';
                            }
                        }
                        else if (resource === 'donkiGeomagneticStorm') {
                            if (operation === 'get') {
                                endpoint = '/DONKI/GST';
                            }
                        }
                        else if (resource === 'donkiInterplanetaryShock') {
                            if (operation === 'get') {
                                endpoint = '/DONKI/IPS';
                                qs.location = additionalFields.location || 'ALL'; // default per API
                                qs.catalog = additionalFields.catalog || 'ALL'; // default per API
                            }
                        }
                        else if (resource === 'donkiSolarFlare') {
                            if (operation === 'get') {
                                endpoint = '/DONKI/FLR';
                            }
                        }
                        else if (resource === 'donkiSolarEnergeticParticle') {
                            if (operation === 'get') {
                                endpoint = '/DONKI/SEP';
                            }
                        }
                        else if (resource === 'donkiMagnetopauseCrossing') {
                            if (operation === 'get') {
                                endpoint = '/DONKI/MPC';
                            }
                        }
                        else if (resource === 'donkiRadiationBeltEnhancement') {
                            if (operation === 'get') {
                                endpoint = '/DONKI/RBE';
                            }
                        }
                        else if (resource === 'donkiHighSpeedStream') {
                            if (operation === 'get') {
                                endpoint = '/DONKI/HSS';
                            }
                        }
                        else if (resource === 'donkiWsaEnlilSimulation') {
                            if (operation === 'get') {
                                endpoint = '/DONKI/WSAEnlilSimulations';
                            }
                        }
                        else if (resource === 'donkiNotifications') {
                            if (operation === 'get') {
                                endpoint = '/DONKI/notifications';
                                qs.type = additionalFields.type || 'all'; // default per API
                            }
                        }
                    }
                    if (resource === 'earthImagery') {
                        if (operation === 'get') {
                            endpoint = '/planetary/earth/imagery';
                            qs.lat = this.getNodeParameter('lat', i);
                            qs.lon = this.getNodeParameter('lon', i);
                            qs.dim = additionalFields.dim || 0.025; // default per API
                            if (additionalFields.date) {
                                qs.date = (0, moment_1.default)(additionalFields.date).format('YYYY-MM-DD');
                            }
                            else {
                                qs.date = (0, moment_1.default)().format('YYYY-MM-DD');
                            }
                        }
                    }
                    if (resource === 'earthAssets') {
                        if (operation === 'get') {
                            endpoint = '/planetary/earth/assets';
                            qs.lat = this.getNodeParameter('lat', i);
                            qs.lon = this.getNodeParameter('lon', i);
                            qs.dim = additionalFields.dim || 0.025; // default per API
                            if (additionalFields.date) {
                                qs.date = (0, moment_1.default)(additionalFields.date).format('YYYY-MM-DD');
                            }
                        }
                        if (operation === 'get') {
                            endpoint = '/insight_weather/earth/imagery';
                            // Hardcoded because these are the only options available right now.
                            qs.feedtype = 'json';
                            qs.ver = '1.0';
                        }
                    }
                    if (returnAll) {
                        responseData = GenericFunctions_1.nasaApiRequestAllItems.call(this, propertyName, 'GET', endpoint, qs);
                    }
                    else {
                        responseData = yield GenericFunctions_1.nasaApiRequest.call(this, 'GET', endpoint, qs);
                        if (propertyName !== '') {
                            responseData = responseData[propertyName];
                        }
                    }
                    if (resource === 'asteroidNeoLookup' && operation === 'get' && !includeCloseApproachData) {
                        delete responseData.close_approach_data;
                    }
                    if (resource === 'asteroidNeoFeed') {
                        const date = Object.keys(responseData)[0];
                        responseData = responseData[date];
                    }
                    if (resource === 'earthImagery') {
                        const binaryProperty = this.getNodeParameter('binaryPropertyName', i);
                        const data = yield GenericFunctions_1.nasaApiRequest.call(this, 'GET', endpoint, qs, { encoding: null });
                        const newItem = {
                            json: items[i].json,
                            binary: {},
                        };
                        if (items[i].binary !== undefined) {
                            Object.assign(newItem.binary, items[i].binary);
                        }
                        items[i] = newItem;
                        items[i].binary[binaryProperty] = yield this.helpers.prepareBinaryData(data);
                    }
                    if (resource === 'astronomyPictureOfTheDay') {
                        download = this.getNodeParameter('download', 0);
                        if (download === true) {
                            const binaryProperty = this.getNodeParameter('binaryPropertyName', i);
                            const data = yield GenericFunctions_1.nasaApiRequest.call(this, 'GET', endpoint, qs, { encoding: null }, responseData.hdurl);
                            const filename = responseData.hdurl.split('/');
                            const newItem = {
                                json: items[i].json,
                                binary: {},
                            };
                            Object.assign(newItem.json, responseData);
                            if (items[i].binary !== undefined) {
                                Object.assign(newItem.binary, items[i].binary);
                            }
                            items[i] = newItem;
                            items[i].binary[binaryProperty] = yield this.helpers.prepareBinaryData(data, filename[filename.length - 1]);
                        }
                    }
                    if (Array.isArray(responseData)) {
                        returnData.push.apply(returnData, responseData);
                    }
                    else {
                        returnData.push(responseData);
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        if (resource === 'earthImagery' && operation === 'get') {
                            items[i].json = { error: error.message };
                        }
                        else if (resource === 'astronomyPictureOfTheDay' && operation === 'get' && download === true) {
                            items[i].json = { error: error.message };
                        }
                        else {
                            returnData.push({ error: error.message });
                        }
                        continue;
                    }
                    throw error;
                }
            }
            if (resource === 'earthImagery' && operation === 'get') {
                return this.prepareOutputData(items);
            }
            else if (resource === 'astronomyPictureOfTheDay' && operation === 'get' && download === true) {
                return this.prepareOutputData(items);
            }
            else {
                return [this.helpers.returnJsonArray(returnData)];
            }
        });
    }
}
exports.Nasa = Nasa;
