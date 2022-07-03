"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cameraProxyFields = exports.cameraProxyOperations = void 0;
exports.cameraProxyOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'cameraProxy',
                ],
            },
        },
        options: [
            {
                name: 'Get Screenshot',
                value: 'getScreenshot',
                description: 'Get the camera screenshot',
            },
        ],
        default: 'getScreenshot',
    },
];
exports.cameraProxyFields = [
    /* -------------------------------------------------------------------------- */
    /*                       cameraProxy:getScreenshot                            */
    /* -------------------------------------------------------------------------- */
    {
        displayName: 'Camera Entity Name or ID',
        name: 'cameraEntityId',
        type: 'options',
        description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/nodes/expressions.html#expressions">expression</a>',
        typeOptions: {
            loadOptionsMethod: 'getCameraEntities',
        },
        default: '',
        required: true,
        displayOptions: {
            show: {
                operation: [
                    'getScreenshot',
                ],
                resource: [
                    'cameraProxy',
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
                    'getScreenshot',
                ],
                resource: [
                    'cameraProxy',
                ],
            },
        },
        description: 'Name of the binary property to which to write the data of the read file',
    },
];
