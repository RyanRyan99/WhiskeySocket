"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_1 = require("../whatsapp");
const validate = (req, res, next) => {
    if (!(0, whatsapp_1.sessionExists)(req.params.sessionId))
        return res.status(404).json({ error: 'Session not found' });
    next();
};
exports.default = validate;
