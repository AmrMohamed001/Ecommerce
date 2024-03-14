const sharp = require('sharp')
const slugify = require('slugify')
const User = require('../models/user')
const factory = require('./factoryHandler')
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')
const catchAsync = require('../utils/catchAsync')
///////////////////////////////////////////////////////////
//image upload
exports.uploadUserImage = uploadSingleImage('image')
exports.resizeImage = catchAsync(async (req, res, next) => {
	if (!req.file) return next()
	const fileName = `user-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`
	await sharp(req.file.buffer)
		.resize(600, 600)
		.toFormat('jpeg')
		.jpeg({ quality: 80 })
		.toFile(`./public/img/user/${fileName}`)
	req.body.image = fileName
	next()
})
///////////////////////////////////////////////////////////

exports.slugUser = (req, res, next) => {
	if (req.body.name) req.body.slug = slugify(req.body.name)
	next()
}
//For Admin
exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.createUser = factory.createOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)

//For User
exports.me = (req, res, next) => {
	req.params.id = req.user.id
	next()
}
const filterBody = function (body, ...allowed) {
	const obj = {}
	Object.keys(body).forEach((key) => {
		if (allowed.includes(key)) obj[key] = body[key]
	})
	return obj
}
exports.updateMe = catchAsync(async (req, res) => {
	//test
	// name , email , image
	const filtered = filterBody(req.body, 'name', 'email', 'slug')
	if (req.file) filtered.image = req.body.image
	const newUser = await User.findByIdAndUpdate(req.user.id, filtered, {
		new: true,
		runValidators: true,
	})
	res.status(201).json({
		status: 'success',
		data: {
			newUser,
		},
	})
})
exports.deleteMe = catchAsync(async (req, res) => {
	//test
	await User.findByIdAndUpdate(req.user.id, { active: false })
	res.status(204).json({ status: 'success', data: null })
})
