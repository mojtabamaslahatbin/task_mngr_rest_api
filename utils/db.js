const Sequelize = require("sequelize");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, `../.env.local`) });

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.HOST,
        dialect: process.env.DIALECT,
    }
);
module.exports = sequelize;
