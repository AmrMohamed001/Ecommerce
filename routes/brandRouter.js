const router = require('express').Router()
const controller = require('../controllers/brandController')

router
	.route('/')
	.get(controller.getAllBrands)
	.post(
		controller.uplaodCategoryImage,
		controller.resizeImage,
		controller.slugBrand,
		controller.createBrand
	)

router
	.route('/:id')
	.get(controller.getBrand)
	.patch(
		controller.uplaodCategoryImage,
		controller.resizeImage,
		controller.slugBrand,
		controller.updateBrand
	)
	.delete(controller.deleteBrand)

module.exports = router
