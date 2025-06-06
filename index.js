const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config();

//routes
const userRouter = require('./src/router/userRouter');
const authRouter = require('./src/router/authRouter');
const navbarRouter = require('./src/router/navbarRouter');
const linkRouter = require('./src/router/linkRouter');
const aboutRouter = require('./src/router/aboutRouter');
const categoryRouter = require('./src/router/categoryRouter');
const blogRouter = require('./src/router/blogRouter');
const reviewRouter = require('./src/router/reviewRouter');


const app = express();
const PORT = process.env.PORT || 18012;
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({useTempFiles: true}));

app.use(cors({
  origin: 'https://avox-beta.vercel.app',
  credentials: true,
}));


app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/navbar', navbarRouter);
app.use('/api/link', linkRouter);
app.use('/api/info', aboutRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blog', blogRouter);
app.use('/api/review', reviewRouter);

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {})
.then(() => {
    app.listen(PORT, () => console.log(`Server stared on port: ${PORT}`));
})
.catch(error => console.log(error));
