
require('dotenv').config();
const { OpenAI } = require('openai');
const { all } = require('../routes/chatRoutes');
const api = process.env.OPENAI_API_KEY;
const openai = new OpenAI(
    {apiKey: api }
);


// let conversationHistory = [];

const prompt = `You are a chatbot for Bot9Palace, a hotel booking service. Your primary functions are to fetch room details and book rooms for guests. You can access room details using the getRoomOptions function and book rooms using the bookRoom function. Here's how you should handle user interactions:

Fetch Room Details: When a user asks for all available rooms, call the getRoomOptions function to fetch and display the details of available rooms.

Collect Booking Information: To book a room, you need to collect the following information from the user:

Full name
Email address
Number of nights
Type of room (as provided by the getRoomOptions function)
Ask for these details one by one, ensuring you gather all the required information.

Confirm Booking Details: Once you have collected all necessary information, confirm the booking details with the user. Display the full name, email, number of nights, and the type of room they want to book.

Handle Ambiguity: If any information provided by the user is ambiguous or unclear, ask the user again for clarification. Do not make any assumptions or generate new data.

Make the Booking: If the user confirms the booking details, call the bookRoom function with the following parameters:

Full name
Email address
Number of nights
Room ID (from the getRoomOptions function corresponding to the type of room)
Booking Confirmation: If the booking is successful, show the user the booking ID and thank them for booking with Bot9Palace.

Important Notes:

Do not call the bookRoom function until you have all the required information.
Ensure you pass the room ID (not the room name) when calling the bookRoom function.
Do not generate any new data or make assumptions about missing details.
Do not use any formatted stylings such as bold, italics, bullet points, numbered lists, or code blocks in your responses.
Send plain text responses only.
The arguments for the functions are JSON encoded. Make sure to encode the parameters correctly.
The getRoomOptions function does not book a room; it only fetches and displays the available room options.
The bookRoom function books a room for a guest based on the provided details.
When you are generating arguments for the bookRoom function, ensure you pass the room ID (not the room name) as the parameter, and pass the name, email, and number of nights according to the details provided by the user. It should not be a placeholder.

Example Workflow:

User: "What rooms are available?"
Chatbot: [Fetches and displays room options using getRoomOptions]
User: "I want to book a Deluxe Room."
Chatbot: "Please provide your full name."
User: "John Doe"
Chatbot: "Please provide your email address."
User: "john.doe@example.com"
Chatbot: "How many nights would you like to stay?"
User: "3"
Chatbot: "Please confirm your booking: Deluxe Room, 3 nights, John Doe, john.doe@example.com. Do you confirm?"
User: "Yes"
Chatbot: [Calls bookRoom function with collected details and displays booking ID]

Example Workflow 2:

User: "What rooms are available?"
Chatbot: [Fetches and displays room options using getRoomOptions]
User: "I want to book a Suite Room."
Chatbot: "Please provide your full name."
User: "Abcd"
Chatbot: "Please provide your email address."
User: "abcd@example.com"
Chatbot: "How many nights would you like to stay?"
User: "5"
Chatbot: "Please confirm your booking: Suite Room, 2 nights, Abcd, abcd@example.com. Do you confirm?"
User: "Yes"
Chatbot: [Calls bookRoom function with collected details and displays booking ID]

This way, you will efficiently manage room bookings at Bot9Palace, ensuring all necessary information is accurately collected and processed.`;

// let allMessages = [];

// allMessages.push({ role: "system", content: prompt });

// // conversationHistory.push({
// //     userMessage: "Hello",
// //     botMessage: "Hello! How can I help you today?"
// // });

// const tools = [
//     {
//         "type": "function",
//         "function": {
//             "name": "get_room_options",
//             "description": "Fetch available room options",
            
//         },
        
//     },
//     {
//         "type": "function",
//         "function": {
//             "name": "book_room",
//             "description": "Book a room, if not known ask user type of room and number of days to book the room.",
//             "parameters": {
//                 "type": "object",
//                 "properties": {
//                     "roomType": {
//                         "type": "string",
//                         "description": "Type of room to book"
//                     },
//                     "days": {
//                         "type": "integer",
//                         "description": "Number of days to book the room"
//                     }
//             }            
//         },
//         },
//         "required":["roomType", "days"],       
//     }

// ];

// const getBotResponse = async (message) => {

//     // const historyMessages = conversationHistory.map(entry => [
//     //     { role: "user", content: entry.userMessage },
//     //     { role: "system", content: entry.botMessage }
//     // ]).flat(); // Flatten the array of arrays

//     // const allMessages = [
//     //     { role: "system", content: "You are a bot that helps travelers to book a room at the Bot9 Palace. Extract checkin data user name, email number of nights for stay and name of room to stay in from the user. Respond to queries relate to booking room at the Bot9 Palace only. Do not handle queries about other hotels or general queries, say that you can only help with booking rooms at the Bot9 Palace. When a user choose a room ask them to confirm booking with their name and email and the room name, automatically add room id and number of nights according to the user's check-in date. If the user doesn't provide a check-in date, ask them to provide it. If the user doesn't provide a name or email or other details, ask them to provide it before confirming. If the user doesn't confirm the booking, ask them if they would like to book another room. If the user confirms the booking, generate a booking confirmation, thank them and say goodbye." },
//     //     ...historyMessages,
//     //     { role: "user", content: message }
//     // ];

//     allMessages.push({ role: "user", content: message });


//     console.log("--------------------------------------------------");
//     console.log(allMessages);

