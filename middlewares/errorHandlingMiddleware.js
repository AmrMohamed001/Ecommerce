const AppError = require('../utils/AppError')

const sendErrDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		msg: err.message,
		err,
		stack: err.stack,
	})
}
const sendErrProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		})
	} else {
		console.log(err)
		res.status(err.statusCode).json({
			status: err.status,
			message: 'some thing went wrong please try again',
		})
	}
}

const handleCastIdError = (err) =>
	new AppError(400, `Invalid ${err.path}: ${err.value} .`)

const handleDuplicationKey = (err) =>
	new AppError(400, `Duplication in field : ${Object.keys(err.keyValue)}`)

const handleValidationError = (err) => new AppError(400, err.message)
const handleTokenError = () =>
	new AppError(401, 'invalid token , please login again')
const handleExpiredToken = () =>
	new AppError(401, 'token expired, please login again')
module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500
	err.status = err.status || 500
	if (process.env.NODE_ENV === 'development') sendErrDev(err, res)
	else if (process.env.NODE_ENV === 'production') {
		let error = { ...err }
		error.message = err.message
		// mongoose id error
		if (err.name === 'CastError') error = handleCastIdError(error)
		// mongoose duplication
		if (err.code === 11000) error = handleDuplicationKey(error)
		// mongoose validation
		if (err.name === 'ValidationError') error = handleValidationError(error)
		//jwt
		if (error.name === 'JsonWebTokenError') err = handleTokenError()
		if (error.name === 'TokenExpiredError') err = handleExpiredToken()
		sendErrProd(error, res)
	}
}
