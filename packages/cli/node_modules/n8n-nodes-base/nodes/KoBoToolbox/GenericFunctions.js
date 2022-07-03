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
exports.loadForms = exports.downloadAttachments = exports.formatSubmission = exports.parseStringList = exports.koBoToolboxApiRequest = void 0;
const lodash_1 = __importDefault(require("lodash"));
function koBoToolboxApiRequest(option = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield this.getCredentials('koBoToolboxApi');
        // Set up pagination / scrolling
        const returnAll = !!option.returnAll;
        if (returnAll) {
            // Override manual pagination options
            lodash_1.default.set(option, 'qs.limit', 3000);
            // Don't pass this custom param to helpers.httpRequest
            delete option.returnAll;
        }
        const options = {
            url: '',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Token ${credentials.token}`,
            },
            json: true,
        };
        if (Object.keys(option)) {
            Object.assign(options, option);
        }
        if (options.url && !/^http(s)?:/.test(options.url)) {
            options.url = credentials.URL + options.url;
        }
        let results = null;
        let keepLooking = true;
        while (keepLooking) {
            const response = yield this.helpers.httpRequest(options);
            // Append or set results
            results = response.results ? lodash_1.default.concat(results || [], response.results) : response;
            if (returnAll && response.next) {
                options.url = response.next;
                continue;
            }
            else {
                keepLooking = false;
            }
        }
        return results;
    });
}
exports.koBoToolboxApiRequest = koBoToolboxApiRequest;
function parseGeoPoint(geoPoint) {
    // Check if it looks like a "lat lon z precision" flat string e.g. "-1.931161 30.079811 0 0" (lat, lon, elevation, precision)
    const coordinates = lodash_1.default.split(geoPoint, ' ');
    if (coordinates.length >= 2 && lodash_1.default.every(coordinates, coord => coord && /^-?\d+(?:\.\d+)?$/.test(lodash_1.default.toString(coord)))) {
        // NOTE: GeoJSON uses lon, lat, while most common systems use lat, lon order!
        return lodash_1.default.concat([
            lodash_1.default.toNumber(coordinates[1]),
            lodash_1.default.toNumber(coordinates[0]),
        ], lodash_1.default.toNumber(coordinates[2]) ? lodash_1.default.toNumber(coordinates[2]) : []);
    }
    return null;
}
function parseStringList(value) {
    return lodash_1.default.split(lodash_1.default.toString(value), /[\s,]+/);
}
exports.parseStringList = parseStringList;
const matchWildcard = (value, pattern) => {
    const regex = new RegExp(`^${lodash_1.default.escapeRegExp(pattern).replace('\\*', '.*')}$`);
    return regex.test(value);
};
const formatValue = (value, format) => {
    if (lodash_1.default.isString(value)) {
        // Sanitize value
        value = lodash_1.default.toString(value);
        // Parse geoPoints
        const geoPoint = parseGeoPoint(value);
        if (geoPoint) {
            return {
                type: 'Point',
                coordinates: geoPoint,
            };
        }
        // Check if it's a closed polygon geo-shape: -1.954117 30.085159 0 0;-1.955005 30.084622 0 0;-1.956057 30.08506 0 0;-1.956393 30.086229 0 0;-1.955853 30.087143 0 0;-1.954609 30.08725 0 0;-1.953966 30.086735 0 0;-1.953805 30.085897 0 0;-1.954117 30.085159 0 0
        const points = value.split(';');
        if (points.length >= 2 && /^[-\d\.\s;]+$/.test(value)) {
            // Using the GeoJSON format as per https://geojson.org/
            const coordinates = lodash_1.default.compact(points.map(parseGeoPoint));
            // Only return if all values are properly parsed
            if (coordinates.length === points.length) {
                return {
                    type: lodash_1.default.first(points) === lodash_1.default.last(points) ? 'Polygon' : 'LineString',
                    coordinates,
                };
            }
        }
        // Parse numbers
        if ('number' === format) {
            return lodash_1.default.toNumber(value);
        }
        // Split multi-select
        if ('multiSelect' === format) {
            return lodash_1.default.split(lodash_1.default.toString(value), ' ');
        }
    }
    return value;
};
function formatSubmission(submission, selectMasks = [], numberMasks = []) {
    // Create a shallow copy of the submission
    const response = {};
    for (const key of Object.keys(submission)) {
        let value = lodash_1.default.clone(submission[key]);
        // Sanitize key names: split by group, trim _
        const sanitizedKey = key.split('/').map(k => lodash_1.default.trim(k, ' _')).join('.');
        const leafKey = sanitizedKey.split('.').pop() || '';
        let format = 'string';
        if (lodash_1.default.some(numberMasks, mask => matchWildcard(leafKey, mask))) {
            format = 'number';
        }
        if (lodash_1.default.some(selectMasks, mask => matchWildcard(leafKey, mask))) {
            format = 'multiSelect';
        }
        value = formatValue(value, format);
        lodash_1.default.set(response, sanitizedKey, value);
    }
    // Reformat _geolocation
    if (lodash_1.default.isArray(response.geolocation) && response.geolocation.length === 2 && response.geolocation[0] && response.geolocation[1]) {
        response.geolocation = {
            type: 'Point',
            coordinates: [response.geolocation[1], response.geolocation[0]],
        };
    }
    return response;
}
exports.formatSubmission = formatSubmission;
function downloadAttachments(submission, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // Initialize return object with the original submission JSON content
        const binaryItem = {
            json: Object.assign({}, submission),
            binary: {},
        };
        const credentials = yield this.getCredentials('koBoToolboxApi');
        // Look for attachment links - there can be more than one
        const attachmentList = (submission['_attachments'] || submission['attachments']); // tslint:disable-line:no-any
        if (attachmentList && attachmentList.length) {
            for (const [index, attachment] of attachmentList.entries()) {
                // look for the question name linked to this attachment
                const filename = attachment.filename;
                let relatedQuestion = null;
                if ('question' === options.binaryNamingScheme) {
                    Object.keys(submission).forEach(question => {
                        if (filename.endsWith('/' + lodash_1.default.toString(submission[question]).replace(/\s/g, '_'))) {
                            relatedQuestion = question;
                        }
                    });
                }
                // Download attachment
                // NOTE: this needs to follow redirects (possibly across domains), while keeping Authorization headers
                // The Axios client will not propagate the Authorization header on redirects (see https://github.com/axios/axios/issues/3607), so we need to follow ourselves...
                let response = null;
                const attachmentUrl = attachment[options.version] || attachment.download_url;
                let final = false, redir = 0;
                const axiosOptions = {
                    url: attachmentUrl,
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${credentials.token}`,
                    },
                    ignoreHttpStatusErrors: true,
                    returnFullResponse: true,
                    disableFollowRedirect: true,
                    encoding: 'arraybuffer',
                };
                while (!final && redir < 5) {
                    response = yield this.helpers.httpRequest(axiosOptions);
                    if (response && response.headers.location) {
                        // Follow redirect
                        axiosOptions.url = response.headers.location;
                        redir++;
                    }
                    else {
                        final = true;
                    }
                }
                if (response && response.body) {
                    // Use the provided prefix if any, otherwise try to use the original question name
                    let binaryName;
                    if ('question' === options.binaryNamingScheme && relatedQuestion) {
                        binaryName = relatedQuestion;
                    }
                    else {
                        binaryName = `${options.dataPropertyAttachmentsPrefixName || 'attachment_'}${index}`;
                    }
                    const fileName = filename.split('/').pop();
                    binaryItem.binary[binaryName] = yield this.helpers.prepareBinaryData(response.body, fileName);
                }
            }
        }
        else {
            delete binaryItem.binary;
        }
        // Add item to final output - even if there's no attachment retrieved
        return binaryItem;
    });
}
exports.downloadAttachments = downloadAttachments;
function loadForms() {
    return __awaiter(this, void 0, void 0, function* () {
        const responseData = yield koBoToolboxApiRequest.call(this, {
            url: '/api/v2/assets/',
            qs: {
                q: 'asset_type:survey',
                ordering: 'name',
            },
            scroll: true,
        });
        return (responseData === null || responseData === void 0 ? void 0 : responseData.map((survey) => ({ name: survey.name, value: survey.uid }))) || []; // tslint:disable-line:no-any
    });
}
exports.loadForms = loadForms;
