"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializePrisma = exports.transformPrisma = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const long_1 = __importDefault(require("long"));
/** Transform object props value into Prisma-supported types */
function transformPrisma(data, removeNullable = true) {
    const obj = Object.assign({}, data);
    for (const [key, val] of Object.entries(obj)) {
        if (val instanceof Uint8Array) {
            obj[key] = Buffer.from(val);
        }
        else if (typeof val === 'number' || val instanceof long_1.default) {
            obj[key] = (0, baileys_1.toNumber)(val);
        }
        else if (removeNullable && (typeof val === 'undefined' || val === null)) {
            delete obj[key];
        }
    }
    return obj;
}
exports.transformPrisma = transformPrisma;
/** Transform prisma result into JSON serializable types */
function serializePrisma(data, removeNullable = true) {
    const obj = Object.assign({}, data);
    for (const [key, val] of Object.entries(obj)) {
        if (val instanceof Buffer) {
            obj[key] = val.toJSON();
        }
        else if (typeof val === 'bigint' || val instanceof BigInt) {
            obj[key] = val.toString();
        }
        else if (removeNullable && (typeof val === 'undefined' || val === null)) {
            delete obj[key];
        }
    }
    return obj;
}
exports.serializePrisma = serializePrisma;
