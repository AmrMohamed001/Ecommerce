const router = require('express').Router()
const controller = require('../controllers/cartController')
const auth = require('../controllers/authController')

router
	.route('/')
	.get(auth.protect, controller.getLoggedUserCart)
	.post(auth.protect, controller.addProductToCart)
	.delete(auth.protect, controller.emptyCart)
router.patch('/coupon', auth.protect, controller.applyCoupon)
router
	.route('/:id')
	// .get(controller.getCoupon)
	.patch(auth.protect, controller.updateProductQuantity)
	.delete(auth.protect, controller.removeProductFromCart)

module.exports = router
