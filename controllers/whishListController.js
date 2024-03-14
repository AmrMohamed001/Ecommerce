const User = require('../models/user')
const Product = require('../models/product')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')

exports.addProductToWhishList = catchAsync(async (req, res, next) => {
	const product = await Product.findById(req.body.product)
	if (!product) return next(new AppError(404, 'this product is not found'))
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$addToSet: { whishList: req.body.product },
		},
		{ new: true }
	)
	res.status(201).json({
		status: 'success',
		data: user.whishList,
	})
})
exports.deleteProductFromWhishList = catchAsync(async (req, res, next) => {
	const product = await Product.findById(req.params.id)
	if (!product) return next(new AppError(404, 'this product is not found'))
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$pull: { whishList: req.params.id },
		},
		{ new: true }
	)
	res.status(202).json({
		status: 'success',
		data: user.whishList,
	})
})
exports.getLoggedUserWhishList = catchAsync(async (req, res) => {
	const user = await User.findById(req.user._id).populate('whishList')
	res.status(202).json({
		status: 'success',
		results: user.whishList.length,
		data: user.whishList,
	})
})
