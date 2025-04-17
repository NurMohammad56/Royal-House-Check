import { PORT } from "./src/config/config.js"
import express from 'express'
import { notFoundHandler } from "./src/middleware/notFoundHandler.middleware.js"
import errorHandler from "./src/middleware/errorHandler.middleware.js"
import { rootRouter } from './src/routes/root.route.js'
import connectDatabase from './src/config/connectDatabase.js'
import { checkInactiveUsers } from "./src/utils/cronJobs.utils.js"
import cors from "cors";

const app = express()

app.use(express.json())

app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

app.get('/', (_, res) => {
    return res.send('Welcome to security API!')
})

//handling all routes
rootRouter(app)

// not found route handler middleware
app.use(notFoundHandler)

//error handler middleware
app.use(errorHandler);

async function startServer() {

    await connectDatabase()

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
        checkInactiveUsers();
    })
}

startServer()