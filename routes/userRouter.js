const router = require('express').Router()
const controller = require('../controllers/userController')
const auth = require('../controllers/authController')
//for users
router.use(auth.protect)
router.get('/me', controller.me, controller.getUser)
router.patch(
	'/update-me',
	controller.uploadUserImage,
	controller.resizeImage,
	controller.slugUser,
	controller.updateMe
)
router.patch('/update-password', auth.updatePassword)
router.delete('/delete-me', controller.deleteMe)

// for admin
router.use(auth.allowTo('admin'))
router
	.route('/')
	.get(controller.getAllUsers)
	.post(
		controller.uploadUserImage,
		controller.resizeImage,
		controller.slugUser,
		controller.createUser
	)

router
	.route('/:id')
	.get(controller.getUser)
	.patch(
		controller.uploadUserImage,
		controller.resizeImage,
		controller.slugUser,
		controller.updateUser
	)
	.delete(controller.deleteUser)

module.exports = router
