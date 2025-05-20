const cloudinary = require('cloudinary')
const fs = require('fs');

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

const Category = require("../model/categoryModel")
const Blog = require("../model/blogModel")

const categoryCtrl = {
    add: async (req, res) => {
        const {name} = req.body
        try {
            if(!name){
                return res.status(403).json({message: 'Please fill all lines'})
            }
            const category = new Category(req.body)
            await category.save()
            res.status(201).json({message: 'new Category', category})
        } catch (error) { 
            res.status(503).json({message: error.message})
        }
        
    },
    get: async (req, res) => {
        try {
            const categorys = await Category.find()
            res.status(200).json({message: 'All categorys', data: categorys})
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
            const deleteCategory = await Category.findByIdAndDelete(id)
            if(!deleteCategory){
                return res.status(400).send({message: 'Category not found'})
            }
            if(deleteCategory.image){
                await cloudinary.v2.uploader.destroy(deleteCategory.image.public_id, async (err) =>{
                    if(err){
                        throw err
                    }
                })
            }
            res.status(200).send({message: 'Category deleted', data: deleteCategory})
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
            const updateCategory = await Category.findById(id)
            if(!updateCategory){
                return res.status(400).send({message: 'Category not found'})
            }
            if(req.files){
                const {image} = req.files;
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
                    if(updateCategory.image){
                        await cloudinary.v2.uploader.destroy(updateCategory.image.public_id, async (err) =>{
                            if(err){
                                throw err
                            }
                        })
                    }
                    const imag = {public_id : imagee.public_id, url: imagee.secure_url}
                    req.body.image = imag;
                }
                }
            const newCategory = await Category.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).send({message: 'Update successfully', data: newCategory})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    }
}

module.exports = categoryCtrl