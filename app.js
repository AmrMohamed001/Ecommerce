const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const sanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const mounting = require('./routes')
const { webhookCheckout } = require('./controllers/orderController')
const globalErrorHandling = require('./middlewares/errorHandlingMiddleware')

const app = express()
app.use(cors())
app.options('*', cors())
app.use(compression())
app.post(
	'/webhook-checkout',
	express.raw({ type: 'application/json' }),
	webhookCheckout
)
app.use(express.json({ limit: '100kb' }))
app.use(express.static(path.join(__dirname, 'public')))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
////////////////////////
app.use(sanitize())
app.use(xss())
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	message: 'too many requests from this ip .. try again after 15 minute',
})
// Apply the rate limiting middleware to all requests.
app.use('/api', limiter)
app.use(hpp())
// Mounting
mounting(app)
app.use(globalErrorHandling)
/////////////////////////////////////////
module.exports = app
