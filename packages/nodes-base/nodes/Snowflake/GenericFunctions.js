"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyInputItems = exports.execute = exports.destroy = exports.connect = void 0;
function connect(conn) {
    return new Promise((resolve, reject) => {
        conn.connect((err, conn) => {
            if (!err) {
                // @ts-ignore
                resolve();
            }
            else {
                reject(err);
            }
        });
    });
}
exports.connect = connect;
function destroy(conn) {
    return new Promise((resolve, reject) => {
        conn.destroy((err, conn) => {
            if (!err) {
                // @ts-ignore
                resolve();
            }
            else {
                reject(err);
            }
        });
    });
}
exports.destroy = destroy;
function execute(conn, sqlText, binds) {
    return new Promise((resolve, reject) => {
        conn.execute({
            sqlText,
            binds,
            complete: (err, stmt, rows) => {
                if (!err) {
                    resolve(rows);
                }
                else {
                    reject(err);
                }
            },
        });
    });
}
exports.execute = execute;
function copyInputItems(items, properties) {
    // Prepare the data to insert and copy it to be returned
    let newItem;
    return items.map((item) => {
        newItem = {};
        for (const property of properties) {
            if (item.json[property] === undefined) {
                newItem[property] = null;
            }
            else {
                newItem[property] = JSON.parse(JSON.stringify(item.json[property]));
            }
        }
        return newItem;
    });
}
exports.copyInputItems = copyInputItems;
