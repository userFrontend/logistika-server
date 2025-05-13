const router = require('express').Router()
const authCtrl = require('../controller/authCtrl')
const authMiddleware = require('../middleware/authMiddleware')
const chechAccessMiddleware = require('../middleware/checkAccess')

// FormData register
router.post('/mail' , chechAccessMiddleware, authCtrl.sendMail)
router.get('/year/:year' , chechAccessMiddleware,  authCtrl.getYear)
router.get('/make/:year/:make' , chechAccessMiddleware, authCtrl.getMakes)
router.post('/login' , chechAccessMiddleware, authMiddleware, authCtrl.login)
router.post('/signup', chechAccessMiddleware, authMiddleware, authCtrl.signup)
router.post('/google' , chechAccessMiddleware, authMiddleware, authCtrl.googleAuth)
router.post('/forgot' , chechAccessMiddleware, authMiddleware, authCtrl.forgotPassword)

module.exports = router