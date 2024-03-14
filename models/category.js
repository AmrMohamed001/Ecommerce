const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'you should enter category name'],
			unique: [true, 'category name should be unique'],
			minLength: [3, 'Too short name'],
		},
		slug: {
			type: String,
			lower: true,
		},
		image: String,
	},
	{
		timestamps: true,
	}
)
schema.post('init', (doc) => {
	if (doc.image) doc.image = `${process.env.BASE_URL}/img/category/${doc.image}`
})
const Category = mongoose.model('Category', schema)
module.exports = Category
