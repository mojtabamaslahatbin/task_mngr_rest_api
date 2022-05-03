const User = require("../models/User");
const Project = require("../models/Project");

exports.createProject = async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(400).send("user not found with this id");
    }

    const project = await user.createProject({
        title: req.body.title,
    });
    res.status(201).send(project);
};

exports.getAllProjects = async (req, res) => {
    const user = req.user;
    const projects = await Project.findAll({
        where: {
            userId: user.id,
        },
    });
    res.send(projects);
};

exports.getProjectById = async (req, res) => {
    const user = req.user;
    const project = await Project.findOne({
        where: {
            id: req.params.id,
            userId: user.id,
        },
    });
    if (project) {
        res.status(200).send(project);
    } else {
        res.status(404).send(`project with id ${req.params.id} not found`);
    }
};

exports.deleteProject = async (req, res) => {
    const user = req.user;
    try {
        const numberOfDeleted = await Project.destroy({
            where: {
                id: req.params.id,
                userId: user.id,
            },
        });
        if (numberOfDeleted) res.send(`deleted ${numberOfDeleted}`);
        if (!numberOfDeleted) res.send(`no item with id : ${req.params.id}`);
    } catch (error) {
        res.status(500).send(`error: ${error}`);
    }
};

exports.updateProject = async (req, res) => {
    const user = req.user;
    const project = await Project.findOne({
        where: {
            id: req.params.id,
            userId: user.id,
        },
    });
    if (!project) {
        res.status(400).send("no project with this id ");
        return;
    } else {
        project.title = req.body.title;
    }
    try {
        await project.save();
        res.send(project);
    } catch (error) {
        res.status(500).send(`error : ${error}`);
    }
};
