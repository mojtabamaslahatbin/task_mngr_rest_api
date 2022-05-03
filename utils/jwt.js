const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, `../.env.local`) });
const secretKey = process.env.JWT_SECRET_KEY;
const confirmationSecretKey = process.env.EMAIL_CONFIRMATION_SECRET_KEY;

const User = require("../models/User");

const generateToken = async (req, res, next) => {
    const { username } = req.body;

    const user = await User.findOne({ where: { username: username } });

    jwt.sign({ username }, secretKey, { expiresIn: "3h" }, (error, token) => {
        if (error) {
            res.status(500).send();
        } else {
            //generate refresh token
            jwt.sign({ id: user.id }, secretKey, (error, refreshToken) => {
                if (error) {
                    res.status(500).send();
                } else {
                    res.send({
                        token,
                        refreshToken,
                    });
                }
            });
        }
    });
};

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(403).send("no token received");
    } else {
        jwt.verify(token, secretKey, async (error, result) => {
            if (error) {
                res.status(403).send("token is not valid");
            } else {
                const username = result.username;
                const user = await User.findOne({ where: { username } });
                req.user = user;
                next();
            }
        });
    }
};

const refreshToken = (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) res.status(400).res("refresh token is empty");

    jwt.verify(refreshToken, secretKey, async (error, result) => {
        if (error) res.status(500).send();

        // check user is still active or not
        const { id } = result;
        const user = await User.findByPk(id);
        if (!user) res.status(404).send("this user doesn't exist");

        // add username to req.body because req.body only has refreshToken
        req.body.username = user.username;
        generateToken(req, res, next);
    });
};

const createConfirmationToken = ({ email, userId }, cb) => {
    jwt.sign({ userId, email }, confirmationSecretKey, { expiresIn: "10h" }, (error, token) => {
        if (error) cb(error, null);
        else cb(null, token);
    });
};

const verifyConfirmToken = (token, cb) => {
    jwt.verify(token, confirmationSecretKey, async (error, result) => {
        if (error) cb(error, null);
        else cb(null, result);
    });
};

module.exports = {
    generateToken,
    verifyToken,
    refreshToken,
    createConfirmationToken,
    verifyConfirmToken,
};
