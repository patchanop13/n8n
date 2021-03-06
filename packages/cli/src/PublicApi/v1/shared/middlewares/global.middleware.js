"use strict";
/* eslint-disable @typescript-eslint/no-invalid-void-type */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validCursor = exports.authorize = void 0;
const pagination_service_1 = require("../services/pagination.service");
const authorize = (authorizedRoles) => (req, res, next) => {
    const { name } = req.user.globalRole;
    if (!authorizedRoles.includes(name)) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    return next();
};
exports.authorize = authorize;
const validCursor = (req, res, next) => {
    if (req.query.cursor) {
        const { cursor } = req.query;
        try {
            const paginationData = (0, pagination_service_1.decodeCursor)(cursor);
            if ('offset' in paginationData) {
                req.query.offset = paginationData.offset;
                req.query.limit = paginationData.limit;
            }
            else {
                req.query.lastId = paginationData.lastId;
                req.query.limit = paginationData.limit;
            }
        }
        catch (error) {
            return res.status(400).json({
                message: 'An invalid cursor was provided',
            });
        }
    }
    return next();
};
exports.validCursor = validCursor;
