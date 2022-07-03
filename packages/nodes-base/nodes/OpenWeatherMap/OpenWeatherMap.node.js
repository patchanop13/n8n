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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenWeatherMap = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class OpenWeatherMap {
    constructor() {
        this.description = {
            displayName: 'OpenWeatherMap',
            name: 'openWeatherMap',
            icon: 'fa:sun',
            group: ['input'],
            version: 1,
            description: 'Gets current and future weather information',
            defaults: {
                name: 'OpenWeatherMap',
                color: '#554455',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'openWeatherMapApi',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Current Weather',
                            value: 'currentWeather',
                            description: 'Returns the current weather data',
                        },
                        {
                            name: '5 Day Forecast',
                            value: '5DayForecast',
                            description: 'Returns the weather data for the next 5 days',
                        },
                    ],
                    default: 'currentWeather',
                },
                {
                    displayName: 'Format',
                    name: 'format',
                    type: 'options',
                    options: [
                        {
                            name: 'Imperial',
                            value: 'imperial',
                            description: 'Fahrenheit | miles/hour',
                        },
                        {
                            name: 'Metric',
                            value: 'metric',
                            description: 'Celsius | meter/sec',
                        },
                        {
                            name: 'Scientific',
                            value: 'standard',
                            description: 'Kelvin | meter/sec',
                        },
                    ],
                    default: 'metric',
                    description: 'The format in which format the data should be returned',
                },
                // ----------------------------------
                //         Location Information
                // ----------------------------------
                {
                    displayName: 'Location Selection',
                    name: 'locationSelection',
                    type: 'options',
                    options: [
                        {
                            name: 'City Name',
                            value: 'cityName',
                        },
                        {
                            name: 'City ID',
                            value: 'cityId',
                        },
                        {
                            name: 'Coordinates',
                            value: 'coordinates',
                        },
                        {
                            name: 'Zip Code',
                            value: 'zipCode',
                        },
                    ],
                    default: 'cityName',
                    description: 'How to define the location for which to return the weather',
                },
                {
                    displayName: 'City',
                    name: 'cityName',
                    type: 'string',
                    default: '',
                    placeholder: 'berlin,de',
                    required: true,
                    displayOptions: {
                        show: {
                            locationSelection: [
                                'cityName',
                            ],
                        },
                    },
                    description: 'The name of the city to return the weather of',
                },
                {
                    displayName: 'City ID',
                    name: 'cityId',
                    type: 'number',
                    default: 160001123,
                    required: true,
                    displayOptions: {
                        show: {
                            locationSelection: [
                                'cityId',
                            ],
                        },
                    },
                    description: 'The ID of city to return the weather of. List can be downloaded here: http://bulk.openweathermap.org/sample/.',
                },
                {
                    displayName: 'Latitude',
                    name: 'latitude',
                    type: 'string',
                    default: '',
                    placeholder: '13.39',
                    required: true,
                    displayOptions: {
                        show: {
                            locationSelection: [
                                'coordinates',
                            ],
                        },
                    },
                    description: 'The latitude of the location to return the weather of',
                },
                {
                    displayName: 'Longitude',
                    name: 'longitude',
                    type: 'string',
                    default: '',
                    placeholder: '52.52',
                    required: true,
                    displayOptions: {
                        show: {
                            locationSelection: [
                                'coordinates',
                            ],
                        },
                    },
                    description: 'The longitude of the location to return the weather of',
                },
                {
                    displayName: 'Zip Code',
                    name: 'zipCode',
                    type: 'string',
                    default: '',
                    placeholder: '10115,de',
                    required: true,
                    displayOptions: {
                        show: {
                            locationSelection: [
                                'zipCode',
                            ],
                        },
                    },
                    description: 'The ID of city to return the weather of. List can be downloaded here: http://bulk.openweathermap.org/sample/.',
                },
                {
                    displayName: 'Language',
                    name: 'language',
                    type: 'string',
                    default: '',
                    placeholder: 'en',
                    description: 'The two letter language code to get your output in (eg. en, de, ...).',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const credentials = yield this.getCredentials('openWeatherMapApi');
            const operation = this.getNodeParameter('operation', 0);
            let endpoint = '';
            let locationSelection;
            let language;
            let qs;
            for (let i = 0; i < items.length; i++) {
                try {
                    // Set base data
                    qs = {
                        APPID: credentials.accessToken,
                        units: this.getNodeParameter('format', i),
                    };
                    // Get the location
                    locationSelection = this.getNodeParameter('locationSelection', i);
                    if (locationSelection === 'cityName') {
                        qs.q = this.getNodeParameter('cityName', i);
                    }
                    else if (locationSelection === 'cityId') {
                        qs.id = this.getNodeParameter('cityId', i);
                    }
                    else if (locationSelection === 'coordinates') {
                        qs.lat = this.getNodeParameter('latitude', i);
                        qs.lon = this.getNodeParameter('longitude', i);
                    }
                    else if (locationSelection === 'zipCode') {
                        qs.zip = this.getNodeParameter('zipCode', i);
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The locationSelection "${locationSelection}" is not known!`);
                    }
                    // Get the language
                    language = this.getNodeParameter('language', i);
                    if (language) {
                        qs.lang = language;
                    }
                    if (operation === 'currentWeather') {
                        // ----------------------------------
                        //         currentWeather
                        // ----------------------------------
                        endpoint = 'weather';
                    }
                    else if (operation === '5DayForecast') {
                        // ----------------------------------
                        //         5DayForecast
                        // ----------------------------------
                        endpoint = 'forecast';
                    }
                    else {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
                    }
                    const options = {
                        method: 'GET',
                        qs,
                        uri: `https://api.openweathermap.org/data/2.5/${endpoint}`,
                        json: true,
                    };
                    let responseData;
                    try {
                        responseData = yield this.helpers.request(options);
                    }
                    catch (error) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                    }
                    returnData.push(responseData);
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({ json: { error: error.message } });
                        continue;
                    }
                    throw error;
                }
            }
            return [this.helpers.returnJsonArray(returnData)];
        });
    }
}
exports.OpenWeatherMap = OpenWeatherMap;
