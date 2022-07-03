"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.destinationFields = exports.destinationExternalField = exports.destinationOperations = void 0;
exports.destinationOperations = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: [
                    'destination',
                ],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new destination',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a specific destination',
            },
        ],
        default: 'get',
    },
];
const unparsedField = {
    displayName: 'Unparsed Address',
    name: 'unparsed',
    type: 'boolean',
    description: 'Whether or not the address is specified in a single unparsed string',
    default: false,
};
const unparsedAddressField = {
    displayName: 'Destination Address',
    name: 'address',
    type: 'string',
    description: 'The destination\'s street address details',
    default: '',
};
const unparsedAddressNumberField = {
    displayName: 'Number',
    name: 'addressNumber',
    type: 'string',
    description: 'The number component of this address, it may also contain letters',
    default: '',
};
const unparsedAddressStreetField = {
    displayName: 'Street',
    name: 'addressStreet',
    type: 'string',
    description: 'The name of the street',
    default: '',
};
const unparsedAddressCityField = {
    displayName: 'City',
    name: 'addressCity',
    type: 'string',
    description: 'The name of the municipality',
    default: '',
};
const unparsedAddressCountryField = {
    displayName: 'Country',
    name: 'addressCountry',
    type: 'string',
    description: 'The name of the country',
    default: '',
};
const unparsedAddressStateField = {
    displayName: 'State',
    name: 'addressState',
    type: 'string',
    default: '',
};
const addressNameField = {
    displayName: 'Address Name',
    name: 'addressName',
    type: 'string',
    default: '',
    description: 'A name associated with this address',
};
const addressApartmentField = {
    displayName: 'Apartment',
    name: 'addressApartment',
    type: 'string',
    default: '',
    description: 'The suite or apartment number, or any additional relevant information',
};
const addressNoteField = {
    displayName: 'Address Notes',
    name: 'addressNotes',
    type: 'string',
    default: '',
    description: 'Notes about the destination',
};
const addressPostalCodeField = {
    displayName: 'Postal Code',
    name: 'addressPostalCode',
    type: 'string',
    default: '',
    description: 'The postal or zip code',
};
exports.destinationExternalField = {
    displayName: 'Destination',
    name: 'destination',
    type: 'fixedCollection',
    placeholder: 'Add Destination',
    default: {},
    options: [
        {
            displayName: 'Destination Properties',
            name: 'destinationProperties',
            default: {},
            values: [
                Object.assign(Object.assign({}, unparsedField), { required: false }),
                Object.assign(Object.assign({}, unparsedAddressField), { displayOptions: {
                        show: {
                            unparsed: [
                                true,
                            ],
                        },
                    }, required: true }),
                Object.assign(Object.assign({}, unparsedAddressNumberField), { displayOptions: {
                        show: {
                            unparsed: [
                                false,
                            ],
                        },
                    }, required: true }),
                Object.assign(Object.assign({}, unparsedAddressStreetField), { displayOptions: {
                        show: {
                            unparsed: [
                                false,
                            ],
                        },
                    }, required: true }),
                Object.assign(Object.assign({}, unparsedAddressCityField), { displayOptions: {
                        show: {
                            unparsed: [
                                false,
                            ],
                        },
                    }, required: true }),
                Object.assign(Object.assign({}, unparsedAddressStateField), { displayOptions: {
                        show: {
                            unparsed: [
                                false,
                            ],
                        },
                    }, required: true }),
                Object.assign(Object.assign({}, unparsedAddressCountryField), { displayOptions: {
                        show: {
                            unparsed: [
                                false,
                            ],
                        },
                    }, required: true }),
                Object.assign(Object.assign({ displayOptions: {
                        show: {
                            unparsed: [
                                false,
                            ],
                        },
                    } }, addressPostalCodeField), { required: false }),
                Object.assign(Object.assign({}, addressNameField), { required: false }),
                Object.assign(Object.assign({}, addressApartmentField), { required: false }),
                Object.assign(Object.assign({}, addressNoteField), { required: false }),
            ],
        },
    ],
};
exports.destinationFields = [
    {
        displayName: 'Destination ID',
        name: 'id',
        type: 'string',
        displayOptions: {
            show: {
                resource: [
                    'destination',
                ],
            },
            hide: {
                operation: [
                    'create',
                ],
            },
        },
        default: '',
        required: true,
        description: 'The ID of the destination object for lookup',
    },
    Object.assign(Object.assign({}, unparsedField), { displayOptions: {
            show: {
                resource: [
                    'destination',
                ],
                operation: [
                    'create',
                ],
            },
        }, required: true }),
    Object.assign(Object.assign({}, unparsedAddressField), { displayOptions: {
            show: {
                resource: [
                    'destination',
                ],
                operation: [
                    'create',
                ],
                unparsed: [
                    true,
                ],
            },
        }, required: true }),
    Object.assign(Object.assign({}, unparsedAddressNumberField), { displayOptions: {
            show: {
                resource: [
                    'destination',
                ],
                operation: [
                    'create',
                ],
                unparsed: [
                    false,
                ],
            },
        }, required: true }),
    Object.assign(Object.assign({}, unparsedAddressStreetField), { displayOptions: {
            show: {
                resource: [
                    'destination',
                ],
                operation: [
                    'create',
                ],
                unparsed: [
                    false,
                ],
            },
        }, required: true }),
    Object.assign(Object.assign({}, unparsedAddressCityField), { displayOptions: {
            show: {
                resource: [
                    'destination',
                ],
                operation: [
                    'create',
                ],
                unparsed: [
                    false,
                ],
            },
        }, required: true }),
    Object.assign(Object.assign({}, unparsedAddressCountryField), { displayOptions: {
            show: {
                resource: [
                    'destination',
                ],
                operation: [
                    'create',
                ],
                unparsed: [
                    false,
                ],
            },
        }, required: true }),
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
            show: {
                resource: [
                    'destination',
                ],
                operation: [
                    'create',
                ],
                unparsed: [
                    true,
                ],
            },
        },
        options: [
            addressApartmentField,
            addressNameField,
            addressNoteField,
        ],
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
                    'destination',
                ],
                operation: [
                    'create',
                ],
                unparsed: [
                    false,
                ],
            },
        },
        options: [
            addressApartmentField,
            addressNameField,
            addressNoteField,
            addressPostalCodeField,
        ],
    },
];
