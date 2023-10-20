"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatincoming = void 0;
const baileys_store_1 = require("baileys-store");
const shared_1 = require("../shared");
const chatincoming = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const chatincoming = (await shared_1.prisma.chatIncoming.findMany({
            where: { sessionId: sessionId },
            orderBy: { createdAt: 'desc' },
        })).map((m) => (0, baileys_store_1.serializePrisma)(m));
        res.status(200).json({
            data: chatincoming,
        });
    }
    catch (e) {
        const chatincoming = 'An error occured during chat chatincoming';
        shared_1.logger.error(e, chatincoming);
        res.status(500).json({ error: chatincoming });
    }
};
exports.chatincoming = chatincoming;
