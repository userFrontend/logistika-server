const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config();

//routes
const userRouter = require('./src/router/userRouter');


const app = express();
const PORT = process.env.PORT || 4001;

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({useTempFiles: true}));
app.use(cors());

app.use('/api/user', userRouter);

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {})
.then(() => {
    app.listen(PORT, () => console.log(`Server stared on port: ${PORT}`));
})
.catch(error => console.log(error));
