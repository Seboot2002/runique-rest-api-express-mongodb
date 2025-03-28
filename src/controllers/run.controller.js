const RunUseCase = require("../usecases/run.usecase");

class RunController {
    constructor(runRepository) {
        this.runRepository = runRepository;
        this.runUseCase = new RunUseCase(this.runRepository);
    }

    async createRun(req, res) {
        try {
            
            const userId = req.token_usuarioId;
            const runData = req.body.RUN_DATA;

            console.log("req body:", req.body)

            if (/*!req.file || */!req.body.RUN_DATA) {
                return res.status(400).json({ error: "Faltan datos" });
            }

            //runData.mapPictureUrl = `public/uploads/${req.file.filename}`;

            let run = await this.runUseCase.createRun(runData, userId);
            
            res.status(201).json(run);

        } catch (error) {

            if (error.message === 'Run already exists') {
                res.status(409).json({ error: error.message });
            }
            else if (error.message === "Run is required"){
                res.status(409).json({ error: error.message });
            } 
            else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async getRunsData(req, res) {

        try {
            const userId = req.token_usuarioId;
            console.log("userId:", userId);
            const run = await this.runUseCase.getRunsData(userId);

            res.status(201).send(run);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getRunData(req, res) {

        try {
            const userId = req.token_usuarioId;
            const user = await this.runUseCase.getRunData(userId);

            res.status(201).send(user);

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateRun(req, res) {

        try {
            const userId = req.token_usuarioId;
            const check = await this.runUseCase.updateRun(userId, req.body);

            if (check){
                res.status(201).send("Run updated");
            }

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteRun(req, res) {

        try {
            const userId = req.token_usuarioId;
            const check = await this.runUseCase.deleteRun(userId);

            if (check){
                res.status(201).send("Run deleted");
            }

        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = RunController;