const router = require('express').Router()
const reviewRouter = require('./reviewRouter')
const controller = require('../controllers/productController')

router.use('/:productId/reviews', reviewRouter)
router
	.route('/')
	.get(controller.validateProductInStock, controller.getAllProducts)
	.post(
		controller.uplaodProductImage,
		controller.resizeProductImages,
		controller.slugProduct,
		controller.validateCreatingProduct,
		controller.createProduct
	)

router
	.route('/:id')
	.get(controller.validateProductInStock, controller.getProduct)
	.patch(
		controller.uplaodProductImage,
		controller.resizeProductImages,
		controller.slugProduct,
		controller.updateProduct
	)
	.delete(controller.deleteProduct)

module.exports = router
