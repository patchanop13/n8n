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
exports.S3 = void 0;
const change_case_1 = require("change-case");
const crypto_1 = require("crypto");
const xml2js_1 = require("xml2js");
const n8n_workflow_1 = require("n8n-workflow");
const BucketDescription_1 = require("../Aws/S3/BucketDescription");
const FolderDescription_1 = require("../Aws/S3/FolderDescription");
const FileDescription_1 = require("../Aws/S3/FileDescription");
const GenericFunctions_1 = require("./GenericFunctions");
class S3 {
    constructor() {
        this.description = {
            displayName: 'S3',
            name: 's3',
            // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
            icon: 'file:s3.png',
            group: ['output'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Sends data to any S3-compatible service',
            defaults: {
                name: 'S3',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 's3',
                    required: true,
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
                            name: 'Bucket',
                            value: 'bucket',
                        },
                        {
                            name: 'File',
                            value: 'file',
                        },
                        {
                            name: 'Folder',
                            value: 'folder',
                        },
                    ],
                    default: 'file',
                },
                // BUCKET
                ...BucketDescription_1.bucketOperations,
                ...BucketDescription_1.bucketFields,
                // FOLDER
                ...FolderDescription_1.folderOperations,
                ...FolderDescription_1.folderFields,
                // UPLOAD
                ...FileDescription_1.fileOperations,
                ...FileDescription_1.fileFields,
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getInputData();
            const returnData = [];
            const qs = {};
            let responseData;
            const resource = this.getNodeParameter('resource', 0);
            const operation = this.getNodeParameter('operation', 0);
            for (let i = 0; i < items.length; i++) {
                try {
                    const headers = {};
                    if (resource === 'bucket') {
                        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_CreateBucket.html
                        if (operation === 'create') {
                            let credentials;
                            try {
                                credentials = yield this.getCredentials('s3');
                            }
                            catch (error) {
                                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                            }
                            const name = this.getNodeParameter('name', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            if (additionalFields.acl) {
                                headers['x-amz-acl'] = (0, change_case_1.paramCase)(additionalFields.acl);
                            }
                            if (additionalFields.bucketObjectLockEnabled) {
                                headers['x-amz-bucket-object-lock-enabled'] = additionalFields.bucketObjectLockEnabled;
                            }
                            if (additionalFields.grantFullControl) {
                                headers['x-amz-grant-full-control'] = '';
                            }
                            if (additionalFields.grantRead) {
                                headers['x-amz-grant-read'] = '';
                            }
                            if (additionalFields.grantReadAcp) {
                                headers['x-amz-grant-read-acp'] = '';
                            }
                            if (additionalFields.grantWrite) {
                                headers['x-amz-grant-write'] = '';
                            }
                            if (additionalFields.grantWriteAcp) {
                                headers['x-amz-grant-write-acp'] = '';
                            }
                            let region = credentials.region;
                            if (additionalFields.region) {
                                region = additionalFields.region;
                            }
                            const body = {
                                CreateBucketConfiguration: {
                                    '$': {
                                        xmlns: 'http://s3.amazonaws.com/doc/2006-03-01/',
                                    },
                                },
                            };
                            let data = '';
                            // if credentials has the S3 defaul region (us-east-1) the body (XML) does not have to be sent.
                            if (region !== 'us-east-1') {
                                // @ts-ignore
                                body.CreateBucketConfiguration.LocationConstraint = [region];
                                const builder = new xml2js_1.Builder();
                                data = builder.buildObject(body);
                            }
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, `${name}`, 'PUT', '', data, qs, headers);
                            returnData.push({ success: true });
                        }
                        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListBuckets.html
                        if (operation === 'getAll') {
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAPAllItems.call(this, 'ListAllMyBucketsResult.Buckets.Bucket', '', 'GET', '');
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAPAllItems.call(this, 'ListAllMyBucketsResult.Buckets.Bucket', '', 'GET', '', '', qs);
                                responseData = responseData.slice(0, qs.limit);
                            }
                            returnData.push.apply(returnData, responseData);
                        }
                        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html
                        if (operation === 'search') {
                            const bucketName = this.getNodeParameter('bucketName', i);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const additionalFields = this.getNodeParameter('additionalFields', 0);
                            if (additionalFields.prefix) {
                                qs['prefix'] = additionalFields.prefix;
                            }
                            if (additionalFields.encodingType) {
                                qs['encoding-type'] = additionalFields.encodingType;
                            }
                            if (additionalFields.delmiter) {
                                qs['delimiter'] = additionalFields.delmiter;
                            }
                            if (additionalFields.fetchOwner) {
                                qs['fetch-owner'] = additionalFields.fetchOwner;
                            }
                            if (additionalFields.startAfter) {
                                qs['start-after'] = additionalFields.startAfter;
                            }
                            if (additionalFields.requesterPays) {
                                qs['x-amz-request-payer'] = 'requester';
                            }
                            qs['list-type'] = 2;
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'GET', '', '', { location: '' });
                            const region = responseData.LocationConstraint._;
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAPAllItems.call(this, 'ListBucketResult.Contents', bucketName, 'GET', '', '', qs, {}, {}, region);
                            }
                            else {
                                qs['max-keys'] = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'GET', '', '', qs, {}, {}, region);
                                responseData = responseData.ListBucketResult.Contents;
                            }
                            if (Array.isArray(responseData)) {
                                returnData.push.apply(returnData, responseData);
                            }
                            else {
                                returnData.push(responseData);
                            }
                        }
                    }
                    if (resource === 'folder') {
                        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html
                        if (operation === 'create') {
                            const bucketName = this.getNodeParameter('bucketName', i);
                            const folderName = this.getNodeParameter('folderName', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            let path = `/${folderName}/`;
                            if (additionalFields.requesterPays) {
                                headers['x-amz-request-payer'] = 'requester';
                            }
                            if (additionalFields.parentFolderKey) {
                                path = `/${additionalFields.parentFolderKey}${folderName}/`;
                            }
                            if (additionalFields.storageClass) {
                                headers['x-amz-storage-class'] = ((0, change_case_1.snakeCase)(additionalFields.storageClass)).toUpperCase();
                            }
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'GET', '', '', { location: '' });
                            const region = responseData.LocationConstraint._;
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'PUT', path, '', qs, headers, {}, region);
                            returnData.push({ success: true });
                        }
                        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObjects.html
                        if (operation === 'delete') {
                            const bucketName = this.getNodeParameter('bucketName', i);
                            const folderKey = this.getNodeParameter('folderKey', i);
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'GET', '', '', { location: '' });
                            const region = responseData.LocationConstraint._;
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAPAllItems.call(this, 'ListBucketResult.Contents', bucketName, 'GET', '/', '', { 'list-type': 2, prefix: folderKey }, {}, {}, region);
                            // folder empty then just delete it
                            if (responseData.length === 0) {
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'DELETE', `/${folderKey}`, '', qs, {}, {}, region);
                                responseData = { deleted: [{ 'Key': folderKey }] };
                            }
                            else {
                                // delete everything inside the folder
                                const body = {
                                    Delete: {
                                        '$': {
                                            xmlns: 'http://s3.amazonaws.com/doc/2006-03-01/',
                                        },
                                        Object: [],
                                    },
                                };
                                for (const childObject of responseData) {
                                    //@ts-ignore
                                    body.Delete.Object.push({
                                        Key: childObject.Key,
                                    });
                                }
                                const builder = new xml2js_1.Builder();
                                const data = builder.buildObject(body);
                                headers['Content-MD5'] = (0, crypto_1.createHash)('md5').update(data).digest('base64');
                                headers['Content-Type'] = 'application/xml';
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'POST', '/', data, { delete: '' }, headers, {}, region);
                                responseData = { deleted: responseData.DeleteResult.Deleted };
                            }
                            returnData.push(responseData);
                        }
                        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html
                        if (operation === 'getAll') {
                            const bucketName = this.getNodeParameter('bucketName', i);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const options = this.getNodeParameter('options', 0);
                            if (options.folderKey) {
                                qs['prefix'] = options.folderKey;
                            }
                            if (options.fetchOwner) {
                                qs['fetch-owner'] = options.fetchOwner;
                            }
                            qs['list-type'] = 2;
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'GET', '', '', { location: '' });
                            const region = responseData.LocationConstraint._;
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAPAllItems.call(this, 'ListBucketResult.Contents', bucketName, 'GET', '', '', qs, {}, {}, region);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAPAllItems.call(this, 'ListBucketResult.Contents', bucketName, 'GET', '', '', qs, {}, {}, region);
                            }
                            if (Array.isArray(responseData)) {
                                responseData = responseData.filter((e) => e.Key.endsWith('/') && e.Size === '0' && e.Key !== options.folderKey);
                                if (qs.limit) {
                                    responseData = responseData.splice(0, qs.limit);
                                }
                                returnData.push.apply(returnData, responseData);
                            }
                        }
                    }
                    if (resource === 'file') {
                        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_CopyObject.html
                        if (operation === 'copy') {
                            const sourcePath = this.getNodeParameter('sourcePath', i);
                            const destinationPath = this.getNodeParameter('destinationPath', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            headers['x-amz-copy-source'] = sourcePath;
                            if (additionalFields.requesterPays) {
                                headers['x-amz-request-payer'] = 'requester';
                            }
                            if (additionalFields.storageClass) {
                                headers['x-amz-storage-class'] = ((0, change_case_1.snakeCase)(additionalFields.storageClass)).toUpperCase();
                            }
                            if (additionalFields.acl) {
                                headers['x-amz-acl'] = (0, change_case_1.paramCase)(additionalFields.acl);
                            }
                            if (additionalFields.grantFullControl) {
                                headers['x-amz-grant-full-control'] = '';
                            }
                            if (additionalFields.grantRead) {
                                headers['x-amz-grant-read'] = '';
                            }
                            if (additionalFields.grantReadAcp) {
                                headers['x-amz-grant-read-acp'] = '';
                            }
                            if (additionalFields.grantWriteAcp) {
                                headers['x-amz-grant-write-acp'] = '';
                            }
                            if (additionalFields.lockLegalHold) {
                                headers['x-amz-object-lock-legal-hold'] = additionalFields.lockLegalHold ? 'ON' : 'OFF';
                            }
                            if (additionalFields.lockMode) {
                                headers['x-amz-object-lock-mode'] = additionalFields.lockMode.toUpperCase();
                            }
                            if (additionalFields.lockRetainUntilDate) {
                                headers['x-amz-object-lock-retain-until-date'] = additionalFields.lockRetainUntilDate;
                            }
                            if (additionalFields.serverSideEncryption) {
                                headers['x-amz-server-side-encryption'] = additionalFields.serverSideEncryption;
                            }
                            if (additionalFields.encryptionAwsKmsKeyId) {
                                headers['x-amz-server-side-encryption-aws-kms-key-id'] = additionalFields.encryptionAwsKmsKeyId;
                            }
                            if (additionalFields.serverSideEncryptionContext) {
                                headers['x-amz-server-side-encryption-context'] = additionalFields.serverSideEncryptionContext;
                            }
                            if (additionalFields.serversideEncryptionCustomerAlgorithm) {
                                headers['x-amz-server-side-encryption-customer-algorithm'] = additionalFields.serversideEncryptionCustomerAlgorithm;
                            }
                            if (additionalFields.serversideEncryptionCustomerKey) {
                                headers['x-amz-server-side-encryption-customer-key'] = additionalFields.serversideEncryptionCustomerKey;
                            }
                            if (additionalFields.serversideEncryptionCustomerKeyMD5) {
                                headers['x-amz-server-side-encryption-customer-key-MD5'] = additionalFields.serversideEncryptionCustomerKeyMD5;
                            }
                            if (additionalFields.taggingDirective) {
                                headers['x-amz-tagging-directive'] = additionalFields.taggingDirective.toUpperCase();
                            }
                            if (additionalFields.metadataDirective) {
                                headers['x-amz-metadata-directive'] = additionalFields.metadataDirective.toUpperCase();
                            }
                            const destinationParts = destinationPath.split('/');
                            const bucketName = destinationParts[1];
                            const destination = `/${destinationParts.slice(2, destinationParts.length).join('/')}`;
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'GET', '', '', { location: '' });
                            const region = responseData.LocationConstraint._;
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'PUT', destination, '', qs, headers, {}, region);
                            returnData.push(responseData.CopyObjectResult);
                        }
                        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html
                        if (operation === 'download') {
                            const bucketName = this.getNodeParameter('bucketName', i);
                            const fileKey = this.getNodeParameter('fileKey', i);
                            const fileName = fileKey.split('/')[fileKey.split('/').length - 1];
                            if (fileKey.substring(fileKey.length - 1) === '/') {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Downloding a whole directory is not yet supported, please provide a file key');
                            }
                            let region = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'GET', '', '', { location: '' });
                            region = region.LocationConstraint._;
                            const response = yield GenericFunctions_1.s3ApiRequestREST.call(this, bucketName, 'GET', `/${fileKey}`, '', qs, {}, { encoding: null, resolveWithFullResponse: true }, region);
                            let mimeType;
                            if (response.headers['content-type']) {
                                mimeType = response.headers['content-type'];
                            }
                            const newItem = {
                                json: items[i].json,
                                binary: {},
                            };
                            if (items[i].binary !== undefined) {
                                // Create a shallow copy of the binary data so that the old
                                // data references which do not get changed still stay behind
                                // but the incoming data does not get changed.
                                Object.assign(newItem.binary, items[i].binary);
                            }
                            items[i] = newItem;
                            const dataPropertyNameDownload = this.getNodeParameter('binaryPropertyName', i);
                            const data = Buffer.from(response.body, 'utf8');
                            items[i].binary[dataPropertyNameDownload] = yield this.helpers.prepareBinaryData(data, fileName, mimeType);
                        }
                        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObject.html
                        if (operation === 'delete') {
                            const bucketName = this.getNodeParameter('bucketName', i);
                            const fileKey = this.getNodeParameter('fileKey', i);
                            const options = this.getNodeParameter('options', i);
                            if (options.versionId) {
                                qs.versionId = options.versionId;
                            }
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'GET', '', '', { location: '' });
                            const region = responseData.LocationConstraint._;
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'DELETE', `/${fileKey}`, '', qs, {}, {}, region);
                            returnData.push({ success: true });
                        }
                        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html
                        if (operation === 'getAll') {
                            const bucketName = this.getNodeParameter('bucketName', i);
                            const returnAll = this.getNodeParameter('returnAll', 0);
                            const options = this.getNodeParameter('options', 0);
                            if (options.folderKey) {
                                qs['prefix'] = options.folderKey;
                            }
                            if (options.fetchOwner) {
                                qs['fetch-owner'] = options.fetchOwner;
                            }
                            qs['delimiter'] = '/';
                            qs['list-type'] = 2;
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'GET', '', '', { location: '' });
                            const region = responseData.LocationConstraint._;
                            if (returnAll) {
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAPAllItems.call(this, 'ListBucketResult.Contents', bucketName, 'GET', '', '', qs, {}, {}, region);
                            }
                            else {
                                qs.limit = this.getNodeParameter('limit', 0);
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAPAllItems.call(this, 'ListBucketResult.Contents', bucketName, 'GET', '', '', qs, {}, {}, region);
                                responseData = responseData.splice(0, qs.limit);
                            }
                            if (Array.isArray(responseData)) {
                                responseData = responseData.filter((e) => !e.Key.endsWith('/') && e.Size !== '0');
                                if (qs.limit) {
                                    responseData = responseData.splice(0, qs.limit);
                                }
                                returnData.push.apply(returnData, responseData);
                            }
                        }
                        //https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html
                        if (operation === 'upload') {
                            const bucketName = this.getNodeParameter('bucketName', i);
                            const fileName = this.getNodeParameter('fileName', i);
                            const isBinaryData = this.getNodeParameter('binaryData', i);
                            const additionalFields = this.getNodeParameter('additionalFields', i);
                            const tagsValues = this.getNodeParameter('tagsUi', i).tagsValues;
                            let path = '/';
                            let body;
                            if (additionalFields.requesterPays) {
                                headers['x-amz-request-payer'] = 'requester';
                            }
                            if (additionalFields.parentFolderKey) {
                                path = `/${additionalFields.parentFolderKey}/`;
                            }
                            if (additionalFields.storageClass) {
                                headers['x-amz-storage-class'] = ((0, change_case_1.snakeCase)(additionalFields.storageClass)).toUpperCase();
                            }
                            if (additionalFields.acl) {
                                headers['x-amz-acl'] = (0, change_case_1.paramCase)(additionalFields.acl);
                            }
                            if (additionalFields.grantFullControl) {
                                headers['x-amz-grant-full-control'] = '';
                            }
                            if (additionalFields.grantRead) {
                                headers['x-amz-grant-read'] = '';
                            }
                            if (additionalFields.grantReadAcp) {
                                headers['x-amz-grant-read-acp'] = '';
                            }
                            if (additionalFields.grantWriteAcp) {
                                headers['x-amz-grant-write-acp'] = '';
                            }
                            if (additionalFields.lockLegalHold) {
                                headers['x-amz-object-lock-legal-hold'] = additionalFields.lockLegalHold ? 'ON' : 'OFF';
                            }
                            if (additionalFields.lockMode) {
                                headers['x-amz-object-lock-mode'] = additionalFields.lockMode.toUpperCase();
                            }
                            if (additionalFields.lockRetainUntilDate) {
                                headers['x-amz-object-lock-retain-until-date'] = additionalFields.lockRetainUntilDate;
                            }
                            if (additionalFields.serverSideEncryption) {
                                headers['x-amz-server-side-encryption'] = additionalFields.serverSideEncryption;
                            }
                            if (additionalFields.encryptionAwsKmsKeyId) {
                                headers['x-amz-server-side-encryption-aws-kms-key-id'] = additionalFields.encryptionAwsKmsKeyId;
                            }
                            if (additionalFields.serverSideEncryptionContext) {
                                headers['x-amz-server-side-encryption-context'] = additionalFields.serverSideEncryptionContext;
                            }
                            if (additionalFields.serversideEncryptionCustomerAlgorithm) {
                                headers['x-amz-server-side-encryption-customer-algorithm'] = additionalFields.serversideEncryptionCustomerAlgorithm;
                            }
                            if (additionalFields.serversideEncryptionCustomerKey) {
                                headers['x-amz-server-side-encryption-customer-key'] = additionalFields.serversideEncryptionCustomerKey;
                            }
                            if (additionalFields.serversideEncryptionCustomerKeyMD5) {
                                headers['x-amz-server-side-encryption-customer-key-MD5'] = additionalFields.serversideEncryptionCustomerKeyMD5;
                            }
                            if (tagsValues) {
                                const tags = [];
                                tagsValues.forEach((o) => { tags.push(`${o.key}=${o.value}`); });
                                headers['x-amz-tagging'] = tags.join('&');
                            }
                            responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'GET', '', '', { location: '' });
                            const region = responseData.LocationConstraint._;
                            if (isBinaryData) {
                                const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0);
                                if (items[i].binary === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No binary data exists on item!');
                                }
                                if (items[i].binary[binaryPropertyName] === undefined) {
                                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `No binary data property "${binaryPropertyName}" does not exists on item!`);
                                }
                                const binaryData = items[i].binary[binaryPropertyName];
                                body = yield this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
                                headers['Content-Type'] = binaryData.mimeType;
                                headers['Content-MD5'] = (0, crypto_1.createHash)('md5').update(body).digest('base64');
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'PUT', `${path}${fileName || binaryData.fileName}`, body, qs, headers, {}, region);
                            }
                            else {
                                const fileContent = this.getNodeParameter('fileContent', i);
                                body = Buffer.from(fileContent, 'utf8');
                                headers['Content-Type'] = 'text/html';
                                headers['Content-MD5'] = (0, crypto_1.createHash)('md5').update(fileContent).digest('base64');
                                responseData = yield GenericFunctions_1.s3ApiRequestSOAP.call(this, bucketName, 'PUT', `${path}${fileName}`, body, qs, headers, {}, region);
                            }
                            returnData.push({ success: true });
                        }
                    }
                }
                catch (error) {
                    if (this.continueOnFail()) {
                        if (resource === 'file' && operation === 'download') {
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
            if (resource === 'file' && operation === 'download') {
                // For file downloads the files get attached to the existing items
                return this.prepareOutputData(items);
            }
            else {
                return [this.helpers.returnJsonArray(returnData)];
            }
        });
    }
}
exports.S3 = S3;
