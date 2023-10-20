"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("@prisma/client/runtime");
const shared_1 = require("../shared");
const utils_1 = require("../utils");
function chatHandler(sessionId, event) {
    const model = (0, shared_1.usePrisma)().chat;
    const logger = (0, shared_1.useLogger)();
    let listening = false;
    const set = async ({ chats, isLatest }) => {
        try {
            if (isLatest) {
                await model.deleteMany({ where: { sessionId } });
            }
            const existingIds = (await model.findMany({
                select: { id: true },
                where: { id: { in: chats.map((c) => c.id) }, sessionId },
            })).map((i) => i.id);
            const chatsAdded = (await model.createMany({
                data: chats
                    .filter((c) => !existingIds.includes(c.id))
                    .map((c) => (Object.assign(Object.assign({}, (0, utils_1.transformPrisma)(c)), { sessionId }))),
            })).count;
            logger.info({ chatsAdded }, 'Synced chats');
        }
        catch (e) {
            logger.error(e, 'An error occured during chats set');
        }
    };
    const upsert = async (chats) => {
        const promises = [];
        for (const chat of chats) {
            const data = (0, utils_1.transformPrisma)(chat);
            promises.push(model.upsert({
                select: { pkId: true },
                create: Object.assign(Object.assign({}, data), { sessionId }),
                update: data,
                where: { sessionId_id: { id: chat.id, sessionId } },
            }));
        }
        try {
            await Promise.all(promises);
        }
        catch (e) {
            logger.error(e, 'An error occured during chats upsert');
        }
    };
    const update = async (updates) => {
        var _a;
        for (const update of updates) {
            try {
                const chat = await model.findFirst({
                    select: { unreadCount: true },
                    where: { id: update.id, sessionId },
                });
                if (!chat) {
                    return logger.info({ update }, 'Got update for non existent chat');
                }
                const data = (0, utils_1.transformPrisma)(update);
                await model.update({
                    select: { pkId: true },
                    data: Object.assign(Object.assign({}, data), { unreadCount: data.unreadCount && data.unreadCount > 0
                            ? ((_a = chat === null || chat === void 0 ? void 0 : chat.unreadCount) !== null && _a !== void 0 ? _a : 0) + data.unreadCount
                            : undefined }),
                    where: { sessionId_id: { id: update.id, sessionId } },
                });
            }
            catch (e) {
                if (e instanceof runtime_1.PrismaClientKnownRequestError && e.code === 'P2025')
                    return logger.info({ update }, 'Got update for non existent chat');
                logger.error(e, 'An error occured during chat update');
            }
        }
    };
    const del = async (ids) => {
        try {
            await model.deleteMany({
                where: { id: { in: ids } },
            });
        }
        catch (e) {
            logger.error(e, 'An error occured during chats delete');
        }
    };
    const listen = () => {
        if (listening)
            return;
        event.on('messaging-history.set', set);
        event.on('chats.upsert', upsert);
        event.on('chats.update', update);
        event.on('chats.delete', del);
        listening = true;
    };
    const unlisten = () => {
        if (!listening)
            return;
        event.off('messaging-history.set', set);
        event.off('chats.upsert', upsert);
        event.off('chats.update', update);
        event.off('chats.delete', del);
        listening = false;
    };
    return { listen, unlisten };
}
exports.default = chatHandler;
