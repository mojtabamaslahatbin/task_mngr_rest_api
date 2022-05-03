const express = require("express");
const taskRoute = express();

const {
    createTask,
    getAllTasks,
    getTaskById,
    deleteTask,
    updateTask,
} = require("../controller/taskController");

taskRoute.post("", createTask);

taskRoute.get("", getAllTasks);

taskRoute.get("/:id", getTaskById);

taskRoute.delete("/:id", deleteTask);

taskRoute.put("/:id", updateTask);

module.exports = taskRoute;
