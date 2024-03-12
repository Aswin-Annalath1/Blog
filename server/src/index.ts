import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import allRoutes from './routes/index'; 
import path from 'path';

const app = express(); // Express Server Setup

app.use(
  cors({ credentials: true, origin: 'https://main--blogeeeee.netlify.app/', methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]})
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // This line allows serving static files from the /uploads directory.

import dotenv from 'dotenv';
dotenv.config();

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log('MongoDB is connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:',(error as Error).message);
  }
};

connection();

// Here we are Implementing all the routes..
app.use('/', allRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
