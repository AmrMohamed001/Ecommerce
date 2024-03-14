const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'you should enter brand name'],
			unique: [true, 'brand name should be unique'],
			minLength: [2, 'Too short name for brand'],
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

const Brand = mongoose.model('Brand', schema)
module.exports = Brand
