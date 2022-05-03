const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const User = require("../models/User");
const validator = require("validator");

const { sendConfirmationEmail } = require("./mailController");

exports.signup = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).send("username or password is null");
    }

    if (!validator.isEmail(username)) {
        return res.status(400).send("username must be valid email address");
    }

    const findUser = await User.findOne({ where: { username } });

    if (findUser) {
        return res.status(400).send("username is used by another user");
    }

    try {
        const savedUser = await User.create({
            username: username,
            password: await bcrypt.hash(password, 10),
        });

        sendConfirmationEmail({ email: username, userId: savedUser.id });
        res.status(201).send(savedUser);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
};

exports.login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({ where: { username } });
    if (!user) {
        return res.status(400).send("There is no user with this username");
    } else {
        if (await bcrypt.compare(password, user.password)) {
            jwt.generateToken(req, res);
        } else {
            res.status(403).send("Password is wrong");
        }
    }
};

exports.confirmEmailAddress = (req, res) => {
    const { confirmToken } = req.params;

    jwt.verifyConfirmToken(confirmToken, async (error, result) => {
        if (error) {
            res.status(500).send(error);
        } else {
            const { userId } = result;

            const user = await User.findByPk(userId);
            if (user) {
                user.isConfirmed = true;
                user.save();
                res.status(200).send("mojito email Confirmed");
            } else {
                res.status(500).send("something went wrong");
            }
        }
    });
};

exports.refreshToken = (req, res, next) => {
    jwt.refreshToken(req, res);
};
