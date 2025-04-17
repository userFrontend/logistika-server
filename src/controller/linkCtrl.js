const Link = require("../model/linkModel")

const linkCtrl = {
    add: async (req, res) => {
        try {
            const work = new Link(req.body)
            await work.save()
            res.status(201).json({message: 'new work', work})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
        
    },
    get: async (req, res) => {
        try {
            const works = await Link.find()
            res.status(200).json({message: 'All works', getAll: works})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    delete: async (req, res) => {
        const {id} = req.params
        if(!id){
            return res.status(403).json({message: 'insufficient information'})
        }
        try {
            const deleteWork = await Link.findByIdAndDelete(id)
            if(!deleteWork){
                return res.status(400).send({message: 'Work not found'})
            }
            res.status(200).send({message: 'Work deleted', deleteWork})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    update: async (req, res) => {
        const {id} = req.params
        if(!id){
            return res.status(403).json({message: 'insufficient information'})
        }
        try {
            const updateWork = await Link.findById(id)
            if(!updateWork){
                return res.status(400).send({message: 'work not found'})
            }
            const newWork = await Link.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', newWork})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
}

module.exports = linkCtrl