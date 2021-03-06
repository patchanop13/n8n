"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableDataType = exports.TLP = exports.JobStatus = void 0;
var JobStatus;
(function (JobStatus) {
    JobStatus["WAITING"] = "Waiting";
    JobStatus["INPROGRESS"] = "InProgress";
    JobStatus["SUCCESS"] = "Success";
    JobStatus["FAILURE"] = "Failure";
    JobStatus["DELETED"] = "Deleted";
})(JobStatus = exports.JobStatus || (exports.JobStatus = {}));
var TLP;
(function (TLP) {
    TLP[TLP["white"] = 0] = "white";
    TLP[TLP["green"] = 1] = "green";
    TLP[TLP["amber"] = 2] = "amber";
    TLP[TLP["red"] = 3] = "red";
})(TLP = exports.TLP || (exports.TLP = {}));
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
