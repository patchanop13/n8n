"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticsearchApi = void 0;
class ElasticsearchApi {
    constructor() {
        this.name = 'elasticsearchApi';
        this.displayName = 'Elasticsearch API';
        this.documentationUrl = 'elasticsearch';
        this.properties = [
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: '',
                placeholder: 'https://mydeployment.es.us-central1.gcp.cloud.es.io:9243',
                description: 'Referred to as Elasticsearch \'endpoint\' in the Elastic deployment dashboard',
            },
        ];
    }
}
exports.ElasticsearchApi = ElasticsearchApi;
