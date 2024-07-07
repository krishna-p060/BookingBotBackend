const { sequelize, DataTypes } = require('./index');

const Conversation = sequelize.define('Conversation', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    response: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = { Conversation };
