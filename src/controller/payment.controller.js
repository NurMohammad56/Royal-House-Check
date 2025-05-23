import Stripe from 'stripe'
import { Payment } from '../model/payment.model.js'
import { STRIPE_SECRET_KEY } from '../config/config.js'
import { UserPlan } from '../model/userPlan.models.js'

const stripe = new Stripe(STRIPE_SECRET_KEY)

export const createPaymentIntent = async (req, res, next) => {
  try {
    const { userId, planId, amount } = req.body

    if (!userId || !planId || !amount) {
      return res.status(400).json({
        status: false,
        message: 'User ID, Plan ID and amount are required',
      })
    }

    const amountInCents = Math.round(amount * 100)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Plan Purchase',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    })

    const userPlanDetails = await UserPlan.find({ user: userId, plan: planId }).sort({ createdAt: -1 })

    // Create pending payment record
    const latestUserPlan = userPlanDetails[0] ? userPlanDetails[0]._id : null;

    await Payment.create({
      user: userId,
      plan: planId,
      amount,
      transactionId: session.id,
      paymentMethod: 'stripe',
      userPlan: latestUserPlan,
      status: 'pending',
    });


    return res.status(200).json({
      status: true,
      message: 'Payment session created successfully',
      data: {
        url: session.url,
        sessionId: session.id,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const checkPaymentStatus = async (req, res, next) => {
  try {
    const { sessionId } = req.params

    if (!sessionId) {
      return res.status(400).json({
        status: false,
        message: 'Session ID is required',
      })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    let paymentStatus = 'failed'

    if (session && session.payment_status === 'paid') {
      paymentStatus = 'completed'
    }

    // Get the real transaction ID from session
    const paymentIntentId = session.payment_intent

    const payment = await Payment.findOneAndUpdate(
      { transactionId: sessionId },
      {
        transactionId: paymentIntentId,
        status: paymentStatus,
        paymentDate: paymentStatus === 'completed' ? Date.now() : undefined,
      },
      { new: true }
    ).populate('user plan')

    if (!payment) {
      return res.status(404).json({
        status: false,
        message: 'Payment not found',
      })
    }

    return res.status(200).json({
      status: true,
      message: `Payment marked as ${paymentStatus}`,
      data: payment,
    })
  } catch (error) {
    next(error)
  }
}


export const getAllPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate({
        path: 'user',
        select: 'fullname',
      })
      .populate({
        path: 'plan',
        select: 'name price pack status',
      })
      .populate({
        path: 'userPlan',
        select: 'addOnServices',
        populate: {
          path: 'addOnServices',
          select: 'name price description'
        }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Transform the data to include addOnServices directly in the payment object
    const transformedPayments = payments.map(payment => {
      const paymentObj = payment.toObject();
      return {
        ...paymentObj,
        addOnServices: paymentObj.userPlan?.addOnServices || []
      };
    });

    const total = await Payment.countDocuments(query);

    return res.status(200).json({
      status: true,
      message: 'Payments fetched successfully',
      data: transformedPayments,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const userAllPayment = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!userId) {
      return res.status(400).json({
        status: false,
        message: 'User id is required.'
      });
    }

    const payments = await Payment.find({ user: userId })
      .populate({
        path: 'user',
        select: 'fullname'
      })
      .populate({
        path: 'plan',
        select: 'name price pack status'
      })
      .populate({
        path: 'userPlan',
        select: 'addOnServices',
        populate: {
          path: 'addOnServices',
          select: 'name price description'
        }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Transform the data
    const transformedPayments = payments.map(payment => {
      const paymentObj = payment.toObject();
      return {
        ...paymentObj,
        addOnServices: paymentObj.userPlan?.addOnServices || []
      };
    });

    const total = await Payment.countDocuments({ user: userId });

    return res.status(200).json({
      status: true,
      message: 'User payments fetched successfully',
      data: transformedPayments,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        status: false,
        message: 'Payment ID is required',
      });
    }

    const payment = await Payment.findById(paymentId)
      .populate({
        path: 'user',
        select: 'fullname'
      })
      .populate({
        path: 'plan',
        select: 'name price pack status'
      })
      .populate({
        path: 'userPlan',
        select: 'addOnServices',
        populate: {
          path: 'addOnServices',
          select: 'name price description'
        }
      })
      .lean();

    if (!payment) {
      return res.status(404).json({
        status: false,
        message: 'Payment not found',
      });
    }

    // Transform the data
    const transformedPayment = {
      ...payment,
      addOnServices: payment.userPlan?.addOnServices || []
    };

    return res.status(200).json({
      status: true,
      message: 'Payment fetched successfully',
      data: transformedPayment,
    });
  } catch (error) {
    next(error);
  }
};