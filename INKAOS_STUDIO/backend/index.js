import express from 'express';  
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import userRouter from './router/user.route.js';
import imageRouter from './router/image.route.js';
import addressRouter from './router/address.route.js';
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
app.use('/api/image', imageRouter)
app.use('/api/address', addressRouter)
// Start the server
connectDB().then(()=>{
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`,);
      });
})
