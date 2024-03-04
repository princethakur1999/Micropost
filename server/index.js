import dotenv from 'dotenv';

dotenv.config();


const PORT = process.env.PORT || 5000;


import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import connectToDatabase from './config/database.js';
import connectToCloudinary from './config/cloudinary.js';


const app = express();




// Enable CORS for all routes
app.use(cors({
    origin: "*",
    credentials: true
}));



// Enable file upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));



// Middleware to parse JSON in the request body
app.use(express.json());



// Used for handling cookies in HTTP requests and responses.
app.use(cookieParser());



// Cloudinary connection
connectToDatabase();



// Cloudinary connection
connectToCloudinary();



// Routes
import authRoutes from './routes/auth.js';

app.use('/', authRoutes);




app.get('/', (req, res) => {

    res.json({
        message: 'Welcome to our Micropost!',
        status: 200
    })
})




app.listen(PORT, () => {

    console.log(`Server listening on port ${PORT}`);

});