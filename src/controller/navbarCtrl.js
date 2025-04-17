const Navbar = require("../model/navbarModel")

const navbarCtrl = {
    add: async (req, res) => {
        try {
            const work = new Navbar(req.body)
            await work.save()
            res.status(201).json({message: 'new work', work})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
        
    },
    get: async (req, res) => {
        try {
            const navbars = await Navbar.aggregate([
              {
                $lookup: {
                  from: 'links',             // Link modelining collection nomi (pastda eslatma bor)
                  localField: '_id',         // Navbar _id
                  foreignField: 'navbarId',  // Link ichidagi reference
                  as: 'links'                // Qo‘shiladigan array field
                }
              }
            ]);
        
            res.status(200).json({
              message: 'All navbars with linked links',
              data: navbars
            });
          } catch (error) {
            res.status(503).json({ message: error.message });
          }
    },
    delete: async (req, res) => {
        const {id} = req.params
        if(!id){
            return res.status(403).json({message: 'insufficient information'})
        }
        try {
            const deleteWork = await Navbar.findByIdAndDelete(id)
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
            const updateWork = await Navbar.findById(id)
            if(!updateWork){
                return res.status(400).send({message: 'work not found'})
            }
            const newWork = await Navbar.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', newWork})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
}

module.exports = navbarCtrl