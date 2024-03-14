const sharp = require('sharp')
const slugify = require('slugify')
const Category = require('../models/category')
const factory = require('./factoryHandler')
const catchAsync = require('../utils/catchAsync')
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware')

/////////////////////////////////////////////////
// upload category image
exports.uplaodCategoryImage = uploadSingleImage('image')
exports.resizeImage = catchAsync(async (req, res, next) => {
	if (!req.file) return next()
	const fileName = `category-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`
	await sharp(req.file.buffer)
		.resize(600, 600)
		.toFormat('jpeg')
		.jpeg({ quality: 80 })
		.toFile(`./public/img/category/${fileName}`)
	req.body.image = fileName
	next()
})
/////////////////////////////////////////////////

exports.slugCategory = (req, res, next) => {
	if (req.body.name) req.body.slug = slugify(req.body.name)
	next()
}
exports.getAllCategories = factory.getAll(Category)
exports.getCategory = factory.getOne(Category)
exports.createCategory = factory.createOne(Category)
exports.updateCategory = factory.updateOne(Category)
exports.deleteCategory = factory.deleteOne(Category)
