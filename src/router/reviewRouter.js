const router = require('express').Router()
const reviewCtrl = require('../controller/reviewCtrl')
const authMiddleware = require('../middleware/authMiddleware')
const chechAccessMiddleware = require('../middleware/checkAccess')

router.post('/' , chechAccessMiddleware, authMiddleware, reviewCtrl.add)
router.get('/' , chechAccessMiddleware, reviewCtrl.get)
router.get('/:id' , chechAccessMiddleware, reviewCtrl.getOne)
router.put('/:id' , chechAccessMiddleware, authMiddleware, reviewCtrl.update)
router.delete('/:id' , chechAccessMiddleware, authMiddleware, reviewCtrl.delete)

module.exports = router