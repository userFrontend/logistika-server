const cloudinary = require('cloudinary')
const fs = require('fs');
const Blog = require("../model/blogModel")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  })

const removeTemp = (pathes) => {
    fs.unlink(pathes, err => {
      if(err){
        throw err
      }
    })
  }


const BlogCtrl = {
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
            const blog = new Blog(req.body);
            await blog.save();
            res.status(201).json({message: 'new Blog', Blog});
        } catch (error) {
            res.status(503).json({message: error.message});
        }
    },    
    get: async (req, res) => {
        try {
            const blogs = await Blog.find()
            res.status(200).json({message: 'All Blogs', data: blogs})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    getOne: async (req, res) => {
        const {id} = req.params
        try {
            const getBlog= await Blog.findById(id);
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
            const deleteBlog= await Blog.findByIdAndDelete(id)
            if(!deleteBlog){
                return res.status(400).send({message: 'Blog not found'})
            }
            if(deleteBlog.photos.length > 0){
                deleteBlog.photos.map(async pic => {
                    await cloudinary.v2.uploader.destroy(pic.public_id, async (err) =>{
                        if(err){
                            throw err
                        }
                    })
                })
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
            const updateBlog= await Blog.findById(id)
            if(!updateBlog){
                return res.status(400).send({message: 'Blog not found'})
            }
            if(req.files){
                const {image} = req.files;
                if(image){
                    const format = image.mimetype.split('/')[1];
                    if(format !== 'png' && format !== 'jpeg') {
                        return res.status(403).json({message: 'file format incorrect'})
                    }
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
                    if(updateBlog.photos.length > 0){
                        updateBlog.photos.map(async pic => {
                            await cloudinary.v2.uploader.destroy(pic.public_id, async (err) =>{
                                if(err){
                                    throw err
                                }
                            })
                        })
                    }
                    const imag = {public_id : imagee.public_id, url: imagee.secure_url}
                    req.body.photos = imag;
                }
                }
            const newBlog= await Blog.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', data: newBlog})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
}

module.exports = BlogCtrl