const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		cartItem: [
			{
				product: {
					type: mongoose.Schema.ObjectId,
					ref: 'Product',
				},
				color: String,
				quantity: {
					type: Number,
					default: 1,
				},
				price: Number,
			},
		],
		totalCartPrice: Number,
		totalPriceAfterDiscount: Number,
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
)
module.exports = mongoose.model('Cart', schema)
