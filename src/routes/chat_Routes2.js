const express = require('express');
const router = express.Router();
const { Conversation } = require('../models/conversation');

const { getBotResponse  } = require('../services/chat_service');


router.post('/', async (req, res) => {
    const { userId, message } = req.body;
    
    const responseMessage = await getBotResponse(message);

    
    await Conversation.create({ userId, message, response: responseMessage });

    res.json({ response: responseMessage });
});



module.exports = router;
