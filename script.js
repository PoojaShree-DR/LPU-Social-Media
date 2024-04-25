const express=require('express');
const dotenv=require('dotenv').config();
const mongoose=require('mongoose');
const app=express();
const mongoURI=process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(()=>console.log('Connected to MongoDB'))
.catch(err=>console.error('Error connecting to MongoDB:',err));
app.listen(process.env.PORT,()=>console.log("Connected to server"));