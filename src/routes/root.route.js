import authRouter from "./auth.route.js"
import messageRouter from "./messages.route.js"
import visitClientRouter from "./visits.client.route.js"
import visitAdminRouter from "./visits.admin.route.js"
import visitStaffRouter from "./visits.staff.route.js"

export const rootRouter = (app) => {
    app.use('/api/v1/users', authRouter)
    app.use('/api/v1/messages', messageRouter)
    app.use('/api/v1/visits/client', visitClientRouter)
    app.use('/api/v1/visits/admin', visitAdminRouter)
    app.use('/api/v1/visits/staff', visitStaffRouter)
}