const stripe = require('stripe')(process.env.STRIPE_SECRET)
const Cart = require('../models/cart')
const Order = require('../models/order')
const Product = require('../models/product')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const factory = require('./factoryHandler')

exports.createCashOrder = catchAsync(async (req, res, next) => {
	// body => address
	const cartForUser = await Cart.findOne({ user: req.user._id })
	if (!cartForUser)
		return next(new AppError(400, 'no cart for this user to make order'))
	const shippingPrice = 0
	const taxPrice = 0
	const totalPrice = cartForUser.totalPriceAfterDiscount
		? cartForUser.totalPriceAfterDiscount + shippingPrice + taxPrice
		: cartForUser.totalCartPrice + shippingPrice + taxPrice
	//1- create order
	const order = await Order.create({
		user: req.user._id,
		items: cartForUser.cartItem,
		shippingPrice,
		shippingAddress: req.body.shippingAddress,
		taxPrice,
		totalPrice,
		paymentMethod: 'cash',
	})
	//2- decrease quantity and increase sold (product)
	if (order) {
		cartForUser.cartItem.forEach(async (item) => {
			await Product.findByIdAndUpdate(item.product, {
				$inc: { quantity: -item.quantity, sold: item.quantity },
			})
		})
		//3- clear cart for this user
		await Cart.findOneAndDelete({ user: req.user._id })
	}
	res.status(200).json({
		status: 'success',
		data: {
			order,
		},
	})
})
exports.getOrdersForUser = catchAsync(async (req, res, next) => {
	const order = await Order.find({ user: req.user._id })
	if (!order) return next(new AppError(404, 'no order for this user'))
	res.status(200).json({
		status: 'success',
		data: {
			order,
		},
	})
})
exports.getOrders = factory.getAll(Order)
exports.getSpecificOrder = factory.getOne(Order)

exports.updateOrderPayState = catchAsync(async (req, res, next) => {
	const order = await Order.findByIdAndUpdate(
		req.params.id,
		{
			isPaid: true,
			paidAt: Date.now(),
		},
		{ new: true }
	)
	if (!order) return next(new AppError(404, 'no order with this id'))
	res.status(200).json({
		status: 'success',
		data: {
			order,
		},
	})
})
exports.updateOrderDeliverState = catchAsync(async (req, res, next) => {
	const order = await Order.findByIdAndUpdate(
		req.params.id,
		{
			isDelivered: true,
			deliveredAt: Date.now(),
		},
		{ new: true }
	)
	if (!order) return next(new AppError(404, 'no order with this id'))
	res.status(200).json({
		status: 'success',
		data: {
			order,
		},
	})
})
exports.createStripeSession = catchAsync(async (req, res, next) => {
	// 1- Get cart
	const cart = await Cart.findById(req.params.cartId)
	if (!cart)
		return next(new AppError(404, `No cart with this id ${req.params.cartId}`))

	// 2-Get total price
	const totalPrice = cart.totalPriceAfterDiscount
		? cart.totalPriceAfterDiscount
		: cart.totalCartPrice

	// 3-Create checkout session
	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: [
			{
				price_data: {
					currency: 'EGP',
					unit_amount: totalPrice * 100,
					product_data: {
						name: 'Your cart',
						images: [
							'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbjsRxM6Rpk5awjSvwsl3W-SqyJJtFPQ_Lkw&usqp=CAU',
						],
					},
				},
				quantity: 1,
			},
		],
		success_url: `${req.protocol}://${req.get('host')}/orders`,
		cancel_url: `${req.protocol}://${req.get('host')}/carts`,
		customer: req.user._id.toString(),
		client_reference_id: req.params.cartId,
		customer_email: req.user.email,
		metadata: req.body.shippingAddress,
	})

	// send session as response
	res.status(200).json({ status: 'success', data: session })
})
const createOnlineOrder = async function (session) {
	const cart = await Cart.findById(session.client_reference_id)
	const order = await Order.create({
		user: session.customer,
		items: cart.cartItem,
		shippingAddress: session.metadata,
		totalPrice: session.amount_total,
		paymentMethod: 'card',
		isPaid: true,
		paidAt: Date.now(),
	})
	//2- decrease quantity and increase sold (product)
	if (order) {
		cart.cartItem.forEach(async (item) => {
			await Product.findByIdAndUpdate(item.product, {
				$inc: { quantity: -item.quantity, sold: item.quantity },
			})
		})
		//3- clear cart for this user
		await Cart.findByIdAndDelete(cart._id)
	}
}
exports.webhookCheckout = catchAsync(async (req, res, next) => {
	const sig = req.headers['stripe-signature']
	let event
	try {
		event = stripe.webhooks.constructEvent(
			req.body,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET
		)
	} catch (err) {
		return res.status(400).send(`Webhook Error: ${err.message}`)
	}
	if (event.type === 'checkout.session.completed') {
		console.log(event.data.object.amount_total) //total price
		console.log(event.data.object.customer_email) //user email
		console.log(event.data.object.metadata) //address
		console.log(event.data.object.payment_method_types) //address
		console.log(event.data.object.payment_status) //address
		console.log(event.data.object.status) //address
		console.log(event.data.object.client_reference_id) //cartId
		console.log(event.data.object.customer) //customer id

		createOnlineOrder(event.data.object)
		res.status(200).json({
			status: 'success',
			received: true,
		})
		/*
		20000
		test1@gmail.com
		{ postal: '1234', details: 'شارع الكنيسه', city: 'Damietta' }
		[ 'card' ]
		paid
		complete
		*/
	}
})
