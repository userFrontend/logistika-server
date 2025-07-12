const router = require('express').Router()
const authCtrl = require('../controller/authCtrl')
const chechAccessMiddleware = require('../middleware/checkAccess')

// FormData register
router.post('/submit' , chechAccessMiddleware, authCtrl.sendContact)
router.post('/mail' , chechAccessMiddleware, authCtrl.sendMail)
router.get('/year/:year' , chechAccessMiddleware,  authCtrl.getYear)
router.get('/make/:year/:make' , chechAccessMiddleware, authCtrl.getMakes)
router.post('/login' , chechAccessMiddleware, authCtrl.login)
router.post('/signup', chechAccessMiddleware, authCtrl.signup)
router.post('/google' , chechAccessMiddleware, authCtrl.googleAuth)
router.post('/forgot' , chechAccessMiddleware, authCtrl.forgotPassword)

module.exports = router