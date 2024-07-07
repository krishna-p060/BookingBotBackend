const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('hotel_booking_chatbot', 'root', 'mac12345', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = { sequelize, DataTypes };

