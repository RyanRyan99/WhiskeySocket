"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = exports.initStore = void 0;
const shared_1 = require("./shared");
const handlers = __importStar(require("./handlers"));
/** Initialize shared instances that will be consumed by the Store instance */
function initStore({ prisma, logger }) {
    (0, shared_1.setPrisma)(prisma);
    (0, shared_1.setLogger)(logger);
}
exports.initStore = initStore;
class Store {
    constructor(sessionId, event) {
        this.chatHandler = handlers.chatHandler(sessionId, event);
        this.messageHandler = handlers.messageHandler(sessionId, event);
        this.contactHandler = handlers.contactHandler(sessionId, event);
        this.groupMetadataHandler = handlers.groupMetadataHandler(sessionId, event);
        this.listen();
    }
    /** Start listening to the events */
    listen() {
        this.chatHandler.listen();
        this.messageHandler.listen();
        this.contactHandler.listen();
        this.groupMetadataHandler.listen();
    }
    /** Stop listening to the events */
    unlisten() {
        this.chatHandler.unlisten();
        this.messageHandler.unlisten();
        this.contactHandler.unlisten();
        this.groupMetadataHandler.unlisten();
    }
}
exports.Store = Store;
