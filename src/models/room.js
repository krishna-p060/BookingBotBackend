const { sequelize, DataTypes } = require('./index');

const Room = sequelize.define('Room', {
    roomType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = { Room };
