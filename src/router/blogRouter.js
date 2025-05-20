const router = require('express').Router()
const blogCtrl = require('../controller/blogCtrl')
const authMiddleware = require('../middleware/authMiddleware')
const chechAccessMiddleware = require('../middleware/checkAccess')

router.post('/' , chechAccessMiddleware, authMiddleware, blogCtrl.add)
router.get('/' , chechAccessMiddleware, blogCtrl.get)
router.get('/:id' , chechAccessMiddleware, blogCtrl.getOne)
router.put('/:id' , chechAccessMiddleware, authMiddleware, blogCtrl.update)
router.delete('/:id' , chechAccessMiddleware, authMiddleware, blogCtrl.delete)

module.exports = router