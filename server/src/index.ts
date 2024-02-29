import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import allRoutes from './routes/index'; 

const app: Application = express(); // Express Server Setup

app.use(
  cors({ credentials: true, origin: 'http://localhost:5173' })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(__dirname + '/uploads')); // This line allows serving static files from the /uploads directory.

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

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});