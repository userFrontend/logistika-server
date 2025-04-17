const router = require('express').Router()
const navbarCtrl = require('../controller/navbarCtrl')

// FormData register
router.post('/' , navbarCtrl.add)
router.get('/' , navbarCtrl.get)
router.delete('/:id', navbarCtrl.delete)
router.put('/:id', navbarCtrl.update)

module.exports = router