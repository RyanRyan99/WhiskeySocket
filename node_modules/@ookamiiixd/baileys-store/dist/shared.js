"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLogger = exports.usePrisma = exports.setLogger = exports.setPrisma = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
let prisma = null;
let logger = null;
function setPrisma(prismaClient) {
    prisma = prismaClient;
}
exports.setPrisma = setPrisma;
function setLogger(pinoLogger) {
    logger = pinoLogger || baileys_1.DEFAULT_CONNECTION_CONFIG.logger;
}
exports.setLogger = setLogger;
function usePrisma() {
    (0, tiny_invariant_1.default)(prisma, 'Prisma client cannot be used before initialization');
    return prisma;
}
exports.usePrisma = usePrisma;
function useLogger() {
    (0, tiny_invariant_1.default)(logger, 'Pino logger cannot be used before initialization');
    return logger;
}
exports.useLogger = useLogger;
