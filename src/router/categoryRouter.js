const router = require('express').Router()
const categoryCtrl = require('../controller/categoryCtrl')
const authMiddleware = require('../middleware/authMiddleware')
const chechAccessMiddleware = require('../middleware/checkAccess')

// FormData register
router.post('/' , chechAccessMiddleware, authMiddleware ,categoryCtrl.add)
router.get('/' , chechAccessMiddleware, categoryCtrl.get)
router.put('/:id' , chechAccessMiddleware, authMiddleware, categoryCtrl.update)
router.delete('/:id' , chechAccessMiddleware, authMiddleware, categoryCtrl.delete)

module.exports = router