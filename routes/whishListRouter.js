const router = require('express').Router()
const controller = require('../controllers/whishListController')
const auth = require('../controllers/authController')

router.use(auth.protect)
router
	.route('/')
	.get(controller.getLoggedUserWhishList)
	.post(controller.addProductToWhishList)
router.route('/:id').delete(controller.deleteProductFromWhishList)
module.exports = router
