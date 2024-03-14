const path = require('path')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const compression = require('compression')
const mounting = require('./routes')
const globalErrorHandling = require('./middlewares/errorHandlingMiddleware')

const app = express()
app.use(cors())
app.options('*', cors())
app.use(compression())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
// Mounting
mounting(app)
app.use(globalErrorHandling)
/////////////////////////////////////////
module.exports = app
