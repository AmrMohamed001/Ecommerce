const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'sub-category should have name'],
			unique: [true, 'sub-category must be unique'],
			minLength: 2,
		},
		slug: {
			type: String,
		},
		category: {
			type: mongoose.Schema.ObjectId,
			ref: 'Category',
			required: [true, 'sub-category must belong to category'],
		},
	},
	{
		timestamps: true,
	}
)

schema.pre(/^find/, function (next) {
	this.populate({
		path: 'category',
		select: 'name ',
	})
	next()
})
module.exports = mongoose.model('SubCategory', schema)
