const jwt = require("jsonwebtoken");
const Run = require('../entities/Run');

const { CompareHash } = require("../services/bcryptService");

// Usar entidades y agregar logica de negocio

class RunUseCase {
    constructor(runRepository) {
        this.runRepository = runRepository;
    }

    async createRun(runData, userId) {

        const runModel = new Run(runData);

        const dateTimeUtc = new Date().toISOString();
        
        runModel.dateTimeUtc = dateTimeUtc;

        const finalRun = await this.runRepository.create(runModel, userId);
        return finalRun;
    }

    async getRunData(runId){

        const run = await this.runRepository.findById(runId);

        return run;
    }

    async getRunsData(userId){

        const run = await this.runRepository.findAllById(userId);

        return run;
    }

    async updateRun(runId, runData){

        const check = await this.runRepository.updateById(runId, runData);

        return check;
    }

    async deleteRun(runId){

        const check = await this.runRepository.deleteById(runId);

        return check;
    }
}

module.exports = RunUseCase;