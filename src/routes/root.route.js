import authRouter from "./auth.route.js"

export const rootRouter = (app) => {
    app.use('/api/v1/users', authRouter)
}