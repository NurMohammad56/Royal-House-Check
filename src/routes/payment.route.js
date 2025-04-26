import express from 'express'
import {
  createPaymentIntent,
  checkPaymentStatus,
  getAllPayments,
  userAllPayment,
} from '../controller/payment.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
import { isAdmin } from '../middleware/role.middleware.js'

const router = express.Router()

router.post('/payment-intent', createPaymentIntent)
router.get('/status-check/:sessionId', checkPaymentStatus)
// admin for see all the data
router.get('/all', getAllPayments)
router.get('/user-payment/:userId', userAllPayment)

export default router
