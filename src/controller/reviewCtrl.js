const Review = require("../model/reviewModal")

const reviewCtrl = {
    add: async (req, res) => {
        try {
            if (req.files) {
                const {image} = req.files;
                if(image) {
                    const createdImage = await cloudinary.v2.uploader.upload(image.tempFilePath, {
                        folder: 'AVOX'
                    });
                    removeTemp(image.tempFilePath);
                    const imag = {public_id: createdImage.public_id, url: createdImage.secure_url};
                    req.body.image = imag;
                }
            }
            const blog = new Review(req.body);
            await blog.save();
            res.status(201).json({message: 'new Review', data: blog});
        } catch (error) {
            res.status(503).json({message: error.message});
        }
    },    
    get: async (req, res) => {
        try {
            const blogs = await Review.find()
            res.status(200).json({message: 'All Review', data: blogs})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    getOne: async (req, res) => {
        const {id} = req.params
        try {
            const getBlog= await Review.findById(id);
            if(!getBlog){
                return res.status(400).send({message: 'Blog not found'})
            }
            res.status(200).json({message: 'Find Blog', data: getBlog})
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
            const deleteBlog= await Review.findByIdAndDelete(id)
            if(!deleteBlog){
                return res.status(400).send({message: 'Blog not found'})
            }
            res.status(200).send({message: 'Blog deleted', data: deleteBlog})
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
            const updateBlog= await Review.findById(id)
            if(!updateBlog){
                return res.status(400).send({message: 'Review not found'})
            }
            const newBlog= await Review.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', data: newBlog})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
}

module.exports = reviewCtrl