import express from "express";
import twilio from "twilio";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const incomingMessage = req.body.Body;
    const sender = req.body.From;

    console.log("WhatsApp Message:", incomingMessage);
    console.log("Sender:", sender);

    // Temporary AI response
    const aiReply = `Saarthi AI says: ${incomingMessage}`;

    const twiml = new twilio.twiml.MessagingResponse();

    twiml.message(aiReply);

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;