const router = require('express').Router()
const auth = require('../controllers/authController')

router.post('/signup', auth.signup)
router.post('/login', auth.login)
router.post('/forget-password', auth.forgetPassword)
router.post('/verify-code', auth.verifyPin)
router.patch('/reset-password', auth.resetPassword)

module.exports = router
