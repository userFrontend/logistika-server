const router = require('express').Router()
const linkCtrl = require('../controller/linkCtrl')
const authMiddleware = require('../middleware/authMiddleware')
const chechAccessMiddleware = require('../middleware/checkAccess')

// FormData register
router.post('/' , chechAccessMiddleware, authMiddleware, linkCtrl.add)
router.get('/' , chechAccessMiddleware, linkCtrl.get)
router.delete('/:id', chechAccessMiddleware, authMiddleware, linkCtrl.delete)
router.put('/:id', chechAccessMiddleware, authMiddleware, linkCtrl.update)

module.exports = router