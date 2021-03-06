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
exports.EditImage = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const gm_1 = __importDefault(require("gm"));
const tmp_promise_1 = require("tmp-promise");
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("util");
const fsWriteFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const get_system_fonts_1 = __importDefault(require("get-system-fonts"));
const nodeOperations = [
    {
        name: 'Blur',
        value: 'blur',
        description: 'Adds a blur to the image and so makes it less sharp',
    },
    {
        name: 'Border',
        value: 'border',
        description: 'Adds a border to the image',
    },
    {
        name: 'Composite',
        value: 'composite',
        description: 'Composite image on top of another one',
    },
    {
        name: 'Create',
        value: 'create',
        description: 'Create a new image',
    },
    {
        name: 'Crop',
        value: 'crop',
        description: 'Crops the image',
    },
    {
        name: 'Draw',
        value: 'draw',
        description: 'Draw on image',
    },
    {
        name: 'Rotate',
        value: 'rotate',
        description: 'Rotate image',
    },
    {
        name: 'Resize',
        value: 'resize',
        description: 'Change the size of image',
    },
    {
        name: 'Shear',
        value: 'shear',
        description: 'Shear image along the X or Y axis',
    },
    {
        name: 'Text',
        value: 'text',
        description: 'Adds text to image',
    },
    {
        name: 'Transparent',
        value: 'transparent',
        description: 'Make a color in image transparent',
    },
];
const nodeOperationOptions = [
    // ----------------------------------
    //         create
    // ----------------------------------
    {
        displayName: 'Background Color',
        name: 'backgroundColor',
        type: 'color',
        default: '#ffffff00',
        typeOptions: {
            showAlpha: true,
        },
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
            },
        },
        description: 'The background color of the image to create',
    },
    {
        displayName: 'Image Width',
        name: 'width',
        type: 'number',
        default: 50,
        typeOptions: {
            minValue: 1,
        },
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
            },
        },
        description: 'The width of the image to create',
    },
    {
        displayName: 'Image Height',
        name: 'height',
        type: 'number',
        default: 50,
        typeOptions: {
            minValue: 1,
        },
        displayOptions: {
            show: {
                operation: [
                    'create',
                ],
            },
        },
        description: 'The height of the image to create',
    },
    // ----------------------------------
    //         draw
    // ----------------------------------
    {
        displayName: 'Primitive',
        name: 'primitive',
        type: 'options',
        displayOptions: {
            show: {
                operation: [
                    'draw',
                ],
            },
        },
        options: [
            {
                name: 'Circle',
                value: 'circle',
            },
            {
                name: 'Line',
                value: 'line',
            },
            {
                name: 'Rectangle',
                value: 'rectangle',
            },
        ],
        default: 'rectangle',
        description: 'The primitive to draw',
    },
    {
        displayName: 'Color',
        name: 'color',
        type: 'color',
        default: '#ff000000',
        typeOptions: {
            showAlpha: true,
        },
        displayOptions: {
            show: {
                operation: [
                    'draw',
                ],
            },
        },
        description: 'The color of the primitive to draw',
    },
    {
        displayName: 'Start Position X',
        name: 'startPositionX',
        type: 'number',
        default: 50,
        displayOptions: {
            show: {
                operation: [
                    'draw',
                ],
                primitive: [
                    'circle',
                    'line',
                    'rectangle',
                ],
            },
        },
        description: 'X (horizontal) start position of the primitive',
    },
    {
        displayName: 'Start Position Y',
        name: 'startPositionY',
        type: 'number',
        default: 50,
        displayOptions: {
            show: {
                operation: [
                    'draw',
                ],
                primitive: [
                    'circle',
                    'line',
                    'rectangle',
                ],
            },
        },
        description: 'Y (horizontal) start position of the primitive',
    },
    {
        displayName: 'End Position X',
        name: 'endPositionX',
        type: 'number',
        default: 250,
        displayOptions: {
            show: {
                operation: [
                    'draw',
                ],
                primitive: [
                    'circle',
                    'line',
                    'rectangle',
                ],
            },
        },
        description: 'X (horizontal) end position of the primitive',
    },
    {
        displayName: 'End Position Y',
        name: 'endPositionY',
        type: 'number',
        default: 250,
        displayOptions: {
            show: {
                operation: [
                    'draw',
                ],
                primitive: [
                    'circle',
                    'line',
                    'rectangle',
                ],
            },
        },
        description: 'Y (horizontal) end position of the primitive',
    },
    {
        displayName: 'Corner Radius',
        name: 'cornerRadius',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                operation: [
                    'draw',
                ],
                primitive: [
                    'rectangle',
                ],
            },
        },
        description: 'The radius of the corner to create round corners',
    },
    // ----------------------------------
    //         text
    // ----------------------------------
    {
        displayName: 'Text',
        name: 'text',
        typeOptions: {
            rows: 5,
        },
        type: 'string',
        default: '',
        placeholder: 'Text to render',
        displayOptions: {
            show: {
                operation: [
                    'text',
                ],
            },
        },
        description: 'Text to write on the image',
    },
    {
        displayName: 'Font Size',
        name: 'fontSize',
        type: 'number',
        default: 18,
        displayOptions: {
            show: {
                operation: [
                    'text',
                ],
            },
        },
        description: 'Size of the text',
    },
    {
        displayName: 'Font Color',
        name: 'fontColor',
        type: 'color',
        default: '#000000',
        displayOptions: {
            show: {
                operation: [
                    'text',
                ],
            },
        },
        description: 'Color of the text',
    },
    {
        displayName: 'Position X',
        name: 'positionX',
        type: 'number',
        default: 50,
        displayOptions: {
            show: {
                operation: [
                    'text',
                ],
            },
        },
        description: 'X (horizontal) position of the text',
    },
    {
        displayName: 'Position Y',
        name: 'positionY',
        type: 'number',
        default: 50,
        displayOptions: {
            show: {
                operation: [
                    'text',
                ],
            },
        },
        description: 'Y (vertical) position of the text',
    },
    {
        displayName: 'Max Line Length',
        name: 'lineLength',
        type: 'number',
        typeOptions: {
            minValue: 1,
        },
        default: 80,
        displayOptions: {
            show: {
                operation: [
                    'text',
                ],
            },
        },
        description: 'Max amount of characters in a line before a line-break should get added',
    },
    // ----------------------------------
    //         blur
    // ----------------------------------
    {
        displayName: 'Blur',
        name: 'blur',
        type: 'number',
        typeOptions: {
            minValue: 0,
            maxValue: 1000,
        },
        default: 5,
        displayOptions: {
            show: {
                operation: [
                    'blur',
                ],
            },
        },
        description: 'How strong the blur should be',
    },
    {
        displayName: 'Sigma',
        name: 'sigma',
        type: 'number',
        typeOptions: {
            minValue: 0,
            maxValue: 1000,
        },
        default: 2,
        displayOptions: {
            show: {
                operation: [
                    'blur',
                ],
            },
        },
        description: 'The sigma of the blur',
    },
    // ----------------------------------
    //         border
    // ----------------------------------
    {
        displayName: 'Border Width',
        name: 'borderWidth',
        type: 'number',
        default: 10,
        displayOptions: {
            show: {
                operation: [
                    'border',
                ],
            },
        },
        description: 'The width of the border',
    },
    {
        displayName: 'Border Height',
        name: 'borderHeight',
        type: 'number',
        default: 10,
        displayOptions: {
            show: {
                operation: [
                    'border',
                ],
            },
        },
        description: 'The height of the border',
    },
    {
        displayName: 'Border Color',
        name: 'borderColor',
        type: 'color',
        default: '#000000',
        displayOptions: {
            show: {
                operation: [
                    'border',
                ],
            },
        },
        description: 'Color of the border',
    },
    // ----------------------------------
    //         composite
    // ----------------------------------
    {
        displayName: 'Composite Image Property',
        name: 'dataPropertyNameComposite',
        type: 'string',
        default: '',
        placeholder: 'data2',
        displayOptions: {
            show: {
                operation: [
                    'composite',
                ],
            },
        },
        description: 'The name of the binary property which contains the data of the image to composite on top of image which is found in Property Name',
    },
    {
        displayName: 'Operator',
        name: 'operator',
        type: 'options',
        displayOptions: {
            show: {
                operation: [
                    'composite',
                ],
            },
        },
        options: [
            {
                name: 'Add',
                value: 'Add',
            },
            {
                name: 'Atop',
                value: 'Atop',
            },
            {
                name: 'Bumpmap',
                value: 'Bumpmap',
            },
            {
                name: 'Copy',
                value: 'Copy',
            },
            {
                name: 'Copy Black',
                value: 'CopyBlack',
            },
            {
                name: 'Copy Blue',
                value: 'CopyBlue',
            },
            {
                name: 'Copy Cyan',
                value: 'CopyCyan',
            },
            {
                name: 'Copy Green',
                value: 'CopyGreen',
            },
            {
                name: 'Copy Magenta',
                value: 'CopyMagenta',
            },
            {
                name: 'Copy Opacity',
                value: 'CopyOpacity',
            },
            {
                name: 'Copy Red',
                value: 'CopyRed',
            },
            {
                name: 'Copy Yellow',
                value: 'CopyYellow',
            },
            {
                name: 'Difference',
                value: 'Difference',
            },
            {
                name: 'Divide',
                value: 'Divide',
            },
            {
                name: 'In',
                value: 'In',
            },
            {
                name: 'Minus',
                value: 'Minus',
            },
            {
                name: 'Multiply',
                value: 'Multiply',
            },
            {
                name: 'Out',
                value: 'Out',
            },
            {
                name: 'Over',
                value: 'Over',
            },
            {
                name: 'Plus',
                value: 'Plus',
            },
            {
                name: 'Subtract',
                value: 'Subtract',
            },
            {
                name: 'Xor',
                value: 'Xor',
            },
        ],
        default: 'Over',
        description: 'The operator to use to combine the images',
    },
    {
        displayName: 'Position X',
        name: 'positionX',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                operation: [
                    'composite',
                ],
            },
        },
        description: 'X (horizontal) position of composite image',
    },
    {
        displayName: 'Position Y',
        name: 'positionY',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                operation: [
                    'composite',
                ],
            },
        },
        description: 'Y (vertical) position of composite image',
    },
    // ----------------------------------
    //         crop
    // ----------------------------------
    {
        displayName: 'Width',
        name: 'width',
        type: 'number',
        default: 500,
        displayOptions: {
            show: {
                operation: [
                    'crop',
                ],
            },
        },
        description: 'Crop width',
    },
    {
        displayName: 'Height',
        name: 'height',
        type: 'number',
        default: 500,
        displayOptions: {
            show: {
                operation: [
                    'crop',
                ],
            },
        },
        description: 'Crop height',
    },
    {
        displayName: 'Position X',
        name: 'positionX',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                operation: [
                    'crop',
                ],
            },
        },
        description: 'X (horizontal) position to crop from',
    },
    {
        displayName: 'Position Y',
        name: 'positionY',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                operation: [
                    'crop',
                ],
            },
        },
        description: 'Y (vertical) position to crop from',
    },
    // ----------------------------------
    //         resize
    // ----------------------------------
    {
        displayName: 'Width',
        name: 'width',
        type: 'number',
        default: 500,
        displayOptions: {
            show: {
                operation: [
                    'resize',
                ],
            },
        },
        description: 'New width of the image',
    },
    {
        displayName: 'Height',
        name: 'height',
        type: 'number',
        default: 500,
        displayOptions: {
            show: {
                operation: [
                    'resize',
                ],
            },
        },
        description: 'New height of the image',
    },
    {
        displayName: 'Option',
        name: 'resizeOption',
        type: 'options',
        options: [
            {
                name: 'Ignore Aspect Ratio',
                value: 'ignoreAspectRatio',
                description: 'Ignore aspect ratio and resize exactly to specified values',
            },
            {
                name: 'Maximum Area',
                value: 'maximumArea',
                description: 'Specified values are maximum area',
            },
            {
                name: 'Minimum Area',
                value: 'minimumArea',
                description: 'Specified values are minimum area',
            },
            {
                name: 'Only if Larger',
                value: 'onlyIfLarger',
                description: 'Resize only if image is larger than width or height',
            },
            {
                name: 'Only if Smaller',
                value: 'onlyIfSmaller',
                description: 'Resize only if image is smaller than width or height',
            },
            {
                name: 'Percent',
                value: 'percent',
                description: 'Width and height are specified in percents',
            },
        ],
        default: 'maximumArea',
        displayOptions: {
            show: {
                operation: [
                    'resize',
                ],
            },
        },
        description: 'How to resize the image',
    },
    // ----------------------------------
    //         rotate
    // ----------------------------------
    {
        displayName: 'Rotate',
        name: 'rotate',
        type: 'number',
        typeOptions: {
            minValue: -360,
            maxValue: 360,
        },
        default: 0,
        displayOptions: {
            show: {
                operation: [
                    'rotate',
                ],
            },
        },
        description: 'How much the image should be rotated',
    },
    {
        displayName: 'Background Color',
        name: 'backgroundColor',
        type: 'color',
        default: '#ffffffff',
        typeOptions: {
            showAlpha: true,
        },
        displayOptions: {
            show: {
                operation: [
                    'rotate',
                ],
            },
        },
        description: 'The color to use for the background when image gets rotated by anything which is not a multiple of 90',
    },
    // ----------------------------------
    //         shear
    // ----------------------------------
    {
        displayName: 'Degrees X',
        name: 'degreesX',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                operation: [
                    'shear',
                ],
            },
        },
        description: 'X (horizontal) shear degrees',
    },
    {
        displayName: 'Degrees Y',
        name: 'degreesY',
        type: 'number',
        default: 0,
        displayOptions: {
            show: {
                operation: [
                    'shear',
                ],
            },
        },
        description: 'Y (vertical) shear degrees',
    },
    // ----------------------------------
    //         transparent
    // ----------------------------------
    {
        displayName: 'Color',
        name: 'color',
        type: 'color',
        default: '#ff0000',
        displayOptions: {
            show: {
                operation: [
                    'transparent',
                ],
            },
        },
        description: 'The color to make transparent',
    },
];
class EditImage {
    constructor() {
        this.description = {
            displayName: 'Edit Image',
            name: 'editImage',
            icon: 'fa:image',
            group: ['transform'],
            version: 1,
            description: 'Edits an image like blur, resize or adding border and text',
            defaults: {
                name: 'Edit Image',
                color: '#553399',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Get Information',
                            value: 'information',
                            description: 'Returns image information like resolution',
                        },
                        {
                            name: 'Multi Step',
                            value: 'multiStep',
                            description: 'Perform multiple operations',
                        },
                        ...nodeOperations,
                    ].sort((a, b) => {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) {
                            return -1;
                        }
                        if (a.name.toLowerCase() > b.name.toLowerCase()) {
                            return 1;
                        }
                        return 0;
                    }),
                    default: 'border',
                },
                {
                    displayName: 'Property Name',
                    name: 'dataPropertyName',
                    type: 'string',
                    default: 'data',
                    description: 'Name of the binary property in which the image data can be found',
                },
                // ----------------------------------
                //         multiStep
                // ----------------------------------
                {
                    displayName: 'Operations',
                    name: 'operations',
                    placeholder: 'Add Operation',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                        sortable: true,
                    },
                    displayOptions: {
                        show: {
                            operation: [
                                'multiStep',
                            ],
                        },
                    },
                    description: 'The operations to perform',
                    default: {},
                    options: [
                        {
                            name: 'operations',
                            displayName: 'Operations',
                            values: [
                                {
                                    displayName: 'Operation',
                                    name: 'operation',
                                    type: 'options',
                                    noDataExpression: true,
                                    options: nodeOperations,
                                    default: '',
                                },
                                ...nodeOperationOptions,
                                {
                                    displayName: 'Font Name or ID',
                                    name: 'font',
                                    type: 'options',
                                    displayOptions: {
                                        show: {
                                            'operation': [
                                                'text',
                                            ],
                                        },
                                    },
                                    typeOptions: {
                                        loadOptionsMethod: 'getFonts',
                                    },
                                    default: 'default',
                                    description: 'The font to use. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                                },
                            ],
                        },
                    ],
                },
                ...nodeOperationOptions,
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    displayOptions: {
                        hide: {
                            operation: [
                                'information',
                            ],
                        },
                    },
                    options: [
                        {
                            displayName: 'File Name',
                            name: 'fileName',
                            type: 'string',
                            default: '',
                            description: 'File name to set in binary data',
                        },
                        {
                            displayName: 'Font Name or ID',
                            name: 'font',
                            type: 'options',
                            displayOptions: {
                                show: {
                                    '/operation': [
                                        'text',
                                    ],
                                },
                            },
                            typeOptions: {
                                loadOptionsMethod: 'getFonts',
                            },
                            default: 'default',
                            description: 'The font to use. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>.',
                        },
                        {
                            displayName: 'Format',
                            name: 'format',
                            type: 'options',
                            options: [
                                {
                                    name: 'bmp',
                                    value: 'bmp',
                                },
                                {
                                    name: 'gif',
                                    value: 'gif',
                                },
                                {
                                    name: 'jpeg',
                                    value: 'jpeg',
                                },
                                {
                                    name: 'png',
                                    value: 'png',
                                },
                                {
                                    name: 'tiff',
                                    value: 'tiff',
                                },
                            ],
                            default: 'jpeg',
                            description: 'Set the output image format',
                        },
                        {
                            displayName: 'Quality',
                            name: 'quality',
                            type: 'number',
                            typeOptions: {
                                minValue: 0,
                                maxValue: 100,
                            },
                            default: 100,
                            displayOptions: {
                                show: {
                                    format: [
                                        'jpeg',
                                        'png',
                                        'tiff',
                                    ],
                                },
                            },
                            description: 'Sets the jpeg|png|tiff compression level from 0 to 100 (best)',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                getFonts() {
                    return __awaiter(this, void 0, void 0, function* () {
                        // @ts-ignore
                        const files = yield (0, get_system_fonts_1.default)();
                        const returnData = [];
                        files.forEach((file) => {
                            const pathParts = (0, path_1.parse)(file);
                            if (!pathParts.ext) {
                                return;
                            }
                            returnData.push({
                                name: pathParts.name,
                                value: file,
                            });
                        });
                        returnData.sort((a, b) => {
                            if (a.name < b.name) {
                                return -1;
                            }
                            if (a.name > b.name) {
                                return 1;
                            }
                            return 0;
                        });
                        returnData.unshift({
                            name: 'default',
                            value: 'default',
                        });
                        return returnData;
                    });
                },
            },
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const length = items.length;
            let item;
            for (let itemIndex = 0; itemIndex < length; itemIndex++) {
                try {
                    item = items[itemIndex];
                    const operation = this.getNodeParameter('operation', itemIndex);
                    const dataPropertyName = this.getNodeParameter('dataPropertyName', itemIndex);
                    const options = this.getNodeParameter('options', itemIndex, {});
                    const cleanupFunctions = [];
                    let gmInstance;
                    const requiredOperationParameters = {
                        blur: [
                            'blur',
                            'sigma',
                        ],
                        border: [
                            'borderColor',
                            'borderWidth',
                            'borderHeight',
                        ],
                        create: [
                            'backgroundColor',
                            'height',
                            'width',
                        ],
                        crop: [
                            'height',
                            'positionX',
                            'positionY',
                            'width',
                        ],
                        composite: [
                            'dataPropertyNameComposite',
                            'operator',
                            'positionX',
                            'positionY',
                        ],
                        draw: [
                            'color',
                            'cornerRadius',
                            'endPositionX',
                            'endPositionY',
                            'primitive',
                            'startPositionX',
                            'startPositionY',
                        ],
                        information: [],
                        resize: [
                            'height',
                            'resizeOption',
                            'width',
                        ],
                        rotate: [
                            'backgroundColor',
                            'rotate',
                        ],
                        shear: [
                            'degreesX',
                            'degreesY',
                        ],
                        text: [
                            'font',
                            'fontColor',
                            'fontSize',
                            'lineLength',
                            'positionX',
                            'positionY',
                            'text',
                        ],
                    };
                    let operations = [];
                    if (operation === 'multiStep') {
                        // Operation parameters are already in the correct format
                        const operationsData = this.getNodeParameter('operations', itemIndex, { operations: [] });
                        operations = operationsData.operations;
                    }
                    else {
                        // Operation parameters have to first get collected
                        const operationParameters = {};
                        requiredOperationParameters[operation].forEach(parameterName => {
                            try {
                                operationParameters[parameterName] = this.getNodeParameter(parameterName, itemIndex);
                            }
                            catch (error) { }
                        });
                        operations = [
                            Object.assign({ operation }, operationParameters),
                        ];
                    }
                    if (operations[0].operation !== 'create') {
                        // "create" generates a new image so does not require any incoming data.
                        if (item.binary === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Item does not contain any binary data.');
                        }
                        if (item.binary[dataPropertyName] === undefined) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Item does not contain any binary data with the name "${dataPropertyName}".`);
                        }
                        const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(itemIndex, dataPropertyName);
                        gmInstance = (0, gm_1.default)(binaryDataBuffer);
                        gmInstance = gmInstance.background('transparent');
                    }
                    const newItem = {
                        json: item.json,
                        binary: {},
                        pairedItem: {
                            item: itemIndex,
                        },
                    };
                    if (operation === 'information') {
                        // Just return the information
                        const imageData = yield new Promise((resolve, reject) => {
                            gmInstance = gmInstance.identify((error, imageData) => {
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                resolve(imageData);
                            });
                        });
                        newItem.json = imageData;
                    }
                    for (let i = 0; i < operations.length; i++) {
                        const operationData = operations[i];
                        if (operationData.operation === 'blur') {
                            gmInstance = gmInstance.blur(operationData.blur, operationData.sigma);
                        }
                        else if (operationData.operation === 'border') {
                            gmInstance = gmInstance.borderColor(operationData.borderColor).border(operationData.borderWidth, operationData.borderHeight);
                        }
                        else if (operationData.operation === 'composite') {
                            const positionX = operationData.positionX;
                            const positionY = operationData.positionY;
                            const operator = operationData.operator;
                            const geometryString = (positionX >= 0 ? '+' : '') + positionX + (positionY >= 0 ? '+' : '') + positionY;
                            if (item.binary[operationData.dataPropertyNameComposite] === undefined) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Item does not contain any binary data with the name "${operationData.dataPropertyNameComposite}".`);
                            }
                            const { fd, path, cleanup } = yield (0, tmp_promise_1.file)();
                            cleanupFunctions.push(cleanup);
                            const binaryDataBuffer = yield this.helpers.getBinaryDataBuffer(itemIndex, operationData.dataPropertyNameComposite);
                            yield fsWriteFileAsync(fd, binaryDataBuffer);
                            if (operations[0].operation === 'create') {
                                // It seems like if the image gets created newly we have to create a new gm instance
                                // else it fails for some reason
                                gmInstance = (0, gm_1.default)(gmInstance.stream('png')).compose(operator).geometry(geometryString).composite(path);
                            }
                            else {
                                gmInstance = gmInstance.compose(operator).geometry(geometryString).composite(path);
                            }
                            if (operations.length !== i + 1) {
                                // If there are other operations after the current one create a new gm instance
                                // because else things do get messed up
                                gmInstance = (0, gm_1.default)(gmInstance.stream());
                            }
                        }
                        else if (operationData.operation === 'create') {
                            gmInstance = (0, gm_1.default)(operationData.width, operationData.height, operationData.backgroundColor);
                            if (!options.format) {
                                options.format = 'png';
                            }
                        }
                        else if (operationData.operation === 'crop') {
                            gmInstance = gmInstance.crop(operationData.width, operationData.height, operationData.positionX, operationData.positionY);
                        }
                        else if (operationData.operation === 'draw') {
                            gmInstance = gmInstance.fill(operationData.color);
                            if (operationData.primitive === 'line') {
                                gmInstance = gmInstance.drawLine(operationData.startPositionX, operationData.startPositionY, operationData.endPositionX, operationData.endPositionY);
                            }
                            else if (operationData.primitive === 'circle') {
                                gmInstance = gmInstance.drawCircle(operationData.startPositionX, operationData.startPositionY, operationData.endPositionX, operationData.endPositionY);
                            }
                            else if (operationData.primitive === 'rectangle') {
                                gmInstance = gmInstance.drawRectangle(operationData.startPositionX, operationData.startPositionY, operationData.endPositionX, operationData.endPositionY, operationData.cornerRadius || undefined);
                            }
                        }
                        else if (operationData.operation === 'resize') {
                            const resizeOption = operationData.resizeOption;
                            // By default use "maximumArea"
                            let option = '@';
                            if (resizeOption === 'ignoreAspectRatio') {
                                option = '!';
                            }
                            else if (resizeOption === 'minimumArea') {
                                option = '^';
                            }
                            else if (resizeOption === 'onlyIfSmaller') {
                                option = '<';
                            }
                            else if (resizeOption === 'onlyIfLarger') {
                                option = '>';
                            }
                            else if (resizeOption === 'percent') {
                                option = '%';
                            }
                            gmInstance = gmInstance.resize(operationData.width, operationData.height, option);
                        }
                        else if (operationData.operation === 'rotate') {
                            gmInstance = gmInstance.rotate(operationData.backgroundColor, operationData.rotate);
                        }
                        else if (operationData.operation === 'shear') {
                            gmInstance = gmInstance.shear(operationData.degreesX, operationData.degreesY);
                        }
                        else if (operationData.operation === 'text') {
                            // Split the text in multiple lines
                            const lines = [];
                            let currentLine = '';
                            operationData.text.split('\n').forEach((textLine) => {
                                textLine.split(' ').forEach((textPart) => {
                                    if ((currentLine.length + textPart.length + 1) > operationData.lineLength) {
                                        lines.push(currentLine.trim());
                                        currentLine = `${textPart} `;
                                        return;
                                    }
                                    currentLine += `${textPart} `;
                                });
                                lines.push(currentLine.trim());
                                currentLine = '';
                            });
                            // Combine the lines to a single string
                            const renderText = lines.join('\n');
                            const font = options.font || operationData.font;
                            if (font && font !== 'default') {
                                gmInstance = gmInstance.font(font);
                            }
                            gmInstance = gmInstance
                                .fill(operationData.fontColor)
                                .fontSize(operationData.fontSize)
                                .drawText(operationData.positionX, operationData.positionY, renderText);
                        }
                        else if (operationData.operation === 'transparent') {
                            gmInstance = gmInstance.transparent(operationData.color);
                        }
                    }
                    if (item.binary !== undefined) {
                        // Create a shallow copy of the binary data so that the old
                        // data references which do not get changed still stay behind
                        // but the incoming data does not get changed.
                        Object.assign(newItem.binary, item.binary);
                        // Make a deep copy of the binary data we change
                        if (newItem.binary[dataPropertyName]) {
                            newItem.binary[dataPropertyName] = JSON.parse(JSON.stringify(newItem.binary[dataPropertyName]));
                        }
                    }
                    if (newItem.binary[dataPropertyName] === undefined) {
                        newItem.binary[dataPropertyName] = {
                            data: '',
                            mimeType: '',
                        };
                    }
                    if (options.quality !== undefined) {
                        gmInstance = gmInstance.quality(options.quality);
                    }
                    if (options.format !== undefined) {
                        gmInstance = gmInstance.setFormat(options.format);
                        newItem.binary[dataPropertyName].fileExtension = options.format;
                        newItem.binary[dataPropertyName].mimeType = `image/${options.format}`;
                        const fileName = newItem.binary[dataPropertyName].fileName;
                        if (fileName && fileName.includes('.')) {
                            newItem.binary[dataPropertyName].fileName = fileName.split('.').slice(0, -1).join('.') + '.' + options.format;
                        }
                    }
                    if (options.fileName !== undefined) {
                        newItem.binary[dataPropertyName].fileName = options.fileName;
                    }
                    returnData.push(yield (new Promise((resolve, reject) => {
                        gmInstance
                            .toBuffer((error, buffer) => __awaiter(this, void 0, void 0, function* () {
                            cleanupFunctions.forEach((cleanup) => __awaiter(this, void 0, void 0, function* () { return yield cleanup(); }));
                            if (error) {
                                return reject(error);
                            }
                            const binaryData = yield this.helpers.prepareBinaryData(Buffer.from(buffer));
                            newItem.binary[dataPropertyName] = Object.assign(Object.assign({}, newItem.binary[dataPropertyName]), binaryData);
                            return resolve(newItem);
                        }));
                    })));
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        returnData.push({
                            json: {
                                error: error.message,
                            },
                            pairedItem: {
                                item: itemIndex,
                            },
                        });
                        continue;
                    }
                    throw error;
                }
            }
            return this.prepareOutputData(returnData);
        });
    }
}
exports.EditImage = EditImage;
