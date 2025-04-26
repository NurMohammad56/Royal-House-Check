import express from 'express'
import {
  createPaymentIntent,
  checkPaymentStatus,
  getAllPayments,
} from '../controller/payment.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
import { isAdmin } from '../middleware/role.middleware.js'

const router = express.Router()

router.post('/payment-intent', createPaymentIntent)
router.get('/status-check/:sessionId', checkPaymentStatus)
router.get('/all', getAllPayments)

export default router
