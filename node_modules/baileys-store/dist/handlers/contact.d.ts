import type { BaileysEventEmitter } from '@whiskeysockets/baileys';
export default function contactHandler(sessionId: string, event: BaileysEventEmitter): {
    listen: () => void;
    unlisten: () => void;
};
