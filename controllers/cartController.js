const Product = require('../models/product')
const Cart = require('../models/cart')
const Coupon = require('../models/coupons')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')

const calcTotalPrice = function (cart) {
	let totalPrice = 0
	cart.cartItem.forEach((item) => {
		totalPrice += item.quantity * item.price
	})
	cart.totalCartPrice = totalPrice
	cart.totalPriceAfterDiscount = undefined
}

exports.addProductToCart = catchAsync(async (req, res) => {
	// 1- first scenario is to check if user have cart or not and if not create one
	const product = await Product.findById(req.body.product)
	let cart = await Cart.findOne({ user: req.user._id })
	if (!cart) {
		// create cart for this product
		cart = await Cart.create({
			cartItem: [
				{
					product: req.body.product,
					color: req.body.color,
					quantity: req.body.quantity,
					price: product.price,
				},
			],
			user: req.user._id,
		})
	} else {
		// 2-second scenario is to check if the product exists in the cart
		const cartIndex = cart.cartItem.findIndex(
			(item) =>
				item.product.toString() === req.body.product &&
				item.color === req.body.color
		)
		if (cartIndex > -1) {
			//update quantity
			const cartItem = cart.cartItem[cartIndex]
			cartItem.quantity += 1
			cart.cartItem[cartIndex] = cartItem
		} else {
			//push it to cart items []
			cart.cartItem.push({
				product: req.body.product,
				color: req.body.color,
				quantity: req.body.quantity,
				price: product.price,
			})
		}
	}
	// calculate total price
	calcTotalPrice(cart)
	await cart.save()
	res.status(201).json({
		status: 'success',
		data: {
			cart,
		},
	})
})

exports.getLoggedUserCart = catchAsync(async (req, res, next) => {
	const cart = await Cart.findOne({ user: req.user._id })
	if (!cart) return next(new AppError(404, 'no cart for this user'))
	res.status(200).json({
		status: 'success',
		results: cart.cartItem.length,
		data: {
			cart,
		},
	})
})

exports.removeProductFromCart = catchAsync(async (req, res, next) => {
	const cart = await Cart.findOneAndUpdate(
		{ user: req.user._id },
		{
			$pull: { cartItem: { _id: req.params.id } },
		},
		{ new: true }
	)
	if (!cart) return next(new AppError(404, 'no cart for this user'))
	calcTotalPrice(cart)
	await cart.save()
	res.status(200).json({
		status: 'success',
		results: cart.cartItem.length,
		data: {
			cart,
		},
	})
})

exports.emptyCart = catchAsync(async (req, res) => {
	await Cart.findOneAndDelete({ user: req.user._id })
	res.status(204).json({
		status: 'success',
		data: null,
	})
})

exports.updateProductQuantity = catchAsync(async (req, res, next) => {
	// body : quantity ---- params : itemId
	const cart = await Cart.findOne({ user: req.user._id })
	if (!cart) return next(new AppError(404, `No cart for this user`))
	const productIndex = cart.cartItem.findIndex(
		(item) => item._id.toString() === req.params.id
	)
	if (productIndex > -1) {
		cart.cartItem[productIndex].quantity = req.body.quantity
	} else
		return next(new AppError(404, `No product with this iD :${req.params.id}`))
	calcTotalPrice(cart)
	await cart.save()
	res.status(200).json({
		status: 'success',
		data: {
			cart,
		},
	})
})

exports.applyCoupon = catchAsync(async (req, res, next) => {
	// body => coupon
	const coupon = await Coupon.findOne({
		name: req.body.coupon,
		expire: { $gt: Date.now() },
	})
	if (!coupon)
		return next(new AppError(400, 'Invalid coupon or expired , try again'))

	const cart = await Cart.findOne({ user: req.user._id })
	if (!cart) return next(new AppError(404, 'no cart for this user'))

	const totalPrice = cart.totalCartPrice
	cart.totalPriceAfterDiscount = Number(
		(totalPrice - (totalPrice * coupon.discount) / 100).toFixed(2)
	)
	await cart.save()
	res.status(200).json({
		status: 'success',
		data: {
			cart,
		},
	})
})
