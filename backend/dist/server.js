"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const twilio_1 = __importDefault(require("twilio"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const incomingMessage = req.body.Body;
        const sender = req.body.From;
        console.log("WhatsApp Message:", incomingMessage);
        console.log("Sender:", sender);
        // Temporary AI response
        const aiReply = `Saarthi AI says: ${incomingMessage}`;
        const twiml = new twilio_1.default.twiml.MessagingResponse();
        twiml.message(aiReply);
        res.writeHead(200, { "Content-Type": "text/xml" });
        res.end(twiml.toString());
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});
exports.default = router;
