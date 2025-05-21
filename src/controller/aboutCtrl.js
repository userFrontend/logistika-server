const About = require("../model/aboutModel")

const aboutCtrl = {
    add: async (req, res) => {
        try {
            const work = new About(req.body)
            await work.save()
            res.status(201).json({message: 'New About', data: work})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
        
    },
    get: async (req, res) => {
        try {
            const works = await About.find()
            res.status(200).json({message: 'Information', info: works})
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
            const deleteWork = await About.findByIdAndDelete(id)
            if(!deleteWork){
                return res.status(400).send({message: 'About not found'})
            }
             if(deleteWork.homeImg){
                await cloudinary.v2.uploader.destroy(deleteBlog.image.public_id, async (err) =>{
                    if(err){
                        throw err
                    }
                })
            }
            res.status(200).send({message: 'About deleted', data: deleteWork})
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
            const updateWork = await About.findById(id)
            if(!updateWork){
                return res.status(400).send({message: 'About not found'})
            }
            if(req.files){
                const {image} = req.files;
                console.log(image);
                
                if(image){
                    const imagee = await cloudinary.v2.uploader.upload(image.tempFilePath, {
                        folder: 'AVOX'
                    }, async (err, result) => {
                        if(err){
                            throw err
                        } else {
                            removeTemp(image.tempFilePath)
                            return result
                        }
                    })
                    if(updateBlog.homeImg){
                        await cloudinary.v2.uploader.destroy(updateBlog.homeImg.public_id, async (err) =>{
                            if(err){
                                throw err
                            }
                        })
                    }
                    const imag = {public_id : imagee.public_id, url: imagee.secure_url}
                    req.body.homeImg = imag;
                }
            }
            const newWork = await About.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', data: newWork})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
}

module.exports = aboutCtrl