const express = require('express');
const router = express.Router();
const { callOpenAI } = require('../services/openaiService');
const { Conversation } = require('../models/conversation');
const { Room } = require('../models/room');

router.post('/', async (req, res) => {
    const { userId, message } = req.body;
    const messages = [{ role: 'system', content: "message" },{ role: 'user', content: message }];
    const tools = [
        {
            "type": "function",
            "function": {
                "name": "get_room_options",
                "description": "Fetch available room options",
                
            },
            "required":[],
        }
    ];

    console.log("Messages routes: ", messages);
    console.log("Tools routes: ", tools); // Add this line


    try {
        const responseMessage = await callOpenAI(messages, tools);
        const toolCalls = responseMessage.tool_calls;

        if (toolCalls) {
            const availableFunctions = {
                get_room_options: getRoomOptions
            };

            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionToCall = availableFunctions[functionName];
                const functionResponse = functionToCall();
                messages.push({
                    "tool_call_id": toolCall.id,
                    "role": "tool",
                    "name": functionName,
                    "content": functionResponse,
                });
            }

            const finalResponse = await callOpenAI(messages);
            await Conversation.create({ userId, message, response: finalResponse.content });
            res.json({ response: finalResponse.content });
        } else {
            await Conversation.create({ userId, message, response: responseMessage.content });
            res.json({ response: responseMessage.content });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function getRoomOptions() {
    const rooms = [
        { roomType: "Single", price: 100, availability: true },
        { roomType: "Double", price: 150, availability: true },
        { roomType: "Suite", price: 300, availability: false }
    ];
    return JSON.stringify({ rooms });
}

module.exports = router;
