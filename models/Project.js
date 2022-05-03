const Sequelize = require("sequelize");

const db = require("../utils/db");

const Project = db.define("project", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Project;
