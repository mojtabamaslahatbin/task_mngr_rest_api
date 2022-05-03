const Sequelize = require("sequelize");

const db = require("../utils/db");

const Task = db.define("task", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
});

module.exports = Task