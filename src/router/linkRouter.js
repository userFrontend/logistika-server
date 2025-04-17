const router = require('express').Router()
const linkCtrl = require('../controller/linkCtrl')

// FormData register
router.post('/' , linkCtrl.add)
router.get('/' , linkCtrl.get)
router.delete('/:id', linkCtrl.delete)
router.put('/:id', linkCtrl.update)

module.exports = router