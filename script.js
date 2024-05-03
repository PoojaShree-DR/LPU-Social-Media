const express=require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv=require('dotenv').config();
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const multer = require('multer');
const fs = require('fs').promises;
const mongoURI=process.env.MONGO_URI;
const Feed=require('./Feed');
const User=require('./User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>console.log('Connected to MongoDB'))
.catch(err=>console.error('Error connecting to MongoDB:',err));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/Signin.html'));
});
// const storage = multer.diskStorage({
//   destination: 'public',
//   filename: (req, file, cb) => {
//       cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage }).single('testImage');
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({
      username:req.body.username,
      email:req.body.email,
      password:req.body.password,
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


const userSchema = new mongoose.Schema({
  email:String,
  password:String,
});

//signin method
app.post('/signin', async (req, res) => {

  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check if user's password exists and compare passwords
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      // Passwords don't match
      console.log('invalid cannot return');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Passwords match, create a JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, 'your_secret_key');
    console.log('gonna return');
    return res.json({ message: 'Login successful', token });
    
  } catch (error) {
    console.error(error);
    console.log('internal error');
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/uploads/') // Destination folder for uploaded images
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname) // Unique filename
  }
});

const upload = multer({ storage: storage });

app.post('/createpost', upload.single('image'), async (req, res) => {
  try {
      let createdBy;
      const { description } = req.body;

      // Check if createdBy is provided in the request
      if (req.body.createdBy) {
          createdBy = req.body.createdBy;
      } else {
          // Find the user with email 'poojashree@lpu.in'
          const user = await User.findOne({ email: 'poojashree@lpu.in' });
          if (!user) {
              throw new Error('User not found');
          }
          createdBy = user._id;
      }

      // Create new feed
      const newFeed = new Feed({
          description: description,
          image: {
              data: req.file.path, // Store file path
              contentType: req.file.mimetype
          },
          createdBy: createdBy,
          likedBy: [],
          imageName: req.file.filename
      });

      // Save the new feed
      await newFeed.save();

      res.status(201).json({ message: 'Post created successfully', feed: newFeed });
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
  }
});


app.get('/feeds', async (req, res) => {
  try {
      const feeds = await Feed.aggregate([
          {
              $lookup: {
                  from: 'users',
                  localField: 'createdBy',
                  foreignField: '_id',
                  as: 'user'
              }
          },
          {
              $addFields: {
                  username: { $arrayElemAt: ['$user.username', 0] }
              }
          },
          {
              $project: {
                  user: 0
              }
          }
      ]);
      res.status(200).json(feeds);
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
  }
});


app.listen(process.env.PORT,()=>console.log("Connected to server"));