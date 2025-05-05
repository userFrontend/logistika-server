const router = require('express').Router()
const authCtrl = require('../controller/authCtrl')
const authMiddleware = require('../middleware/authMiddleware')

// FormData register
router.post('/mail' , authCtrl.sendMail)
router.get('/year/:year' , authCtrl.getYear)
router.get('/make/:year/:make' , authCtrl.getMakes)
router.post('/login' , authCtrl.login)
router.post('/signup', authCtrl.signup)
router.post('/google' , authMiddleware, authCtrl.googleAuth)
router.post('/forgot' , authMiddleware, authCtrl.forgotPassword)

module.exports = router