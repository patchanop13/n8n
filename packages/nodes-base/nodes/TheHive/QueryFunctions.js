"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainsString = exports.EndsWith = exports.StartsWith = exports.Like = exports.queryString = exports.Type = exports.Child = exports.Parent = exports.ParentId = exports.Between = exports.Id = exports.Contains = exports.In = exports.Not = exports.Or = exports.And = exports.Lte = exports.Lt = exports.Gte = exports.Gt = exports.Eq = void 0;
// Query Functions
function Eq(field, value) {
    return { '_field': field, '_value': value };
}
exports.Eq = Eq;
function Gt(field, value) {
    return { '_gt': { field: value } };
}
exports.Gt = Gt;
function Gte(field, value) {
    return { '_gte': { field: value } };
}
exports.Gte = Gte;
function Lt(field, value) {
    return { '_lt': { field: value } };
}
exports.Lt = Lt;
function Lte(field, value) {
    return { '_lte': { field: value } };
}
exports.Lte = Lte;
function And(...criteria) {
    return { '_and': criteria };
}
exports.And = And;
function Or(...criteria) {
    return { '_or': criteria };
}
exports.Or = Or;
function Not(criteria) {
    return { '_not': criteria };
}
exports.Not = Not;
function In(field, values) {
    return { '_in': { '_field': field, '_values': values } };
}
exports.In = In;
function Contains(field) {
    return { '_contains': field };
}
exports.Contains = Contains;
function Id(id) {
    return { '_id': id };
}
exports.Id = Id;
function Between(field, fromValue, toValue) {
    return { '_between': { '_field': field, '_from': fromValue, '_to': toValue } };
}
exports.Between = Between;
function ParentId(tpe, id) {
    return { '_parent': { '_type': tpe, '_id': id } };
}
exports.ParentId = ParentId;
function Parent(tpe, criterion) {
    return { '_parent': { '_type': tpe, '_query': criterion } };
}
exports.Parent = Parent;
function Child(tpe, criterion) {
    return { '_child': { '_type': tpe, '_query': criterion } };
}
exports.Child = Child;
function Type(tpe) {
    return { '_type': tpe };
}
exports.Type = Type;
function queryString(queryString) {
    return { '_string': queryString };
}
exports.queryString = queryString;
function Like(field, value) {
    return { '_like': { '_field': field, '_value': value } };
}
exports.Like = Like;
function StartsWith(field, value) {
    if (!value.startsWith('*')) {
        value = value + '*';
    }
    return { '_wildcard': { '_field': field, '_value': value } };
}
exports.StartsWith = StartsWith;
function EndsWith(field, value) {
    if (!value.endsWith('*')) {
        value = '*' + value;
    }
    return { '_wildcard': { '_field': field, '_value': value } };
}
exports.EndsWith = EndsWith;
function ContainsString(field, value) {
    if (!value.endsWith('*')) {
        value = value + '*';
    }
    if (!value.startsWith('*')) {
        value = '*' + value;
    }
    return { '_wildcard': { '_field': field, '_value': value } };
}
exports.ContainsString = ContainsString;
