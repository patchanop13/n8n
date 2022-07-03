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
exports.extractEmail = exports.googleApiRequestAllItems = exports.encodeEmail = exports.parseRawEmail = exports.googleApiRequest = void 0;
const mailparser_1 = require("mailparser");
const n8n_workflow_1 = require("n8n-workflow");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailComposer = require('nodemailer/lib/mail-composer');
function googleApiRequest(method, endpoint, body = {}, qs = {}, uri, option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticationMethod = this.getNodeParameter('authentication', 0, 'serviceAccount');
        let options = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method,
            body,
            qs,
            uri: uri || `https://www.googleapis.com${endpoint}`,
            qsStringifyOptions: {
                arrayFormat: 'repeat',
            },
            json: true,
        };
        options = Object.assign({}, options, option);
        try {
            if (Object.keys(body).length === 0) {
                delete options.body;
            }
            if (authenticationMethod === 'serviceAccount') {
                const credentials = yield this.getCredentials('googleApi');
                const { access_token } = yield getAccessToken.call(this, credentials);
                options.headers.Authorization = `Bearer ${access_token}`;
                //@ts-ignore
                return yield this.helpers.request(options);
            }
            else {
                //@ts-ignore
                return yield this.helpers.requestOAuth2.call(this, 'gmailOAuth2', options);
            }
        }
        catch (error) {
            if (error.code === 'ERR_OSSL_PEM_NO_START_LINE') {
                error.statusCode = '401';
            }
            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
        }
    });
}
exports.googleApiRequest = googleApiRequest;
function parseRawEmail(messageData, dataPropertyNameDownload) {
    return __awaiter(this, void 0, void 0, function* () {
        const messageEncoded = Buffer.from(messageData.raw, 'base64').toString('utf8');
        let responseData = yield (0, mailparser_1.simpleParser)(messageEncoded);
        const headers = {};
        // @ts-ignore
        for (const header of responseData.headerLines) {
            headers[header.key] = header.line;
        }
        // @ts-ignore
        responseData.headers = headers;
        // @ts-ignore
        responseData.headerLines = undefined;
        const binaryData = {};
        if (responseData.attachments) {
            for (let i = 0; i < responseData.attachments.length; i++) {
                const attachment = responseData.attachments[i];
                binaryData[`${dataPropertyNameDownload}${i}`] = yield this.helpers.prepareBinaryData(attachment.content, attachment.filename, attachment.contentType);
            }
            // @ts-ignore
            responseData.attachments = undefined;
        }
        const mailBaseData = {};
        const resolvedModeAddProperties = [
            'id',
            'threadId',
            'labelIds',
            'sizeEstimate',
        ];
        for (const key of resolvedModeAddProperties) {
            // @ts-ignore
            mailBaseData[key] = messageData[key];
        }
        responseData = Object.assign(mailBaseData, responseData);
        return {
            json: responseData,
            binary: Object.keys(binaryData).length ? binaryData : undefined,
        };
    });
}
exports.parseRawEmail = parseRawEmail;
//------------------------------------------------------------------------------------------------------------------------------------------
// This function converts an email object into a MIME encoded email and then converts that string into base64 encoding
// for more info on MIME, https://docs.microsoft.com/en-us/previous-versions/office/developer/exchange-server-2010/aa494197(v%3Dexchg.140)
//------------------------------------------------------------------------------------------------------------------------------------------
function encodeEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        let mailBody;
        const mailOptions = {
            from: email.from,
            to: email.to,
            cc: email.cc,
            bcc: email.bcc,
            replyTo: email.inReplyTo,
            references: email.reference,
            subject: email.subject,
            text: email.body,
            keepBcc: true,
        };
        if (email.htmlBody) {
            mailOptions.html = email.htmlBody;
        }
        if (email.attachments !== undefined && Array.isArray(email.attachments) && email.attachments.length > 0) {
            const attachments = email.attachments.map((attachment) => ({
                filename: attachment.name,
                content: attachment.content,
                contentType: attachment.type,
                encoding: 'base64',
            }));
            mailOptions.attachments = attachments;
        }
        const mail = new mailComposer(mailOptions).compile();
        // by default the bcc headers are deleted when the mail is built.
        // So add keepBcc flag to averride such behaviour. Only works when
        // the flag is set after the compilation.
        //https://nodemailer.com/extras/mailcomposer/#bcc
        mail.keepBcc = true;
        mailBody = yield mail.build();
        return mailBody.toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    });
}
exports.encodeEmail = encodeEmail;
function googleApiRequestAllItems(propertyName, method, endpoint, body = {}, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const returnData = [];
        let responseData;
        query.maxResults = 100;
        do {
            responseData = yield googleApiRequest.call(this, method, endpoint, body, query);
            query.pageToken = responseData['nextPageToken'];
            returnData.push.apply(returnData, responseData[propertyName]);
        } while (responseData['nextPageToken'] !== undefined &&
            responseData['nextPageToken'] !== '');
        return returnData;
    });
}
exports.googleApiRequestAllItems = googleApiRequestAllItems;
function extractEmail(s) {
    const data = s.split('<')[1];
    return data.substring(0, data.length - 1);
}
exports.extractEmail = extractEmail;
function getAccessToken(credentials) {
    //https://developers.google.com/identity/protocols/oauth2/service-account#httprest
    const scopes = [
        'https://www.googleapis.com/auth/gmail.labels',
        'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
        'https://www.googleapis.com/auth/gmail.addons.current.message.action',
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.compose',
    ];
    const now = (0, moment_timezone_1.default)().unix();
    credentials.email = credentials.email.trim();
    const privateKey = credentials.privateKey.replace(/\\n/g, '\n').trim();
    const signature = jsonwebtoken_1.default.sign({
        'iss': credentials.email,
        'sub': credentials.delegatedEmail || credentials.email,
        'scope': scopes.join(' '),
        'aud': `https://oauth2.googleapis.com/token`,
        'iat': now,
        'exp': now + 3600,
    }, privateKey, {
        algorithm: 'RS256',
        header: {
            'kid': privateKey,
            'typ': 'JWT',
            'alg': 'RS256',
        },
    });
    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: signature,
        },
        uri: 'https://oauth2.googleapis.com/token',
        json: true,
    };
    //@ts-ignore
    return this.helpers.request(options);
}
