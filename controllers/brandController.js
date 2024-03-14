const sharp = require('sharp')
const slugify = require('slugify')
const Brand = require('../models/brand')
const factory = require('./factoryHandler')
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')
const catchAsync = require('../utils/catchAsync')
///////////////////////////////////////////////////////////
//image upload
exports.uplaodCategoryImage = uploadSingleImage('image')
exports.resizeImage = catchAsync(async (req, res, next) => {
	if (!req.file) return next()
	const fileName = `brand-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`
	await sharp(req.file.buffer)
		.resize(600, 600)
		.toFormat('jpeg')
		.jpeg({ quality: 80 })
		.toFile(`./public/img/brand/${fileName}`)
	req.body.image = fileName
	next()
})
///////////////////////////////////////////////////////////

exports.slugBrand = (req, res, next) => {
	if (req.body.name) req.body.slug = slugify(req.body.name)
	next()
}

exports.getAllBrands = factory.getAll(Brand)
exports.getBrand = factory.getOne(Brand)
exports.createBrand = factory.createOne(Brand)
exports.updateBrand = factory.updateOne(Brand)
exports.deleteBrand = factory.deleteOne(Brand)
