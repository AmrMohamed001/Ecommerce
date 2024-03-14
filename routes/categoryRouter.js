const router = require('express').Router()
const controller = require('../controllers/categoryController')
const subRouter = require('./subCategoryRouter')
const auth = require('../controllers/authController')
// Nested-Route
// /categories/:categoryId/sub-categories
router.use('/:categoryId/sub-categories', subRouter)
router
	.route('/')
	.get(controller.getAllCategories)
	.post(
		auth.protect,
		auth.allowTo('admin'),
		/*categoryValidations.validateAddCategory,*/ controller.uplaodCategoryImage,
		controller.resizeImage,
		controller.slugCategory,
		controller.createCategory
	)

router
	.route('/:id')
	.get(/*categoryValidations.validateGetUpDelCategory,*/ controller.getCategory)
	.patch(
		/*categoryValidations.validateGetUpDelCategory,*/
		auth.protect,
		auth.allowTo('admin'),
		controller.uplaodCategoryImage,
		controller.resizeImage,
		controller.slugCategory,
		controller.updateCategory
	)
	.delete(
		/*categoryValidations.validateGetUpDelCategory,*/
		auth.protect,
		auth.allowTo('admin'),
		controller.deleteCategory
	)

module.exports = router
