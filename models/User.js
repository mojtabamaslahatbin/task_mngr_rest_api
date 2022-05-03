const Sequelize = require("sequelize");

const db = require("../utils/db");

const User = db.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, //TODO: unique username property does't work and creates duplicate users
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = User;
