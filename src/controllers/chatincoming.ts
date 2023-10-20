import { serializePrisma } from 'baileys-store';
import type { RequestHandler } from 'express';
import { logger, prisma } from '../shared';

export const chatincoming : RequestHandler = async (req, res) => {
    try{
      const { sessionId } = req.params;
      const chatincoming = (
        await prisma.chatIncoming.findMany({
          where: {sessionId: sessionId},
          orderBy: {createdAt: 'desc'},
        })
      ).map((m) => serializePrisma(m));
  
      res.status(200).json({
        data: chatincoming,
      })
    }
    catch(e){
      const chatincoming = 'An error occured during chat chatincoming';
      logger.error(e, chatincoming);
      res.status(500).json({ error: chatincoming });
    }
  };