import express from 'express';  
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import userRouter from './router/user.route.js';

import addressRouter from './router/address.route.js';
import textDesignRouter from './router/textDesign.route.js';
import categoryRouter from './router/category.route.js';
import uploadImageRouter from './router/uploadImage.route.js';
import subCategoryRouter from './router/subCategory.router.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}));
app.use(helmet(
    {
        crossOriginResourcePolicy: false
    }
));
app.use(morgan());
app.use(cookieParser());
app.use(express.json());


// Database connection
const PORT = process.env.PORT || 8080;

// Routes
app.get('/', (request, response) => {
    ///server to client
    response.json({
        message : "Server is running on port " + PORT
    })
});

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/subcategory', subCategoryRouter)
app.use('/api/image', uploadImageRouter)
app.use('/api/address', addressRouter)
app.use('/api/text', textDesignRouter)
// Start the server
connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`,);
      });
})
