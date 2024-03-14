const sharp = require('sharp')
const slugify = require('slugify')
const Product = require('../models/product')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')
const Category = require('../models/category')
const SubCategory = require('../models/subCategory')
const factory = require('./factoryHandler')
const { uploadMix } = require('../middlewares/uploadImageMiddleware')
//////////////////////////////////////////////////
// upload images
exports.uplaodProductImage = uploadMix([
	{ name: 'images', maxCount: 4 },
	{ name: 'imageCover', maxCount: 1 },
])

exports.resizeProductImages = catchAsync(async (req, res, next) => {
	if (!req.files) return next()
	console.log(req.files)
	if (req.files.imageCover) {
		const fileName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}-cover.jpeg`
		await sharp(req.files.imageCover[0].buffer)
			.resize(2000, 1333)
			.toFormat('jpeg')
			.jpeg({ quality: 80 })
			.toFile(`./public/img/product/${fileName}`)
		// save to db
		req.body.imageCover = fileName
	}
	if (req.files.images) {
		req.body.images = []
		await Promise.all(
			req.files.images.map(async (img, i) => {
				const fileName = `product-${Date.now()}-${Math.round(Math.random() * 1e9)}-${i + 1}.jpeg`
				await sharp(img.buffer)
					.resize(600, 600)
					.toFormat('jpeg')
					.jpeg({ quality: 80 })
					.toFile(`./public/img/product/${fileName}`)
				req.body.images.push(fileName)
			})
		)
	}
	next()
})
//////////////////////////////////////////////////

exports.validateCreatingProduct = catchAsync(async (req, res, next) => {
	// 1-check if category exists
	const category = await Category.findById(req.body.category)
	if (!category)
		return next(new AppError(404, 'no category found with this id'))

	if (!req.body.subCategories) return next()
	// 2-check if subCategory exists
	const subCategories = await SubCategory.find({
		_id: { $exists: true, $in: req.body.subCategories },
	})
	if (subCategories.length < req.body.subCategories.length)
		return next(new AppError(404, 'subCategories have invalid id'))

	//3-check if subCategory in the categories
	const subCategoriesInCategory = await SubCategory.find({
		category: req.body.category,
	})
	const subsIds = []
	subCategoriesInCategory.forEach((doc) => {
		subsIds.push(doc._id.toString())
	})
	const check = req.body.subCategories.every((id) => subsIds.includes(id))
	if (!check)
		return next(
			new AppError(404, 'subCategories does not belong to this category')
		)
	next()
})
exports.slugProduct = (req, res, next) => {
	if (req.body.title) req.body.slug = slugify(req.body.title)
	next()
}
exports.validateProductInStock = async (req, res, next) => {
	const product = await Product.findById(req.params.id)
	if (!product)
		next(new AppError(404, `No product with this id :${req.params.id}`))
	if (product.quantity > 0) return next()
	product.stock = false
	product.quantity = 0
	await product.save()
	next()
}
exports.getAllProducts = factory.getAll(Product)
exports.createProduct = factory.createOne(Product)
exports.getProduct = factory.getOne(Product)
exports.updateProduct = factory.updateOne(Product)
exports.deleteProduct = factory.deleteOne(Product)
