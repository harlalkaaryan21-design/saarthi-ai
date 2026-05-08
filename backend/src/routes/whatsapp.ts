import { Router } from "express";
import twilio from "twilio";
import prisma from "../prisma";

const router = Router();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID || "test_sid",
  process.env.TWILIO_AUTH_TOKEN || "test_token"
);

// Receive WhatsApp Message
router.post("/webhook", async (req, res) => {
  try {
    const { From, Body } = req.body; // From is usually 'whatsapp:+91...'

    // Look up or create user
    let user = await prisma.user.findUnique({
      where: { phoneNumber: From },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { phoneNumber: From },
      });
    }

    // Save message to conversation
    let conversation = await prisma.conversation.findFirst({
      where: { userId: user.id },
    });

    const newMessage = { role: "user", content: Body, timestamp: new Date().toISOString() };

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: user.id,
          messages: [newMessage],
        },
      });
    } else {
      const messages = conversation.messages as any[];
      messages.push(newMessage);
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { messages },
      });
    }

    // Agent response logic would go here
    const aiResponseText = `This is Saarthi AI. I received your message: "${Body}". I am processing it.`;

    // Send WhatsApp response
    await client.messages.create({
      body: aiResponseText,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: From,
    });

    // Save AI response
    const messages = conversation.messages as any[];
    messages.push({ role: "ai", content: aiResponseText, timestamp: new Date().toISOString() });
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { messages },
    });

    res.status(200).send("<Response></Response>");
  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
