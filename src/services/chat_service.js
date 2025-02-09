
require('dotenv').config();
const { OpenAI } = require('openai');

const { default: axios } = require('axios');
const { prompt } = require('./instruction');
const { getRoomOptions, bookRoom } = require('./toolsService');

const api = process.env.OPENAI_API_KEY;
const openai = new OpenAI(
    { apiKey: api }
);

let allMessages = [];

// allMessages.push({ role: "system", content: prompt });

const tools = [
    {
        "type": "function",
        "function": {
            "name": "getRoomOptions",
            "description": "Fetch available room options for booking.",
        },
    },
    {
        "type": "function",
        "function": {
            "name": "bookRoom",
            "description": "Book a room for a guest. This function books a room for a guest. You need to provide the room ID, guest's full name, email, and the number of nights to book the room for. The function returns the booking confirmation details. The parameters must be JSON encoded.",
            "parameters": {
                "type": "object",
                "properties": {
                    "roomId": {
                        "type": "number",
                        "description": "The room id to book according to the room options.The user will select the room from the room options provided by the getRoomOptions function. ",
                    },
                    "fullName": {
                        "type": "string",
                        "description": "The full name of the guest",
                    },
                    "email": {
                        "type": "string",
                        "description": "The email of the guest",
                    },
                    "nights": {
                        "type": "number",
                        "description": "The number of nights to book the room for",
                    },
                },
            },
            "required" : ["roomId", "fullName", "email", "nights"]
        }
    },
];

const getBotResponse = async (message) => {
    allMessages.push({ role: "user", content: message });

    console.log("--------------------------------------------------");
    console.log(allMessages);

    // for (let i = 0; i < allMessages.length; i++) {
    //     if (allMessages[i].content == null) {
    //         throw new Error(`Invalid value for 'content': expected a string, got ${allMessages[i].content}`);
    //     }
    // }

    let response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {role: "system", content: prompt},
            ...allMessages,
        ],
        tools: tools,
        tool_choice: "auto"
    });

    console.log("BODY", response.choices[0].message);

    let responseMessage = response.choices[0].message;

    allMessages.push(responseMessage);

    const toolCalls = responseMessage.tool_calls;

    if (toolCalls) {
        
            const functionName = toolCalls[0].function.name;
            const tool_call_id = toolCalls[0].id;
            
            const functionParams = JSON.parse(toolCalls[0].function.arguments);
            
        

            if(functionName == "bookRoom") {
            const functionResponse = await bookRoom(functionParams.roomId, functionParams.fullName, functionParams.email, functionParams.nights);
            allMessages.push({
                "role": "tool",
                "tool_call_id": tool_call_id,
                "name": functionName,
                "content": JSON.stringify(functionResponse),
            });
        

        response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {role: "system", content: prompt},
                ...allMessages,
            ],
        });

        let reply = response.choices[0].message;

        allMessages.push(reply);
        return reply.content;

    } else if(functionName == "getRoomOptions") {
        const getRoom = await getRoomOptions();
        console.log("getRoom", getRoom);
        allMessages.push({
            "role": "tool",
            "tool_call_id": tool_call_id,
            "name": functionName,
            "content": JSON.stringify(getRoom),
        });

        response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {role: "system", content: prompt},
                ...allMessages,
            ],
        });

        let reply = response.choices[0].message;

        allMessages.push(reply);
        return reply.content;

    }
    else{
        return "No functions found with the name: " + functionNam;
    }


    } 
    else {
        allMessages.push(responseMessage);
        return responseMessage.content;
    }
}



module.exports = { getBotResponse };