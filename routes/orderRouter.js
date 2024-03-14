const router = require('express').Router()
const controller = require('../controllers/orderController')
const auth = require('../controllers/authController')
///////////////////////////////////////////////////////
router.use(auth.protect)
router.post('/checkout-session/:cartId', controller.createStripeSession)
router.get('/my-orders', controller.getOrdersForUser)
router.patch('/:id/pay', auth.allowTo('admin'), controller.updateOrderPayState)
router.patch(
	'/:id/deliver',
	auth.allowTo('admin'),
	controller.updateOrderDeliverState
)
router
	.route('/')
	.get(auth.allowTo('admin'), controller.getOrders)
	.post(controller.createCashOrder)
router.route('/:id').get(controller.getSpecificOrder)
module.exports = router
