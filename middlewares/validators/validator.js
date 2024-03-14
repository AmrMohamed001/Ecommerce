const { validationResult } = require('express-validator')
const AppError = require('../../utils/AppError')

module.exports = (req, res, next) => {
	const result = validationResult(req)
	if (!result.isEmpty()) {
		// console.log(result.array())
		return next(new AppError(400, JSON.stringify(result.array())))
	}
	next()
}
