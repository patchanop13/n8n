"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticSecurityApi = void 0;
class ElasticSecurityApi {
    constructor() {
        this.name = 'elasticSecurityApi';
        this.displayName = 'Elastic Security API';
        this.documentationUrl = 'elasticSecurity';
        this.properties = [
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
                required: true,
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                required: true,
            },
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: '',
                placeholder: 'e.g. https://mydeployment.kb.us-central1.gcp.cloud.es.io:9243',
                description: 'Referred to as Kibana \'endpoint\' in the Elastic deployment dashboard',
                required: true,
            },
        ];
    }
}
exports.ElasticSecurityApi = ElasticSecurityApi;
