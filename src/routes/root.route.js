import authRouter from "./auth.route.js"
import messageRouter from "./messages.route.js"
import visitRouter from "./visits.route.js"

export const rootRouter = (app) => {
    app.use('/api/v1/users', authRouter)
    app.use('/api/v1/messages', messageRouter)
    app.use('/api/v1/visits', visitRouter)
}