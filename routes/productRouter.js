const router = require('express').Router()
const reviewRouter = require('./reviewRouter')
const controller = require('../controllers/productController')
const auth = require('../controllers/authController')

router.use('/:productId/reviews', reviewRouter)
router
	.route('/')
	.get(controller.getAllProducts)
	.post(
		auth.protect,
		auth.allowTo('admin'),
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
		auth.protect,
		auth.allowTo('admin'),
		controller.uplaodProductImage,
		controller.resizeProductImages,
		controller.slugProduct,
		controller.updateProduct
	)
	.delete(auth.protect, auth.allowTo('admin'), controller.deleteProduct)

module.exports = router
