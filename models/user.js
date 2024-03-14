const crypto = require('crypto')
const validator = require('validator')
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const schema = new mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: [true, 'name required'],
	},
	email: {
		type: String,
		lower: true,
		required: [true, 'email required'],
		unique: true,
		validate: [validator.isEmail, 'enter valid email'],
	},
	password: {
		type: String,
		required: [true, 'password required'],
		minLength: [8, 'short password'],
		select: false,
	},
	confirmPassword: {
		type: String,
		required: [true, 'enter confirm password'],
		validate: {
			validator: function (val) {
				return val === this.password
			},
			message: 'confirm password is wrongs',
		},
	},
	phone: {
		type: String,
		validate: {
			validator: (val) =>
				validator.isMobilePhone(val, ['ar-AE', 'ar-EG', 'ar-SA']),
			message: 'enter valid phone number',
		},
	},
	role: {
		type: String,
		default: 'user',
		enum: ['admin', 'user'],
		select: false,
	},
	image: { type: String, default: 'default.jpg' },
	whishList: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Product',
		},
	],
	address: [
		{
			alias: String,
			details: String,
			city: String,
			postalCode: Number,
		},
	],
	slug: {
		type: String,
		lower: true,
	},
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
	changePasswordAt: Date,
	resetCode: String,
	codeExpires: Date,
	isVerified: Boolean,
})
schema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()
	this.password = await bcryptjs.hash(this.password, 12)
	this.confirmPassword = undefined
	next()
})
schema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } })
	next()
})
schema.post('init', (doc) => {
	if (doc.image) doc.image = `${process.env.BASE_URL}/img/user/${doc.image}`
})
schema.methods.checkPasswords = async function (plain, hashed) {
	return await bcryptjs.compare(plain, hashed)
}
schema.methods.checkPasswordChangedAfterJwt = function (iat) {
	if (this.changePasswordAt) {
		const passwordTimeStamp = parseInt(
			this.changePasswordAt.getTime() / 1000,
			10
		)
		return passwordTimeStamp > iat
	}
	return false
}
schema.methods.generateResetCode = function () {
	const code = Math.floor(100000 + Math.random() * 900000).toString()
	this.resetCode = crypto.createHash('sha256').update(code).digest('hex')
	this.codeExpires = Date.now() + 10 * 60 * 1000 //10min
	this.isVerified = false
	return code
}
module.exports = mongoose.model('User', schema)
