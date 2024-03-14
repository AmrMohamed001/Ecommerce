const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		items: [
			{
				product: {
					type: mongoose.Schema.ObjectId,
					ref: 'Product',
				},
				color: String,
				quantity: Number,
				price: Number,
			},
		],
		taxPrice: {
			type: Number,
			default: 0,
		},
		shippingPrice: {
			type: Number,
			default: 0,
		},
		shippingAddress: {
			city: String,
			details: String,
			phone: String,
			postalCode: Number,
		},
		totalPrice: Number,
		paymentMethod: {
			type: String,
			enum: ['cash', 'card'],
			default: 'cash',
		},
		isPaid: {
			type: Boolean,
			default: false,
		},
		paidAt: Date,
		isDelivered: {
			type: Boolean,
			default: false,
		},
		deliveredAt: Date,
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Order', schema)
