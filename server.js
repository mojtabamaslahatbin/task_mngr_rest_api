const express = require("express");
const jwt = require("./utils/jwt");

const taskRoute = require("./routes/taskRoutes");
const projectRoute = require("./routes/projectRouts");
const userRoute = require("./routes/userRoutes");

const db = require("./utils/db");

const Task = require("./models/Task");
const Project = require("./models/Project");
const User = require("./models/User");

const app = express();

app.use(express.json());

app.use("/tasks", jwt.verifyToken, taskRoute);
app.use("/projects", jwt.verifyToken, projectRoute);
app.use("/users", userRoute);

app.get("/", (req, res) => {
    res.send("home page");
});

Project.hasMany(Task);
User.hasMany(Project);
User.hasMany(Task);

db.sync({ force: true })
    .then(() => {
        app.listen(3000);
    })
    .catch(e => {
        console.log(e);
    });
