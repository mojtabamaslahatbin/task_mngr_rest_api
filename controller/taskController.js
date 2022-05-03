const User = require("../models/User");
const Task = require("../models/Task");

const createTask = async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(400).send("user not found with this id");
    }

    const task = await user.createTask({
        title: req.body.title,
        completed: false,
    });
    res.status(201).send(task);
};

const getAllTasks = async (req, res) => {
    const user = req.user;
    const page = +req.query.page || 0;
    const size = +req.query.size || 20;
    const { rows, count } = await Task.findAndCountAll({
        where: {
            userId: user.id,
        },
        offset: page * size,
        limit: size,
    });
    res.status(200).send({
        data: rows,
        meta: {
            pagination: {
                page,
                size,
                count,
            },
        },
    });
    console.log({ page, size });
};

const getTaskById = async (req, res) => {
    const user = req.user;
    const task = await Task.findOne({
        where: {
            id: req.params.id,
            userId: user.id,
        },
    });
    if (task) {
        res.status(200).send(task);
    } else {
        res.status(400).send(`task with id ${req.params.id} not found`);
    }
};

const deleteTask = async (req, res) => {
    const user = req.user;
    try {
        const numberOfDeletedTasks = await Task.destroy({
            where: {
                id: req.params.id,
                userId: user.id,
            },
        });
        if (numberOfDeletedTasks) res.send(`task id ${req.params.id} deleted`);
        if (!numberOfDeletedTasks) res.send(`task id ${req.params.id} not found`);
    } catch (error) {
        res.status(500).send(`error: ${error}`);
    }
};

const updateTask = async (req, res) => {
    const user = req.user;
    try {
        const selectedTask = await Task.findOne({
            where: {
                id: req.params.id,
                userId: user.id,
            },
        });
        if (selectedTask) {
            selectedTask.title = req.body.title || selectedTask.title;
            selectedTask.completed = req.body.completed || selectedTask.completed;
            selectedTask.save();
            res.send(selectedTask);
        } else {
            res.status(400).send(`task with id=${req.params.id} not found`);
        }
    } catch (error) {
        res.status(500).send(`error: ${error}`);
    }
};

module.exports = { createTask, getAllTasks, getTaskById, deleteTask, updateTask };
