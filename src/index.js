require('dotenv').config();
const app = require("./config/app");
const { connect, getDb } = require('./services/mongoService.js');

const userRoutes = require("./routes/user.routes.js");
const runRoutes = require("./routes/run.routes.js");

(async () => {
    try {
        await connect();
        const db = getDb();

        app.use('/', userRoutes(db));
        app.use('/run', runRoutes(db))

        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
        
    } catch (error) {
        console.error(`Error starting the server: ${error.message}`);
        process.exit(1);
    }
})();