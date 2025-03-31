const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

const upload = require("../services/multer");

module.exports = (db) => {

    const RunRepository = require("../repositories/run.repository");
    const RunController = require("../controllers/run.controller");
    
    const runRepository = new RunRepository(db);
    const runController = new RunController(runRepository);

    router.post("/", verifyToken, upload.single("MAP_PICTURE"), (req, res) => runController.createRun(req, res));

    router.get("/", verifyToken, (req, res) => runController.getRunsData(req, res));

    router.put("/", verifyToken, (req, res) => runController.updateRun(req, res));

    router.delete("/", verifyToken, (req, res) => runController.deleteRun(req, res));

    return router;
};