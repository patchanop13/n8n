"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseImpactStatus = exports.CaseResolutionStatus = exports.CaseStatus = void 0;
var CaseStatus;
(function (CaseStatus) {
    CaseStatus["OPEN"] = "Open";
    CaseStatus["RESOLVED"] = "Resolved";
    CaseStatus["DELETED"] = "Deleted";
})(CaseStatus = exports.CaseStatus || (exports.CaseStatus = {}));
var CaseResolutionStatus;
(function (CaseResolutionStatus) {
    CaseResolutionStatus["INDETERMINATE"] = "Indeterminate";
    CaseResolutionStatus["FALSEPOSITIVE"] = "FalsePositive";
    CaseResolutionStatus["TRUEPOSITIVE"] = "TruePositive";
    CaseResolutionStatus["OTHER"] = "Other";
    CaseResolutionStatus["DUPLICATED"] = "Duplicated";
})(CaseResolutionStatus = exports.CaseResolutionStatus || (exports.CaseResolutionStatus = {}));
var CaseImpactStatus;
(function (CaseImpactStatus) {
    CaseImpactStatus["NOIMPACT"] = "NoImpact";
    CaseImpactStatus["WITHIMPACT"] = "WithImpact";
    CaseImpactStatus["NOTAPPLICABLE"] = "NotApplicable";
})(CaseImpactStatus = exports.CaseImpactStatus || (exports.CaseImpactStatus = {}));
