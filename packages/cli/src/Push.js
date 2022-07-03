"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstance = exports.Push = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// @ts-ignore
const sse_channel_1 = __importDefault(require("sse-channel"));
const n8n_workflow_1 = require("n8n-workflow");
class Push {
    constructor() {
        this.connections = {};
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, new-cap
        this.channel = new sse_channel_1.default({
            cors: {
                // Allow access also from frontend when developing
                origins: ['http://localhost:8080'],
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.channel.on('disconnect', (channel, res) => {
            if (res.req !== undefined) {
                n8n_workflow_1.LoggerProxy.debug(`Remove editor-UI session`, { sessionId: res.req.query.sessionId });
                delete this.connections[res.req.query.sessionId];
            }
        });
    }
    /**
     * Adds a new push connection
     *
     * @param {string} sessionId The id of the session
     * @param {express.Request} req The request
     * @param {express.Response} res The response
     * @memberof Push
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    add(sessionId, req, res) {
        n8n_workflow_1.LoggerProxy.debug(`Add editor-UI session`, { sessionId });
        if (this.connections[sessionId] !== undefined) {
            // Make sure to remove existing connection with the same session
            // id if one exists already
            this.connections[sessionId].end();
            this.channel.removeClient(this.connections[sessionId]);
        }
        this.connections[sessionId] = res;
        this.channel.addClient(req, res);
    }
    /**
     * Sends data to the client which is connected via a specific session
     *
     * @param {string} sessionId The session id of client to send data to
     * @param {string} type Type of data to send
     * @param {*} data
     * @memberof Push
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    send(type, data, sessionId) {
        if (sessionId !== undefined && this.connections[sessionId] === undefined) {
            n8n_workflow_1.LoggerProxy.error(`The session "${sessionId}" is not registred.`, { sessionId });
            return;
        }
        n8n_workflow_1.LoggerProxy.debug(`Send data of type "${type}" to editor-UI`, { dataType: type, sessionId });
        const sendData = {
            type,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            data,
        };
        if (sessionId === undefined) {
            // Send to all connected clients
            this.channel.send(JSON.stringify(sendData));
        }
        else {
            // Send only to a specific client
            this.channel.send(JSON.stringify(sendData), [this.connections[sessionId]]);
        }
    }
}
exports.Push = Push;
let activePushInstance;
function getInstance() {
    if (activePushInstance === undefined) {
        activePushInstance = new Push();
    }
    return activePushInstance;
}
exports.getInstance = getInstance;
