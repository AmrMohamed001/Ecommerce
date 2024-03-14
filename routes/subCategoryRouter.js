const router = require('express').Router({ mergeParams: true })
const controller = require('../controllers/subCategoryController')
const auth = require('../controllers/authController')

router
	.route('/')
	.get(controller.createFilterObj, controller.getAllSubs)
	.post(
		auth.protect,
		auth.allowTo('admin'),
		controller.setCategoryId,
		controller.slugSub,
		controller.createSub
	)
router
	.route('/:id')
	.get(controller.getSub)
	.patch(
		auth.protect,
		auth.allowTo('admin'),
		controller.slugSub,
		controller.updateSub
	)
	.delete(auth.protect, auth.allowTo('admin'), controller.deleteSub)
module.exports = router
