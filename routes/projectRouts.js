const express = require("express");
const projectRoute = express();
const {
    createProject,
    getAllProjects,
    getProjectById,
    deleteProject,
    updateProject,
} = require("../controller/projectController");

projectRoute.post("", createProject);

projectRoute.get("", getAllProjects);

projectRoute.get("/:id", getProjectById);

projectRoute.delete("/:id", deleteProject);

projectRoute.put("/:id", updateProject);

module.exports = projectRoute;
