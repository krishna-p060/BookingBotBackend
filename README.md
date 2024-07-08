LetMeBook - Hotel Booking Chatbot
=================================

Table of Contents
-----------------

-   [Introduction](#introduction)
-   [Features](#features)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Usage](#usage)
-   [API Endpoints](#api-endpoints)
-   [Technologies Used](#technologies-used)


Introduction
------------

LetMeBook is a RESTful API built with Express.js that implements a chatbot capable of handling hotel booking queries. The chatbot uses OpenAI's API for natural language processing and maintains conversation history using Sequelize with SQLite or MySQL. Additionally, it sends booking confirmation emails to users using Nodemailer.

Features
--------

-   RESTful API using Express.js
-   Natural Language Processing with OpenAI API
-   Conversation history storage with Sequelize
-   Room booking simulation
-   Email confirmation using Nodemailer
-   Error handling for invalid user inputs or API failures

Installation
------------

1.  **Clone the repository**

   
```
    git clone https://github.com/yourusername/LetMeBook.git
    cd LetMeBook
```
2.  **Install dependencies**

    
```
    npm install
```
3.  **Create a `.env` file in the project root and add your API keys and database configuration**

    
```
    OPENAI_API_KEY='your-openai-api-key'
    EMAIL_USER='your-email@example.com'
    EMAIL_PASS='your-email-password'
```    

Configuration
-------------

-   Ensure you have Node.js installed (v18 or higher is recommended).
-   Update the `.env` file with your OpenAI API key, email credentials, and database configuration.

Usage
-----

1.  **Start the server**

    
```
    node src/app.js
```
2.  **Send a POST request to the chatbot endpoint**

    -   URL: `http://localhost:4000/chat`
    -   Request Body:

  ```
    {
        "userId": "1",
        "message": "I want to book a room"
    }
```

API Endpoints
-------------

### POST /chat

Handle user messages and return chatbot responses.

**Request:**

```

{
    "userId": "1",
    "message": "I want to book a room"
}
```
**Response:**

```
{
    "response": "Here are the available room options..."
}
```


Technologies Used
-----------------

-   Node.js
-   Express.js
-   Sequelize
-   SQLite/MySQL
-   OpenAI API
-   Nodemailer

