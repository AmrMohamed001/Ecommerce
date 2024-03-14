const mongoose = require('mongoose')
const Product = require('./product')

const schema = new mongoose.Schema(
	{
		title: {
			type: String,
			// required: [true, 'review must have a name'],
			trim: true,
		},
		rating: {
			type: Number,
			min: [1.0, 'your rating should be gt 1.0'],
			max: [5.0, 'your rating should be ls 5.0'],
			required: true,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: [true, 'review must belong to a user'],
		},
		product: {
			type: mongoose.Schema.ObjectId,
			ref: 'Product',
			required: [true, 'review must belong to a product'],
		},
	},
	{
		timestamps: true,
	}
)
schema.index({ user: 1, product: 1 }, { unique: true })
schema.statics.calcAverageQuantityRating = async function (productId) {
	const result = await this.aggregate([
		{
			$match: { product: productId },
		},
		{
			$group: {
				_id: '$product',
				totalQuantity: { $sum: 1 },
				totalAverage: { $avg: '$rating' },
			},
		},
	])
	console.log(result)
	if (result.length > 0) {
		await Product.findByIdAndUpdate(productId, {
			ratingsAverage: result[0].totalAverage,
			ratingsQuantity: result[0].totalQuantity,
		})
	} else {
		await Product.findByIdAndUpdate(productId, {
			ratingsAverage: 0,
			ratingsQuantity: 0,
		})
	}
}
schema.post('save', async (doc, next) => {
	await doc.constructor.calcAverageQuantityRating(doc.product)
	next()
})
schema.post('findOneAndDelete', async (doc, next) => {
	await doc.constructor.calcAverageQuantityRating(doc.product)
	next()
})
schema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'name image',
	})
	next()
})
module.exports = mongoose.model('Review', schema)
