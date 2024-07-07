// require('dotenv').config({ path: '../.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const chatRoutes = require('./routes/chat_Routes2');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/chat', chatRoutes);



sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        return sequelize.sync();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
