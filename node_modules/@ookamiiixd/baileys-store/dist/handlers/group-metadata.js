"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("@prisma/client/runtime");
const shared_1 = require("../shared");
const utils_1 = require("../utils");
function groupMetadataHandler(sessionId, event) {
    const model = (0, shared_1.usePrisma)().groupMetadata;
    const logger = (0, shared_1.useLogger)();
    let listening = false;
    const upsert = async (groups) => {
        const promises = [];
        for (const group of groups) {
            const data = (0, utils_1.transformPrisma)(group);
            promises.push(model.upsert({
                select: { pkId: true },
                create: Object.assign(Object.assign({}, data), { sessionId }),
                update: data,
                where: { sessionId_id: { id: group.id, sessionId } },
            }));
        }
        try {
            await Promise.all(promises);
        }
        catch (e) {
            logger.error(e, 'An error occured during groups upsert');
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
                    return logger.info({ update }, 'Got metadata update for non existent group');
                logger.error(e, 'An error occured during group metadata update');
            }
        }
    };
    const updateParticipant = async ({ id, action, participants, }) => {
        try {
            const metadata = ((await model.findFirst({
                select: { participants: true },
                where: { id, sessionId },
            })) || []);
            if (!metadata) {
                return logger.info({ update: { id, action, participants } }, 'Got participants update for non existent group');
            }
            switch (action) {
                case 'add':
                    metadata.participants.push(participants.map((id) => ({ id, isAdmin: false, isSuperAdmin: false })));
                    break;
                case 'demote':
                case 'promote':
                    for (const participant of metadata.participants) {
                        if (participants.includes(participant.id)) {
                            participant.isAdmin = action === 'promote';
                        }
                    }
                    break;
                case 'remove':
                    metadata.participants = metadata.participants.filter((p) => !participants.includes(p.id));
                    break;
            }
            await model.update({
                select: { pkId: true },
                data: (0, utils_1.transformPrisma)({ participants: metadata.participants }),
                where: { sessionId_id: { id, sessionId } },
            });
        }
        catch (e) {
            logger.error(e, 'An error occured during group participants update');
        }
    };
    const listen = () => {
        if (listening)
            return;
        event.on('groups.upsert', upsert);
        event.on('groups.update', update);
        event.on('group-participants.update', updateParticipant);
        listening = true;
    };
    const unlisten = () => {
        if (!listening)
            return;
        event.off('groups.upsert', upsert);
        event.off('groups.update', update);
        event.off('group-participants.update', updateParticipant);
        listening = false;
    };
    return { listen, unlisten };
}
exports.default = groupMetadataHandler;
