const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')

exports.addAddressToUser = catchAsync(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$addToSet: { address: req.body },
		},
		{ new: true }
	)
	res.status(201).json({
		status: 'success',
		data: {
			userID: req.user._id,
			addresses: user.address,
		},
	})
})
exports.deleteAddressFromUser = catchAsync(async (req, res) => {
	const user = await User.findByIdAndUpdate(
		req.user._id,
		{
			$pull: { address: { _id: req.params.id } },
		},
		{ new: true }
	)
	res.status(202).json({
		status: 'success',
		data: user.address,
	})
})
exports.getLoggedUserAddresses = catchAsync(async (req, res) => {
	const user = await User.findById(req.user._id)
	res.status(202).json({
		status: 'success',
		results: user.address.length,
		data: {
			userID: req.user._id,
			addresses: user.address,
		},
	})
})
