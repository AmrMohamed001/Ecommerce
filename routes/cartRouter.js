const router = require('express').Router()
const controller = require('../controllers/cartController')
const auth = require('../controllers/authController')

router.use(auth.protect)
router
	.route('/')
	.get(controller.getLoggedUserCart)
	.post(controller.addProductToCart)
	.delete(controller.emptyCart)
router.patch('/coupon', controller.applyCoupon)
router
	.route('/:id')
	// .get(controller.getCoupon)
	.patch(controller.updateProductQuantity)
	.delete(controller.removeProductFromCart)

module.exports = router
