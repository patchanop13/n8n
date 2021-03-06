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
exports.GoogleSheets = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GoogleSheet_1 = require("./GoogleSheet");
const GenericFunctions_1 = require("./GenericFunctions");
class GoogleSheets {
    constructor() {
        this.description = {
            displayName: 'Google Sheets ',
            name: 'googleSheets',
            icon: 'file:googleSheets.svg',
            group: ['input', 'output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Read, update and write data to Google Sheets',
            defaults: {
                name: 'Google Sheets',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'googleApi',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'serviceAccount',
                            ],
                        },
                    },
                    testedBy: 'googleApiCredentialTest',
                },
                {
                    name: 'googleSheetsOAuth2Api',
                    required: true,
                    displayOptions: {
                        show: {
                            authentication: [
                                'oAuth2',
                            ],
                        },
                    },
                },
            ],
            properties: [
                {
                    displayName: 'Authentication',
                    name: 'authentication',
                    type: 'options',
                    options: [
                        {
                            name: 'Service Account',
                            value: 'serviceAccount',
                        },
                        {
                            name: 'OAuth2',
                            value: 'oAuth2',
                        },
                    ],
                    default: 'serviceAccount',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Spreadsheet',
                            value: 'spreadsheet',
                        },
                        {
                            name: 'Sheet',
                            value: 'sheet',
                        },
                    ],
                    default: 'sheet',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Append',
                            value: 'append',
                            description: 'Append data to a sheet',
                        },
                        {
                            name: 'Clear',
                            value: 'clear',
                            description: 'Clear data from a sheet',
                        },
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a new sheet',
                        },
                        {
                            name: 'Create or Update',
                            value: 'upsert',
                            description: 'Create a new record, or update the current one if it already exists (upsert)',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Delete columns and rows from a sheet',
                        },
                        {
                            name: 'Lookup',
                            value: 'lookup',
                            description: 'Look up a specific column value and return the matching row',
                        },
                        {
                            name: 'Read',
                            value: 'read',
                            description: 'Read data from a sheet',
                        },
                        {
                            name: 'Remove',
                            value: 'remove',
                            description: 'Remove a sheet',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Update rows in a sheet',
                        },
                    ],
                    default: 'read',
                },
                // ----------------------------------
                //         All
                // ----------------------------------
                {
                    displayName: 'Spreadsheet ID',
                    name: 'sheetId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'The ID of the Google Spreadsheet. Found as part of the sheet URL https://docs.google.com/spreadsheets/d/{ID}/.',
                },
                {
                    displayName: 'Range',
                    name: 'range',
                    type: 'string',
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                        },
                        hide: {
                            operation: [
                                'create',
                                'delete',
                                'remove',
                            ],
                        },
                    },
                    default: 'A:F',
                    required: true,
                    description: 'The table range to read from or to append data to. See the Google <a href="https://developers.google.com/sheets/api/guides/values#writing">documentation</a> for the details. If it contains multiple sheets it can also be added like this: "MySheet!A:F"',
                },
                // ----------------------------------
                //         Delete
                // ----------------------------------
                {
                    displayName: 'To Delete',
                    name: 'toDelete',
                    placeholder: 'Add Columns/Rows to delete',
                    description: 'Deletes columns and rows from a sheet',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'delete',
                            ],
                        },
                    },
                    default: {},
                    options: [
                        {
                            displayName: 'Columns',
                            name: 'columns',
                            values: [
                                {
                                    displayName: 'Sheet Name or ID',
                                    name: 'sheetId',
                                    type: 'options',
                                    typeOptions: {
                                        loadOptionsMethod: 'getSheets',
                                    },
                                    options: [],
                                    default: '',
                                    required: true,
                                    description: 'The sheet to delete columns from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                                },
                                {
                                    displayName: 'Start Index',
                                    name: 'startIndex',
                                    type: 'number',
                                    typeOptions: {
                                        minValue: 0,
                                    },
                                    default: 0,
                                    description: 'The start index (0 based and inclusive) of column to delete',
                                },
                                {
                                    displayName: 'Amount',
                                    name: 'amount',
                                    type: 'number',
                                    typeOptions: {
                                        minValue: 1,
                                    },
                                    default: 1,
                                    description: 'Number of columns to delete',
                                },
                            ],
                        },
                        {
                            displayName: 'Rows',
                            name: 'rows',
                            values: [
                                {
                                    displayName: 'Sheet Name or ID',
                                    name: 'sheetId',
                                    type: 'options',
                                    typeOptions: {
                                        loadOptionsMethod: 'getSheets',
                                    },
                                    options: [],
                                    default: '',
                                    required: true,
                                    description: 'The sheet to delete columns from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                                },
                                {
                                    displayName: 'Start Index',
                                    name: 'startIndex',
                                    type: 'number',
                                    typeOptions: {
                                        minValue: 0,
                                    },
                                    default: 0,
                                    description: 'The start index (0 based and inclusive) of row to delete',
                                },
                                {
                                    displayName: 'Amount',
                                    name: 'amount',
                                    type: 'number',
                                    typeOptions: {
                                        minValue: 1,
                                    },
                                    default: 1,
                                    description: 'Number of rows to delete',
                                },
                            ],
                        },
                    ],
                },
                // ----------------------------------
                //         Read
                // ----------------------------------
                {
                    displayName: 'RAW Data',
                    name: 'rawData',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'read',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether the data should be returned RAW instead of parsed into keys according to their header',
                },
                {
                    displayName: 'Data Property',
                    name: 'dataProperty',
                    type: 'string',
                    default: 'data',
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'read',
                            ],
                            rawData: [
                                true,
                            ],
                        },
                    },
                    description: 'The name of the property into which to write the RAW data',
                },
                // ----------------------------------
                //         Update
                // ----------------------------------
                {
                    displayName: 'RAW Data',
                    name: 'rawData',
                    type: 'boolean',
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'update',
                                'upsert',
                            ],
                        },
                    },
                    default: false,
                    description: 'Whether the data supplied is RAW instead of parsed into keys',
                },
                {
                    displayName: 'Data Property',
                    name: 'dataProperty',
                    type: 'string',
                    default: 'data',
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'update',
                                'upsert',
                            ],
                            rawData: [
                                true,
                            ],
                        },
                    },
                    description: 'The name of the property from which to read the RAW data',
                },
                // ----------------------------------
                //         Read & Update & lookupColumn
                // ----------------------------------
                {
                    displayName: 'Data Start Row',
                    name: 'dataStartRow',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                    },
                    default: 1,
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                        },
                        hide: {
                            operation: [
                                'append',
                                'create',
                                'clear',
                                'delete',
                                'remove',
                            ],
                            rawData: [
                                true,
                            ],
                        },
                    },
                    description: 'Index of the first row which contains the actual data and not the keys. Starts with 0.',
                },
                // ----------------------------------
                //         Mixed
                // ----------------------------------
                {
                    displayName: 'Key Row',
                    name: 'keyRow',
                    type: 'number',
                    typeOptions: {
                        minValue: 0,
                    },
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                        },
                        hide: {
                            operation: [
                                'clear',
                                'create',
                                'delete',
                                'remove',
                            ],
                            rawData: [
                                true,
                            ],
                        },
                    },
                    default: 0,
                    description: 'Index of the row which contains the keys. Starts at 0. The incoming node data is matched to the keys for assignment. The matching is case sensitive.',
                },
                // ----------------------------------
                //         lookup
                // ----------------------------------
                {
                    displayName: 'Lookup Column',
                    name: 'lookupColumn',
                    type: 'string',
                    default: '',
                    placeholder: 'Email',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'lookup',
                            ],
                        },
                    },
                    description: 'The name of the column in which to look for value',
                },
                {
                    displayName: 'Lookup Value',
                    name: 'lookupValue',
                    type: 'string',
                    default: '',
                    placeholder: 'frank@example.com',
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'lookup',
                            ],
                        },
                    },
                    description: 'The value to look for in column',
                },
                // ----------------------------------
                //         Update
                // ----------------------------------
                {
                    displayName: 'Key',
                    name: 'key',
                    type: 'string',
                    default: 'id',
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'update',
                                'upsert',
                            ],
                            rawData: [
                                false,
                            ],
                        },
                    },
                    description: 'The name of the key to identify which data should be updated in the sheet',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'append',
                                'lookup',
                                'read',
                                'update',
                                'upsert',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Continue If Empty',
                            name: 'continue',
                            type: 'boolean',
                            default: false,
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'lookup',
                                        'read',
                                    ],
                                },
                            },
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                            description: 'By default, the workflow stops executing if the lookup/read does not return values',
                        },
                        {
                            displayName: 'Return All Matches',
                            name: 'returnAllMatches',
                            type: 'boolean',
                            default: false,
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'lookup',
                                    ],
                                },
                            },
                            // eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
                            description: 'By default only the first result gets returned. If options gets set all found matches get returned.',
                        },
                        {
                            displayName: 'Use Header Names as JSON Paths',
                            name: 'usePathForKeyRow',
                            type: 'boolean',
                            default: false,
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'append',
                                    ],
                                },
                            },
                            description: 'Whether you want to match the headers as path, for example, the row header "category.name" will match the "category" object and get the field "name" from it. By default "category.name" will match with the field with exact name, not nested object.',
                        },
                        {
                            displayName: 'Value Input Mode',
                            name: 'valueInputMode',
                            type: 'options',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'append',
                                        'update',
                                        'upsert',
                                    ],
                                },
                            },
                            options: [
                                {
                                    name: 'RAW',
                                    value: 'RAW',
                                    description: 'The values will not be parsed and will be stored as-is',
                                },
                                {
                                    name: 'User Entered',
                                    value: 'USER_ENTERED',
                                    description: 'The values will be parsed as if the user typed them into the UI. Numbers will stay as numbers, but strings may be converted to numbers, dates, etc. following the same rules that are applied when entering text into a cell via the Google Sheets UI.',
                                },
                            ],
                            default: 'RAW',
                            description: 'Determines how data should be interpreted',
                        },
                        {
                            displayName: 'Value Render Mode',
                            name: 'valueRenderMode',
                            type: 'options',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'lookup',
                                        'read',
                                    ],
                                },
                            },
                            options: [
                                {
                                    name: 'Formatted Value',
                                    value: 'FORMATTED_VALUE',
                                    description: 'Values will be calculated & formatted in the reply according to the cell\'s formatting.Formatting is based on the spreadsheet\'s locale, not the requesting user\'s locale.For example, if A1 is 1.23 and A2 is =A1 and formatted as currency, then A2 would return "$1.23"',
                                },
                                {
                                    name: 'Formula',
                                    value: 'FORMULA',
                                    description: 'Values will not be calculated. The reply will include the formulas. For example, if A1 is 1.23 and A2 is =A1 and formatted as currency, then A2 would return "=A1".',
                                },
                                {
                                    name: 'Unformatted Value',
                                    value: 'UNFORMATTED_VALUE',
                                    description: 'Values will be calculated, but not formatted in the reply. For example, if A1 is 1.23 and A2 is =A1 and formatted as currency, then A2 would return the number 1.23.',
                                },
                            ],
                            default: 'UNFORMATTED_VALUE',
                            description: 'Determines how values should be rendered in the output',
                        },
                        {
                            displayName: 'Value Render Mode',
                            name: 'valueRenderMode',
                            type: 'options',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'update',
                                        'upsert',
                                    ],
                                    '/rawData': [
                                        false,
                                    ],
                                },
                            },
                            options: [
                                {
                                    name: 'Formatted Value',
                                    value: 'FORMATTED_VALUE',
                                    description: 'Values will be calculated & formatted in the reply according to the cell\'s formatting.Formatting is based on the spreadsheet\'s locale, not the requesting user\'s locale. For example, if A1 is 1.23 and A2 is =A1 and formatted as currency, then A2 would return "$1.23".',
                                },
                                {
                                    name: 'Formula',
                                    value: 'FORMULA',
                                    description: 'Values will not be calculated. The reply will include the formulas. For example, if A1 is 1.23 and A2 is =A1 and formatted as currency, then A2 would return "=A1".',
                                },
                                {
                                    name: 'Unformatted Value',
                                    value: 'UNFORMATTED_VALUE',
                                    description: 'Values will be calculated, but not formatted in the reply. For example, if A1 is 1.23 and A2 is =A1 and formatted as currency, then A2 would return the number 1.23.',
                                },
                            ],
                            default: 'UNFORMATTED_VALUE',
                            description: 'Determines how values should be rendered in the output',
                        },
                    ],
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'spreadsheet',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'Create',
                            value: 'create',
                            description: 'Create a spreadsheet',
                        },
                    ],
                    default: 'create',
                },
                // ----------------------------------
                //         spreadsheet:create
                // ----------------------------------
                {
                    displayName: 'Title',
                    name: 'title',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            resource: [
                                'spreadsheet',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    description: 'The title of the spreadsheet',
                },
                {
                    displayName: 'Sheets',
                    name: 'sheetsUi',
                    placeholder: 'Add Sheet',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'spreadsheet',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    options: [
                        {
                            name: 'sheetValues',
                            displayName: 'Sheet',
                            values: [
                                {
                                    displayName: 'Sheet Properties',
                                    name: 'propertiesUi',
                                    placeholder: 'Add Property',
                                    type: 'collection',
                                    default: {},
                                    options: [
                                        {
                                            displayName: 'Hidden',
                                            name: 'hidden',
                                            type: 'boolean',
                                            default: false,
                                            description: 'Whether the Sheet should be hidden in the UI',
                                        },
                                        {
                                            displayName: 'Title',
                                            name: 'title',
                                            type: 'string',
                                            default: '',
                                            description: 'Title of the property to create',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'spreadsheet',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Locale',
                            name: 'locale',
                            type: 'string',
                            default: '',
                            placeholder: 'en_US',
                            description: `The locale of the spreadsheet in one of the following formats:
						<ul>
							<li>en (639-1)</li>
							<li>fil (639-2 if no 639-1 format exists)</li>
							<li>en_US (combination of ISO language an country)</li>
						<ul>`,
                        },
                        {
                            displayName: 'Recalculation Interval',
                            name: 'autoRecalc',
                            type: 'options',
                            options: [
                                {
                                    name: 'Default',
                                    value: '',
                                    description: 'Default value',
                                },
                                {
                                    name: 'On Change',
                                    value: 'ON_CHANGE',
                                    description: 'Volatile functions are updated on every change',
                                },
                                {
                                    name: 'Minute',
                                    value: 'MINUTE',
                                    description: 'Volatile functions are updated on every change and every minute',
                                },
                                {
                                    name: 'Hour',
                                    value: 'HOUR',
                                    description: 'Volatile functions are updated on every change and hourly',
                                },
                            ],
                            default: '',
                            description: 'Cell recalculation interval options',
                        },
                    ],
                },
                // ----------------------------------
                //         sheet:create
                // ----------------------------------
                {
                    displayName: 'Simplify',
                    name: 'simple',
                    type: 'boolean',
                    default: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    description: 'Whether to return a simplified version of the response instead of the raw data',
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'create',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'Grid Properties',
                            name: 'gridProperties',
                            type: 'collection',
                            placeholder: 'Add Property',
                            default: {},
                            options: [
                                {
                                    displayName: 'Column Count',
                                    name: 'columnCount',
                                    type: 'number',
                                    default: 0,
                                    description: 'The number of columns in the grid',
                                },
                                {
                                    displayName: 'Column Group Control After',
                                    name: 'columnGroupControlAfter',
                                    type: 'boolean',
                                    default: false,
                                    description: 'Whether the column grouping control toggle is shown after the group',
                                },
                                {
                                    displayName: 'Frozen Column Count',
                                    name: 'frozenColumnCount',
                                    type: 'number',
                                    default: 0,
                                    description: 'The number of columns that are frozen in the grid',
                                },
                                {
                                    displayName: 'Frozen Row Count',
                                    name: 'frozenRowCount',
                                    type: 'number',
                                    default: 0,
                                    description: 'The number of rows that are frozen in the grid',
                                },
                                {
                                    displayName: 'Hide Gridlines',
                                    name: 'hideGridlines',
                                    type: 'boolean',
                                    default: false,
                                    description: 'Whether the grid isn\'t showing gridlines in the UI',
                                },
                                {
                                    displayName: 'Row Count',
                                    name: 'rowCount',
                                    type: 'number',
                                    default: 0,
                                    description: 'The number of rows in the grid',
                                },
                                {
                                    displayName: 'Row Group Control After',
                                    name: 'rowGroupControlAfter',
                                    type: 'boolean',
                                    default: false,
                                    description: 'Whether the row grouping control toggle is shown after the group',
                                },
                            ],
                            description: 'The type of the sheet',
                        },
                        {
                            displayName: 'Hidden',
                            name: 'hidden',
                            type: 'boolean',
                            default: false,
                            description: 'Whether the sheet is hidden in the UI, false if it\'s visible',
                        },
                        {
                            displayName: 'Right To Left',
                            name: 'rightToLeft',
                            type: 'boolean',
                            default: false,
                            description: 'Whether the sheet is an RTL sheet instead of an LTR sheet',
                        },
                        {
                            displayName: 'Sheet ID',
                            name: 'sheetId',
                            type: 'number',
                            default: 0,
                            description: 'The ID of the sheet. Must be non-negative. This field cannot be changed once set.',
                        },
                        {
                            displayName: 'Sheet Index',
                            name: 'index',
                            type: 'number',
                            default: 0,
                            description: 'The index of the sheet within the spreadsheet',
                        },
                        {
                            displayName: 'Tab Color',
                            name: 'tabColor',
                            type: 'color',
                            default: '0aa55c',
                            description: 'The color of the tab in the UI',
                        },
                        {
                            displayName: 'Title',
                            name: 'title',
                            type: 'string',
                            default: '',
                            description: 'The Sheet name',
                        },
                    ],
                },
                // ----------------------------------
                //         sheet:remove
                // ----------------------------------
                {
                    displayName: 'Sheet ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            resource: [
                                'sheet',
                            ],
                            operation: [
                                'remove',
                            ],
                        },
                    },
                    description: 'The ID of the sheet to delete',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                // Get all the sheets in a Spreadsheet
                getSheets() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const spreadsheetId = this.getCurrentNodeParameter('sheetId');
                        const sheet = new GoogleSheet_1.GoogleSheet(spreadsheetId, this);
                        const responseData = yield sheet.spreadsheetGetSheets();
                        if (responseData === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No data got returned');
                        }
                        const returnData = [];
                        for (const sheet of responseData.sheets) {
                            if (sheet.properties.sheetType !== 'GRID') {
                                continue;
                            }
                            returnData.push({
                                name: sheet.properties.title,
                                value: sheet.properties.sheetId,
                            });
                        }
                        return returnData;
                    });
                },
            },
            credentialTest: {
                googleApiCredentialTest(credential) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const tokenRequest = yield GenericFunctions_1.getAccessToken.call(this, credential.data);
                            if (!tokenRequest.access_token) {
                                return {
                                    status: 'Error',
                                    message: 'Could not generate a token from your private key.',
                                };
                            }
                        }
                        catch (err) {
                            return {
                                status: 'Error',
                                message: `Private key validation failed: ${err.message}`,
                            };
                        }
                        return {
                            status: 'OK',
                            message: 'Connection successful!',
                        };
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const operation = this.getNodeParameter('operation', 0);
            const resource = this.getNodeParameter('resource', 0);
            if (resource === 'sheet') {
                const spreadsheetId = this.getNodeParameter('sheetId', 0);
                const sheet = new GoogleSheet_1.GoogleSheet(spreadsheetId, this);
                let range = '';
                if (!['create', 'delete', 'remove'].includes(operation)) {
                    range = this.getNodeParameter('range', 0);
                }
                const options = this.getNodeParameter('options', 0, {});
                const valueInputMode = (options.valueInputMode || 'RAW');
                const valueRenderMode = (options.valueRenderMode || 'UNFORMATTED_VALUE');
                if (operation === 'append') {
                    // ----------------------------------
                    //         append
                    // ----------------------------------
                    try {
                        const keyRow = parseInt(this.getNodeParameter('keyRow', 0), 10);
                        const items = this.getInputData();
                        const setData = [];
                        items.forEach((item) => {
                            setData.push(item.json);
                        });
                        const usePathForKeyRow = (options.usePathForKeyRow || false);
                        // Convert data into array format
                        const data = yield sheet.appendSheetData(setData, sheet.encodeRange(range), keyRow, valueInputMode, usePathForKeyRow);
                        // TODO: Should add this data somewhere
                        // TODO: Should have something like add metadata which does not get passed through
                        return this.prepareOutputData(items);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            return this.prepareOutputData([{ json: { error: error.message } }]);
                        }
                        throw error;
                    }
                }
                else if (operation === 'clear') {
                    // ----------------------------------
                    //         clear
                    // ----------------------------------
                    try {
                        yield sheet.clearData(sheet.encodeRange(range));
                        const items = this.getInputData();
                        return this.prepareOutputData(items);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            return this.prepareOutputData([{ json: { error: error.message } }]);
                        }
                        throw error;
                    }
                }
                else if (operation === 'create') {
                    const returnData = [];
                    let responseData;
                    for (let i = 0; i < this.getInputData().length; i++) {
                        try {
                            const spreadsheetId = this.getNodeParameter('sheetId', i);
                            const options = this.getNodeParameter('options', i, {});
                            const simple = this.getNodeParameter('simple', 0);
                            const properties = Object.assign({}, options);
                            if (options.tabColor) {
                                const { red, green, blue } = (0, GenericFunctions_1.hexToRgb)(options.tabColor);
                                properties.tabColor = { red: red / 255, green: green / 255, blue: blue / 255 };
                            }
                            const requests = [{
                                    addSheet: {
                                        properties,
                                    },
                                }];
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/v4/spreadsheets/${spreadsheetId}:batchUpdate`, { requests });
                            if (simple === true) {
                                Object.assign(responseData, responseData.replies[0].addSheet.properties);
                                delete responseData.replies;
                            }
                            returnData.push(responseData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                    return [this.helpers.returnJsonArray(returnData)];
                }
                else if (operation === 'delete') {
                    // ----------------------------------
                    //         delete
                    // ----------------------------------
                    try {
                        const requests = [];
                        const toDelete = this.getNodeParameter('toDelete', 0);
                        const deletePropertyToDimensions = {
                            'columns': 'COLUMNS',
                            'rows': 'ROWS',
                        };
                        for (const propertyName of Object.keys(deletePropertyToDimensions)) {
                            if (toDelete[propertyName] !== undefined) {
                                toDelete[propertyName].forEach(range => {
                                    requests.push({
                                        deleteDimension: {
                                            range: {
                                                sheetId: range.sheetId,
                                                dimension: deletePropertyToDimensions[propertyName],
                                                startIndex: range.startIndex,
                                                endIndex: parseInt(range.startIndex.toString(), 10) + parseInt(range.amount.toString(), 10),
                                            },
                                        },
                                    });
                                });
                            }
                        }
                        const data = yield sheet.spreadsheetBatchUpdate(requests);
                        const items = this.getInputData();
                        return this.prepareOutputData(items);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            return this.prepareOutputData([{ json: { error: error.message } }]);
                        }
                        throw error;
                    }
                }
                else if (operation === 'lookup') {
                    // ----------------------------------
                    //         lookup
                    // ----------------------------------
                    try {
                        const sheetData = yield sheet.getData(sheet.encodeRange(range), valueRenderMode);
                        if (sheetData === undefined) {
                            return [];
                        }
                        const dataStartRow = parseInt(this.getNodeParameter('dataStartRow', 0), 10);
                        const keyRow = parseInt(this.getNodeParameter('keyRow', 0), 10);
                        const items = this.getInputData();
                        const lookupValues = [];
                        for (let i = 0; i < items.length; i++) {
                            lookupValues.push({
                                lookupColumn: this.getNodeParameter('lookupColumn', i),
                                lookupValue: this.getNodeParameter('lookupValue', i),
                            });
                        }
                        let returnData = yield sheet.lookupValues(sheetData, keyRow, dataStartRow, lookupValues, options.returnAllMatches);
                        if (returnData.length === 0 && options.continue && options.returnAllMatches) {
                            returnData = [{}];
                        }
                        else if (returnData.length === 1 && Object.keys(returnData[0]).length === 0 && !options.continue && !options.returnAllMatches) {
                            returnData = [];
                        }
                        return [this.helpers.returnJsonArray(returnData)];
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            return [this.helpers.returnJsonArray({ error: error.message })];
                        }
                        throw error;
                    }
                }
                else if (operation === 'read') {
                    // ----------------------------------
                    //         read
                    // ----------------------------------
                    try {
                        const rawData = this.getNodeParameter('rawData', 0);
                        const sheetData = yield sheet.getData(sheet.encodeRange(range), valueRenderMode);
                        let returnData;
                        if (!sheetData) {
                            returnData = [];
                        }
                        else if (rawData === true) {
                            const dataProperty = this.getNodeParameter('dataProperty', 0);
                            returnData = [
                                {
                                    [dataProperty]: sheetData,
                                },
                            ];
                        }
                        else {
                            const dataStartRow = parseInt(this.getNodeParameter('dataStartRow', 0), 10);
                            const keyRow = parseInt(this.getNodeParameter('keyRow', 0), 10);
                            returnData = sheet.structureArrayDataByColumn(sheetData, keyRow, dataStartRow);
                        }
                        if (returnData.length === 0 && options.continue) {
                            returnData = [{}];
                        }
                        return [this.helpers.returnJsonArray(returnData)];
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            return [this.helpers.returnJsonArray({ error: error.message })];
                        }
                        throw error;
                    }
                }
                else if (operation === 'remove') {
                    const returnData = [];
                    let responseData;
                    for (let i = 0; i < this.getInputData().length; i++) {
                        try {
                            const sheetId = this.getNodeParameter('id', i);
                            const spreadsheetId = this.getNodeParameter('sheetId', i);
                            const requests = [{
                                    deleteSheet: {
                                        sheetId,
                                    },
                                }];
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/v4/spreadsheets/${spreadsheetId}:batchUpdate`, { requests });
                            delete responseData.replies;
                            returnData.push(responseData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                    return [this.helpers.returnJsonArray(returnData)];
                }
                else if (operation === 'update' || operation === 'upsert') {
                    // ----------------------------------
                    //         update/upsert
                    // ----------------------------------
                    const upsert = operation === 'upsert' ? true : false;
                    try {
                        const rawData = this.getNodeParameter('rawData', 0);
                        const items = this.getInputData();
                        if (rawData === true) {
                            const dataProperty = this.getNodeParameter('dataProperty', 0);
                            const updateData = [];
                            for (let i = 0; i < items.length; i++) {
                                updateData.push({
                                    range,
                                    values: items[i].json[dataProperty],
                                });
                            }
                            const data = yield sheet.batchUpdate(updateData, valueInputMode);
                        }
                        else {
                            const keyName = this.getNodeParameter('key', 0);
                            const keyRow = parseInt(this.getNodeParameter('keyRow', 0), 10);
                            const dataStartRow = parseInt(this.getNodeParameter('dataStartRow', 0), 10);
                            const setData = [];
                            items.forEach((item) => {
                                setData.push(item.json);
                            });
                            const data = yield sheet.updateSheetData(setData, keyName, range, keyRow, dataStartRow, valueInputMode, valueRenderMode, upsert);
                        }
                        // TODO: Should add this data somewhere
                        // TODO: Should have something like add metadata which does not get passed through
                        return this.prepareOutputData(items);
                    }
                    catch (error) {
                        if (this.continueOnFail()) {
                            return this.prepareOutputData([{ json: { error: error.message } }]);
                        }
                        throw error;
                    }
                }
            }
            if (resource === 'spreadsheet') {
                const returnData = [];
                let responseData;
                if (operation === 'create') {
                    // ----------------------------------
                    //         create
                    // ----------------------------------
                    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/create
                    for (let i = 0; i < this.getInputData().length; i++) {
                        try {
                            const title = this.getNodeParameter('title', i);
                            const sheetsUi = this.getNodeParameter('sheetsUi', i, {});
                            const body = {
                                properties: {
                                    title,
                                    autoRecalc: undefined,
                                    locale: undefined,
                                },
                                sheets: [],
                            };
                            const options = this.getNodeParameter('options', i, {});
                            if (Object.keys(sheetsUi).length) {
                                const data = [];
                                const sheets = sheetsUi.sheetValues;
                                for (const sheet of sheets) {
                                    const properties = sheet.propertiesUi;
                                    if (properties) {
                                        data.push({ properties });
                                    }
                                }
                                body.sheets = data;
                            }
                            body.properties.autoRecalc = options.autoRecalc ? options.autoRecalc : undefined;
                            body.properties.locale = options.locale ? options.locale : undefined;
                            responseData = yield GenericFunctions_1.googleApiRequest.call(this, 'POST', `/v4/spreadsheets`, body);
                            returnData.push(responseData);
                        }
                        catch (error) {
                            if (this.continueOnFail()) {
                                returnData.push({ error: error.message });
                                continue;
                            }
                            throw error;
                        }
                    }
                }
                return [this.helpers.returnJsonArray(returnData)];
            }
            return [];
        });
    }
}
exports.GoogleSheets = GoogleSheets;
