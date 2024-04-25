const express=require('express');
const dotenv=require('dotenv').config();
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const mongoURI=process.env.MONGO_URI;
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))
mongoose.connect(mongoURI)
.then(()=>console.log('Connected to MongoDB'))
.catch(err=>console.error('Error connecting to MongoDB:',err));
const userSchema=new mongoose.Schema({
    name: String,
    email: String,
    password:String
});
const User =mongoose.model('User',userSchema);
app.listen(process.env.PORT,()=>console.log("Connected to server"));