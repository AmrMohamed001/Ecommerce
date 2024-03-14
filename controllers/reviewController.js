const Review = require('../models/review')
const User = require('../models/user')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const factory = require('./factoryHandler')

//check if the user who created review can update it
exports.validateBeforeUpdate = catchAsync(async (req, res, next) => {
	const review = await Review.findById(req.params.id)
	if (!review) return next(new AppError(404, 'no review with this id'))
	if (`${review.user._id}` !== `${req.user._id}`)
		return next(new AppError(400, 'not your review to update'))
	next()
})
//check if the user who created review can delete it
exports.validateBeforeDelete = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.user._id).select('+role')
	if (user.role !== 'user') return next()
	const review = await Review.findById(req.params.id)
	if (!review) return next(new AppError(404, 'no review with this id'))
	if (`${review.user._id}` !== `${req.user._id}`)
		return next(new AppError(400, 'not your review to delete'))
	next()
})

exports.createFilterObj = (req, res, next) => {
	let filterObj = {}
	if (req.params.productId) filterObj = { product: req.params.productId }
	req.filterObj = filterObj
	next()
}
exports.setProductUserId = (req, res, next) => {
	if (req.params.productId) req.body.product = req.params.productId
	if (!req.body.user) req.body.user = req.user._id
	next()
}
exports.getAllReviews = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)
