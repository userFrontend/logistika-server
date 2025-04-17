const router = require('express').Router()
const authCtrl = require('../controller/authCtrl')
const authMiddleware = require('../middleware/authMiddleware')

// FormData register
router.post('/mail' , authCtrl.sendMail)
router.post('/login' , authCtrl.login)
router.post('/signup' , authMiddleware, authCtrl.signup)
router.post('/google' , authMiddleware, authCtrl.googleAuth)
router.post('/forgot' , authMiddleware, authCtrl.forgotPassword)

module.exports = router