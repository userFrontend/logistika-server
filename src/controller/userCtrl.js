const bcrypt = require('bcrypt')



const User = require("../model/userModel")

const userCtl = {
    getUser: async (req, res) => {
        const {id} = req.params
        try {
            const findUser = await User.findById(id);
            if(!findUser){
                return res.status(404).json({message: "User not found"})
            }
            res.status(200).json({message: "Find user", user: findUser})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    getAllUsers: async (req, res) => {
        try {
            let users = await User.find();
            res.status(200).json({message: "All users", getAll: users})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    deleteUser: async (req, res) => {
        const {id} = req.params
        try {
            if(id === req.user._id || req.userIsAdmin){
                const deleteUser = await User.findByIdAndDelete(id)
                if(deleteUser){
                    return res.status(200).json({message: "User deleted successfully", user: deleteUser})
                }
                return res.status(404).json({message: 'User not found'})
            }
            res.status(405).json({message: 'Acces Denied!. You can delete only your own accout'})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    update: async (req, res) => {
        const {id} = req.params
        const findUser = await User.findById(req.user.id)
        try {
            if(id === findUser._id || findUser.role === 'admin'){
                const updateUser = await User.findById(id)
                if(req.body.password && (req.body.password != "")){
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);
                    req.body.password = hashedPassword;
                } else{
                    delete req.body.password
                }

                if(updateUser){
                    const user = await User.findByIdAndUpdate(id, req.body, {new: true});
                    return res.status(200).json({message: "User update successfully", user})
                }
                return res.status(404).json({message: "User not found"})
            }
            res.status(405).json({message: 'Acces Denied!. You can delete only your own accout'})
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },
    like: async (req, res) => {
        const {id} = req.params;
        const {prodId} = req.body
        try {
            const user = await User.findById(id);
            if(!user){
                return res.status(404).send({message: "User is Not Found"})
            }
            if(user.likes.includes(prodId)){
                await user.updateOne({$pull: {likes: prodId}})
                const updatedUser = await User.findById(id)
                res.status(200).json({message: "Like lancled", user: updatedUser})
            } else {
                await user.updateOne({$push: {likes: prodId}})
                const updatedUser = await User.findById(id)
                res.status(200).json({message: "Like added", user: updatedUser})
            }
        } catch (error) {
            res.status(503).json({message: error.message})
        }
    },


}


module.exports = userCtl