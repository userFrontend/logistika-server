const router = require('express').Router()
const carCtrl = require('../controller/carCtrl')
const authMiddleware = require('../middleware/authMiddleware')
const chechAccessMiddleware = require('../middleware/checkAccess')

router.post('/car' , chechAccessMiddleware, authMiddleware, carCtrl.add)
router.get('/car' , chechAccessMiddleware, carCtrl.get)
router.get('/car/:id' , chechAccessMiddleware, carCtrl.getOne)
router.put('/car/:id' , chechAccessMiddleware, authMiddleware, carCtrl.update)
router.delete('/car/:id' , chechAccessMiddleware, authMiddleware, carCtrl.delete)

module.exports = router