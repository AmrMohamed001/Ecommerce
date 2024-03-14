const router = require('express').Router({ mergeParams: true })
const controller = require('../controllers/reviewController')
const auth = require('../controllers/authController')

router
	.route('/')
	.get(controller.createFilterObj, controller.getAllReviews)
	.post(auth.protect, controller.setProductUserId, controller.createReview)
router
	.route('/:id')
	.get(controller.getReview)
	.patch(auth.protect, controller.validateBeforeUpdate, controller.updateReview)
	.delete(
		auth.protect,
		controller.validateBeforeDelete,
		controller.deleteReview
	)

module.exports = router
