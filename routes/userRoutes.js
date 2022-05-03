const express = require("express");

const userRoute = express();

const {
    signup,
    login,
    refreshToken,
    confirmEmailAddress,
} = require("../controller/userController");

userRoute.post("/signup", signup);

userRoute.post("/login", login);

//generate refreshToken
userRoute.post("/refreshToken", refreshToken);

userRoute.get("/confirm/:confirmToken", confirmEmailAddress);

module.exports = userRoute;
