const router = require('express').Router()
const controller = require('../controllers/orderController')
const auth = require('../controllers/authController')
///////////////////////////////////////////////////////
router.post(
	'/checkout-session/:cartId',
	auth.protect,
	controller.createStripeSession
)
router.get('/my-orders', auth.protect, controller.getOrdersForUser)
router.patch(
	'/:id/pay',
	auth.protect,
	auth.allowTo('admin'),
	controller.updateOrderPayState
)
router.patch(
	'/:id/deliver',
	auth.protect,
	auth.allowTo('admin'),
	controller.updateOrderDeliverState
)
router
	.route('/')
	.get(auth.protect, auth.allowTo('admin'), controller.getOrders)
	.post(auth.protect, controller.createCashOrder)
router.route('/:id').get(auth.protect, controller.getSpecificOrder)
module.exports = router
