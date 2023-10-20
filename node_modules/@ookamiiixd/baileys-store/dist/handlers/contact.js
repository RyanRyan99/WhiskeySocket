"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("@prisma/client/runtime");
const shared_1 = require("../shared");
const utils_1 = require("../utils");
function contactHandler(sessionId, event) {
    const model = (0, shared_1.usePrisma)().contact;
    const logger = (0, shared_1.useLogger)();
    let listening = false;
    const set = async ({ contacts }) => {
        try {
            const contactIds = contacts.map((c) => c.id);
            const deletedOldContactIds = (await model.findMany({
                select: { id: true },
                where: { id: { notIn: contactIds }, sessionId },
            })).map((c) => c.id);
            const promises = [];
            for (const contact of contacts) {
                const data = (0, utils_1.transformPrisma)(contact);
                promises.push(model.upsert({
                    create: Object.assign(Object.assign({}, data), { sessionId }),
                    update: data,
                    where: { sessionId_id: { id: contact.id, sessionId } },
                }));
            }
            await Promise.all([
                Promise.all(promises),
                model.deleteMany({ where: { id: { in: deletedOldContactIds }, sessionId } }),
            ]);
            logger.info({ deletedContacts: deletedOldContactIds.length, newContacts: contacts.length }, 'Synced contacts');
        }
        catch (e) {
            logger.error(e, 'An error occured during contacts set');
        }
    };
    const upsert = async (contacts) => {
        const promises = [];
        for (const contact of contacts) {
            const data = (0, utils_1.transformPrisma)(contact);
            promises.push(model.upsert({
                select: { pkId: true },
                create: Object.assign(Object.assign({}, data), { sessionId }),
                update: data,
                where: { sessionId_id: { id: contact.id, sessionId } },
            }));
        }
        try {
            await Promise.all(promises);
        }
        catch (e) {
            logger.error(e, 'An error occured during contacts upsert');
        }
    };
    const update = async (updates) => {
        for (const update of updates) {
            try {
                await model.update({
                    select: { pkId: true },
                    data: (0, utils_1.transformPrisma)(update),
                    where: { sessionId_id: { id: update.id, sessionId } },
                });
            }
            catch (e) {
                if (e instanceof runtime_1.PrismaClientKnownRequestError && e.code === 'P2025')
                    return logger.info({ update }, 'Got update for non existent contact');
                logger.error(e, 'An error occured during contact update');
            }
        }
    };
    const listen = () => {
        if (listening)
            return;
        event.on('messaging-history.set', set);
        event.on('contacts.upsert', upsert);
        event.on('contacts.update', update);
        listening = true;
    };
    const unlisten = () => {
        if (!listening)
            return;
        event.off('messaging-history.set', set);
        event.off('contacts.upsert', upsert);
        event.off('contacts.update', update);
        listening = false;
    };
    return { listen, unlisten };
}
exports.default = contactHandler;
