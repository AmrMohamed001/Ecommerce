const router = require('express').Router()
const controller = require('../controllers/couponsController')
const auth = require('../controllers/authController')

router.use(auth.protect, auth.allowTo('admin'))
router.route('/').get(controller.getAllCoupons).post(controller.createCoupon)

router
	.route('/:id')
	.get(controller.getCoupon)
	.patch(controller.updateCoupon)
	.delete(controller.deleteCoupon)

module.exports = router
