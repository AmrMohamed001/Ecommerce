const mongoose = require('mongoose')

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			unique: true,
			required: [true, 'coupons must have a name'],
		},
		expire: {
			type: Date,
			required: [true, 'coupons must have an expiration'],
		},
		discount: {
			type: Number,
			required: [true, 'coupons must have a discount'],
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Coupon', schema)
