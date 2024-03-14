const router = require('express').Router()
const controller = require('../controllers/brandController')
const auth = require('../controllers/authController')

router
	.route('/')
	.get(controller.getAllBrands)
	.post(
		auth.protect,
		auth.allowTo('admin'),
		controller.uplaodCategoryImage,
		controller.resizeImage,
		controller.slugBrand,
		controller.createBrand
	)

router
	.route('/:id')
	.get(controller.getBrand)
	.patch(
		auth.protect,
		auth.allowTo('admin'),
		controller.uplaodCategoryImage,
		controller.resizeImage,
		controller.slugBrand,
		controller.updateBrand
	)
	.delete(auth.protect, auth.allowTo('admin'), controller.deleteBrand)

module.exports = router