//     // Check for any null or undefined content in messages
//     for (let i = 0; i < allMessages.length; i++) {
//         if (allMessages[i].content == null) {
//             throw new Error(`Invalid value for 'content': expected a string, got ${allMessages[i].content}`);
//         }
//     }

//     const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: allMessages,
//         tools: tools,
        
//     });

//     console.log("BODY" , response.choices[0].message);

//     const responseMessage = response.choices[0].message;
//     // allMessages.push(responseMessage);

//     const toolCalls = responseMessage.tool_calls;

//     if(toolCalls) {

//         const availableFunctions = {
//             get_room_options: getRoomOptions,
//             book_room: bookRoom
//         };

//         for (const toolCall of toolCalls) {
//             const functionName = toolCall.function.name;
//             const functionToCall = availableFunctions[functionName];
//             const functionParams = JSON.parse(toolCall.function.arguments);
//             let functionResponse;
//             if(functionName === "book_room") {
//                 functionResponse = functionToCall(functionParams.roomType, functionParams.days);
//             }
//             else{
//             functionResponse = functionToCall(functionParams);
//             }
//             allMessages.push({
//                 "tool_call_id": toolCall.id,
//                 "role": "tool",
//                 "name": functionName,
//                 "content": JSON.stringify(functionResponse),
//             });
//         }
//         // const tool_call_id = toolCalls[0].id;
//         // const functionName = toolCalls[0].function.name;
//         // const functionParams = eval(toolCalls[0].function.arguments);
//         // console.log("Function Params: ", functionParams);

       
//             // console.log(allMessages);

//             const responseAfterToolCall = await openai.chat.completions.create({
//                 model: "gpt-3.5-turbo",
//                 messages: allMessages
//             });

//             let reply = responseAfterToolCall.choices[0].message;

//             // Update conversation history
//             allMessages.push(reply);
            
//             // console.log(reply.content);

//             return reply.content;
        
        
//         // return "This is a tool call";

//     }
//     else{
        
//         // Update conversation history
//         allMessages.push(responseMessage);
//         return responseMessage.content;
//     }




// }

// const getRoomOptions = async () => {
//     const rooms = [
//         { roomType: "Single", price: 100, availability: true },
//         { roomType: "Double", price: 150, availability: true },
//         { roomType: "Suite", price: 300, availability: false }
//     ];
    
//     return JSON.stringify(rooms);
// }

// const bookRoom = async (roomType, days) => {
//     const rooms = [
//         { roomType: "Single", price: 100, availability: true },
//         { roomType: "Double", price: 150, availability: true },
//         { roomType: "Suite", price: 300, availability: false }
//     ];

//     const selectedRoom = rooms.find(room => room.roomType.toLowerCase() === roomType.toLowerCase());
//     if (!selectedRoom) {
//         return "Sorry, the room type you requested is not available. Please try again with a different room type.";
//     }

//     if (!selectedRoom.availability) {
//         return "Sorry, the room type you requested is not available. Please try again with a different room type.";
//     }

//     const totalCost = selectedRoom.price * days;
//     return `You have successfully booked a ${roomType} room for ${days} days. Your total cost is $${totalCost}.`;

// }

// module.exports = { getBotResponse };


let allMessages = [];

// allMessages.push({ role: "system", content: prompt });

const tools = [
    {
        "type": "function",
        "function": {
            "name": "get_room_options",
            "description": "Fetch available room options",
        },
    },
    {
        "type": "function",
        "function": {
            "name": "book_room",
            "description": "Book a room, if not known ask user type of room and number of days to book the room.",
            "parameters": {
                "type": "object",
                "properties": {
                    "roomType": {
                        "type": "string",
                        "description": "Type of room to book"
                    },
                    "days": {
                        "type": "integer",
                        "description": "Number of days to book the room"
                    }
                }
            },
            "required": ["roomType", "days"],
        }
    }
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
        model: "gpt-3.5-turbo",
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
            
        

            if(functionName === "book_room") {
            const functionResponse = bookRoom(functionParams.roomType, functionParams.days);
            allMessages.push({
                "role": "tool",
                "tool_call_id": tool_call_id,
                "name": functionName,
                "content": JSON.stringify(functionResponse),
            });
        

        response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: prompt},
                ...allMessages,
            ],
        });

        let reply = response.choices[0].message;

        allMessages.push(reply);
        return reply.content;

    } else if(functionName === "get_room_options") {
        const getRoom = getRoomOptions();
        allMessages.push({
            "role": "tool",
            "tool_call_id": tool_call_id,
            "name": functionName,
            "content": JSON.stringify(getRoom),
        });

        response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
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

const getRoomOptions = async () => {
    const rooms = [
        { roomType: "Single", price: 100, availability: true },
        { roomType: "Double", price: 150, availability: true },
        { roomType: "Suite", price: 300, availability: false }
    ];

    return JSON.stringify(rooms);
}

const bookRoom = async (roomType, days) => {
    const rooms = [
        { roomType: "Single", price: 100, availability: true },
        { roomType: "Double", price: 150, availability: true },
        { roomType: "Suite", price: 300, availability: false }
    ];

    const selectedRoom = rooms.find(room => room.roomType.toLowerCase() === roomType.toLowerCase());
    if (!selectedRoom) {
        return "Sorry, the room type you requested is not available. Please try again with a different room type.";
    }

    if (!selectedRoom.availability) {
        return "Sorry, the room type you requested is not available. Please try again with a different room type.";
    }

    const totalCost = selectedRoom.price * days;
    return `You have successfully booked a ${roomType} room for ${days} days. Your total cost is $${totalCost}.`;
}

module.exports = { getBotResponse };