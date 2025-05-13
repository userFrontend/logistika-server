const router = require('express').Router()
const navbarCtrl = require('../controller/navbarCtrl')
const authMiddleware = require('../middleware/authMiddleware')
const chechAccessMiddleware = require('../middleware/checkAccess')

// FormData register
router.post('/' , chechAccessMiddleware, authMiddleware, navbarCtrl.add)
router.get('/' , chechAccessMiddleware, navbarCtrl.get)
router.delete('/:id', chechAccessMiddleware, authMiddleware, navbarCtrl.delete)
router.put('/:id', chechAccessMiddleware, authMiddleware, navbarCtrl.update)

module.exports = router