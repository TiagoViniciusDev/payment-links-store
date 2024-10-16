import express from 'express'
import { stripeController } from '../controllers/StripeControler.js'

const StripeRouter = express.Router()

StripeRouter.post("/create-checkout-session", stripeController)

export default StripeRouter