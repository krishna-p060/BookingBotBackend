// require('dotenv').config({ path: '../../.env' });
const OpenAI = require('openai');
const openai = new OpenAI({apiKey:"sk-proj-3ZhRE0VgdVf8jaVB8OQ6T3BlbkFJWvWrRNO7FaVv9aRQBHyd"});

async function callOpenAI(messages, tools) {
    console.log(messages);
    console.log(tools);
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        // tools: tools,
        // tool_choice: "auto"
        
    });
    return response.choices[0].message;
}

// module.exports = { callOpenAI };

// async function callOpenAI(messages, tools) {
//     console.log("Messages: ", messages);
//     console.log("Tools: ", tools);

//     const options = {
//         model: "gpt-3.5-turbo",
//         messages: messages,
//     };

//     if (tools && tools.length > 0) {
//         options.tools = tools;
//         options.tool_choice = "auto";
//     }

//     const response = await openai.chat.completions.create(options);
//     return response.choices[0].message;
// }

module.exports = { callOpenAI };

