const mongoose = require('mongoose')

const schema = mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			minLength: [3, 'Too short product name'],
			required: [true, 'you should enter product name'],
		},
		slug: {
			type: String,
			lower: true,
		},
		description: {
			type: String,
			minLength: [20, 'enter more description'],
			required: [true, 'enter product description'],
		},
		colors: [String],
		price: {
			type: Number,
			required: [true, 'Product should have price'],
		},
		priceAfterDiscount: {
			type: Number,
		},
		quantity: {
			type: Number,
			required: [true, 'enter quantity of product'],
		},
		images: [String],
		imageCover: {
			type: String,
			required: true,
		},
		sold: {
			type: Number,
			default: 0,
		},
		stock: Boolean,
		category: {
			type: mongoose.Schema.ObjectId,
			ref: 'Category',
			required: [true, 'product must belong to category'],
		},
		subCategories: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'SubCategory',
			},
		],
		brand: {
			type: mongoose.Schema.ObjectId,
			ref: 'Brand',
		},
		ratingsAverage: {
			type: Number,
			min: [1, 'it must be greater than 1.0'],
			max: [5, 'it must be less than 5.0'],
			// required: true,
		},
		ratingsQuantity: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)
schema.virtual('reviews', {
	ref: 'Review',
	foreignField: 'product',
	localField: '_id',
})
schema.pre(/^find/, function (next) {
	this.populate({
		path: 'category',
		select: 'name -_id',
	}).populate('reviews')
	next()
})
/* schema.post('init', (doc) => {
	if (doc.imageCover)
		doc.imageCover = `${process.env.BASE_URL}/img/product/${doc.imageCover}`
	if (doc.images) {
		doc.images = doc.images.map(
			(img) => `${process.env.BASE_URL}/img/product/${img}`
		)
	}
}) */
module.exports = mongoose.model('Product', schema)
