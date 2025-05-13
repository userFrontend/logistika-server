const router = require('express').Router()
const aboutCtrl = require('../controller/aboutCtrl')
const authMiddleware = require('../middleware/authMiddleware')
const chechAccessMiddleware = require('../middleware/checkAccess')

// FormData register
router.post('/' , chechAccessMiddleware, authMiddleware, aboutCtrl.add)
router.get('/' , chechAccessMiddleware, aboutCtrl.get)
router.delete('/:id', chechAccessMiddleware, authMiddleware, aboutCtrl.delete)
router.put('/:id', chechAccessMiddleware, authMiddleware, aboutCtrl.update)

module.exports = router