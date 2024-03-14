const router = require('express').Router()
const controller = require('../controllers/addressesController')
const auth = require('../controllers/authController')

router
	.route('/')
	.get(auth.protect, controller.getLoggedUserAddresses)
	.post(auth.protect, controller.addAddressToUser)
router.route('/:id').delete(auth.protect, controller.deleteAddressFromUser)
module.exports = router
