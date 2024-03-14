const router = require('express').Router()
const controller = require('../controllers/addressesController')
const auth = require('../controllers/authController')

router.use(auth.protect)
router
	.route('/')
	.get(controller.getLoggedUserAddresses)
	.post(controller.addAddressToUser)
router.route('/:id').delete(controller.deleteAddressFromUser)
module.exports = router
