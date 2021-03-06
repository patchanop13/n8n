"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableDataType = exports.ObservableStatus = void 0;
var ObservableStatus;
(function (ObservableStatus) {
    ObservableStatus["OK"] = "Ok";
    ObservableStatus["DELETED"] = "Deleted";
})(ObservableStatus = exports.ObservableStatus || (exports.ObservableStatus = {}));
var ObservableDataType;
(function (ObservableDataType) {
    ObservableDataType["domain"] = "domain";
    ObservableDataType["file"] = "file";
    ObservableDataType["filename"] = "filename";
    ObservableDataType["fqdn"] = "fqdn";
    ObservableDataType["hash"] = "hash";
    ObservableDataType["ip"] = "ip";
    ObservableDataType["mail"] = "mail";
    ObservableDataType["mail_subject"] = "mail_subject";
    ObservableDataType["other"] = "other";
    ObservableDataType["regexp"] = "regexp";
    ObservableDataType["registry"] = "registry";
    ObservableDataType["uri_path"] = "uri_path";
    ObservableDataType["url"] = "url";
    ObservableDataType["user-agent"] = "user-agent";
})(ObservableDataType = exports.ObservableDataType || (exports.ObservableDataType = {}));
