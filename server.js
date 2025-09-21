import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/admin.routes.js';

// app config

const app = express()

const port = process.env.PORT || 8000;

connectDB()
connectCloudinary()

// middlewares
app.use(cors());
app.use(express.json());

// api endpoints

app.use('/api/admin',adminRouter)



app.get('/', (req, res) => {res.send('Hello')});

app.listen(port, () => console.log("Server Started",port));
