const router = require('express').Router()
const controller = require('../controllers/whishListController')
const auth = require('../controllers/authController')

router
	.route('/')
	.get(auth.protect, controller.getLoggedUserWhishList)
	.post(auth.protect, controller.addProductToWhishList)
router.route('/:id').delete(auth.protect, controller.deleteProductFromWhishList)
module.exports = router
