
const chechAccessMiddleware = (req, res, next) => {
    let verificationCode = req.headers.verificationtoken;
    try {
        if(!verificationCode || verificationCode !== "ulamYPMnafsAsJJXdSfqjZhasg23faSICreybtXN") {
            return res.status(401).json({message: "What are you doing here? :)"})
        }
        next()
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = chechAccessMiddleware