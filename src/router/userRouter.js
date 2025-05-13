const router = require('express').Router()
const userCtrl = require('../controller/userCtrl')
const authMiddleware = require('../middleware/authMiddleware')
const chechAccessMiddleware = require('../middleware/checkAccess')

// FormData register
router.get('/' , chechAccessMiddleware, userCtrl.getAllUsers)
router.get('/:id' , chechAccessMiddleware, userCtrl.getUser)
router.put('/:id' , chechAccessMiddleware, authMiddleware, userCtrl.update)
router.delete('/:id' , chechAccessMiddleware, authMiddleware, userCtrl.deleteUser)
router.put('/like/:id' , chechAccessMiddleware, authMiddleware, userCtrl.like)

module.exports = router