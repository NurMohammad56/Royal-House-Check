import authRouter from "./auth.route.js"
import messageRouter from "./messages.route.js"
import visitRouter from "./visits.route.js"
import visitClientRouter from "./visits.client.route.js"
import visitAdminRouter from "./visits.admin.route.js"
import visitStaffRouter from "./visits.staff.route.js"
import issuesRouter from "./issues.route.js"
import notificationRouter from "./notification.route.js"
import planRouter from "./plan.route.js"
import addsOnServiceRouter from "./addsOnService.route.js"
import discountRouter from "./discount.route.js"
import paymentRouter from "./payment.route.js"
import adminMatricsRouter from "./adminMatrics.route.js"
import contactUSRouter from "./contactus.route.js"

export const rootRouter = (app) => {
    app.use('/api/v1/users', authRouter)
    app.use('/api/v1/messages', messageRouter)
    app.use('/api/v1/visits', visitRouter)
    app.use('/api/v1/visits', visitClientRouter)
    app.use('/api/v1/visits', visitAdminRouter)
    app.use('/api/v1/visits/staff', visitStaffRouter)
    app.use('/api/v1/visits/issues', issuesRouter)
    app.use('/api/v1/notifications', notificationRouter)
    app.use('/api/v1/plans', planRouter)
    app.use('/api/v1/addsOnService', addsOnServiceRouter)
    app.use('/api/v1/discounts', discountRouter)
    app.use('/api/v1/payments', paymentRouter)
    app.use('/api/v1/admin', adminMatricsRouter)
    app.use('/api/v1/contactus', contactUSRouter)
}