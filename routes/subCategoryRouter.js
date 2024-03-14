const router = require('express').Router({ mergeParams: true })
const controller = require('../controllers/subCategoryController')

router
	.route('/')
	.get(controller.createFilterObj, controller.getAllSubs)
	.post(controller.setCategoryId, controller.slugSub, controller.createSub)
router
	.route('/:id')
	.get(controller.getSub)
	.patch(controller.slugSub, controller.updateSub)
	.delete(controller.deleteSub)
module.exports = router
