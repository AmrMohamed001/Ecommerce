const { promisify } = require('util')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const slugify = require('slugify')
const catchAsync = require('../utils/catchAsync')
const signToken = require('../utils/signToken')
const User = require('../models/user')
const AppError = require('../utils/AppError')
const SendMail = require('../utils/sendMail')
const { sanitizeUserLogging } = require('../utils/resSanitize')

exports.signup = catchAsync(async (req, res, next) => {
	const newUser = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		phone: req.body.phone,
		slug: slugify(req.body.name),
	}
	const user = await User.create(newUser)
	const token = signToken(user._id)
	user.password = undefined
	try {
		await new SendMail(user).sendWelcome()
	} catch (err) {
		console.log(err)
		return next(new AppError(500, 'server error , try again'))
	}

	res.status(200).json({
		status: 'success',
		data: {
			token,
			user: sanitizeUserLogging(user),
		},
	})
})
exports.login = catchAsync(async (req, res, next) => {
	// check email and password
	const { email, password } = req.body
	if (!email || !password)
		return next(new AppError(400, 'provide email and password please'))
	// get user by email and check for it
	const user = await User.findOne({ email }).select('+password')
	// check if password is true
	if (!user || !(await user.checkPasswords(password, user.password)))
		return next(new AppError(401, 'email or password is incorrect'))
	// sign user
	const token = signToken(user._id)
	user.password = undefined
	res.status(200).json({
		status: 'success',
		data: {
			token,
			user: sanitizeUserLogging(user),
		},
	})
})
exports.protect = catchAsync(async (req, res, next) => {
	// get token and check for it
	let token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	)
		token = req.headers.authorization.split(' ')[1]
	if (!token) return next(new AppError(401, 'no token found'))

	// decode token
	const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
	// check user is still exists
	const user = await User.findById(decode.id).select('+role')
	if (!user) return next(new AppError(404, 'no user found with this token'))
	//check if user doesn't change password after token is issued
	if (user.checkPasswordChangedAfterJwt(decode.iat))
		return next(
			new AppError(402, 'user changed password after token was issued')
		)
	req.user = user

	next()
})
exports.allowTo =
	(...roles) =>
	(req, res, next) => {
		if (!roles.includes(req.user.role))
			return next(new AppError(401, 'un authorized to this route'))
		next()
	}
exports.forgetPassword = catchAsync(async (req, res, next) => {
	const { email } = req.body
	if (!email) return next(new AppError(400, 'enter your mail'))
	// get user
	const user = await User.findOne({ email })
	if (!user) return next(new AppError(400, 'no user found with this mail'))
	// generate random 6 digits
	const pinCode = user.generateResetCode()
	await user.save({ validateBeforeSave: false })
	//send mail
	try {
		const mail = new SendMail(user, pinCode)
		await mail.sendResetPassword()
		res.status(200).json({ msg: 'mail sent' })
	} catch (err) {
		console.log(err)
		user.resetCode = undefined
		user.codeExpires = undefined
		user.isVerified = undefined
		user.save()
		res.status(500).json({ msg: 'something went wrong' })
	}
})
exports.verifyPin = catchAsync(async (req, res, next) => {
	const { code } = req.body
	if (!code || `${code}`.length < 5)
		return next(new AppError(400, 'incorrect pin code'))
	const hashedCode = crypto.createHash('sha256').update(`${code}`).digest('hex')
	const user = await User.findOne({
		resetCode: hashedCode,
		codeExpires: { $gt: Date.now() },
	})
	if (!user)
		return next(new AppError(400, 'code may be wrong or expired . try again'))
	user.isVerified = true
	await user.save({ validateBeforeSave: false })
	res.status(200).json({ msg: 'success' })
})
exports.resetPassword = catchAsync(async (req, res, next) => {
	const { email, newPassword, newConfirm } = req.body
	const user = await User.findOne({ email })
	if (!user) return next(new AppError(400, 'no user found with this mail'))
	if (!user.isVerified)
		return next(new AppError(400, 'Reset code not verified'))
	user.password = newPassword
	user.confirmPassword = newConfirm
	user.changePasswordAt = Date.now()
	user.isVerified = undefined
	user.codeExpires = undefined
	user.resetCode = undefined
	await user.save()
	const token = signToken(user._id)
	res.status(200).json({
		status: 'success',
		data: {
			token,
		},
	})
})
//test
exports.updatePassword = catchAsync(async (req, res, next) => {
	const { password, newPassword, confirmNew } = req.body
	const user = await User.findById(req.user.id).select('+password')
	if (!(await user.checkPasswords(password, user.password)))
		return next(new AppError(401, 'wrong password , try again'))
	user.password = newPassword
	user.confirmPassword = confirmNew
	await user.save()
	const token = signToken(user._id)
	res.status(200).json({
		status: 'success',
		data: {
			token,
		},
	})
})
