import type { BaileysEventEmitter, SocketConfig } from '@whiskeysockets/baileys';
import type { PrismaClient } from '@prisma/client';
type initStoreOptions = {
    /** Prisma client instance */
    prisma: PrismaClient;
    /** Baileys pino logger */
    logger?: SocketConfig['logger'];
};
/** Initialize shared instances that will be consumed by the Store instance */
export declare function initStore({ prisma, logger }: initStoreOptions): void;
export declare class Store {
    private readonly chatHandler;
    private readonly messageHandler;
    private readonly contactHandler;
    constructor(sessionId: string, event: BaileysEventEmitter);
    /** Start listening to the events */
    listen(): void;
    /** Stop listening to the events */
    unlisten(): void;
}
export {};
