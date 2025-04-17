const router = require('express').Router()
const aboutCtrl = require('../controller/aboutCtrl')

// FormData register
router.post('/' , aboutCtrl.add)
router.get('/' , aboutCtrl.get)
router.delete('/:id', aboutCtrl.delete)
router.put('/:id', aboutCtrl.update)

module.exports = router