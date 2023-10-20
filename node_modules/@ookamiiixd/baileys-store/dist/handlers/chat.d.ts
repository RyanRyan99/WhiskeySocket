import type { BaileysEventEmitter } from '@whiskeysockets/baileys';
export default function chatHandler(sessionId: string, event: BaileysEventEmitter): {
    listen: () => void;
    unlisten: () => void;
};
