import type { BaileysEventEmitter } from '@whiskeysockets/baileys';
export default function messageHandler(sessionId: string, event: BaileysEventEmitter): {
    listen: () => void;
    unlisten: () => void;
};
