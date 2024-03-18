const {validationResult}  = require('express-validator');
const Canowner= require('../models/Canowner');
const Canteen = require('../models/Canteen');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose=require('mongoose');

const signup = async  (req, res, next) => {
  const errors = validationResult(req); // this will validate the checks we put on user router file for name email and password.
  if (!errors.isEmpty()) {
   return res.status(422).json({
        meassage:"Invalid input passed,please check your data.",
        success : false
    })
  }
  const { name, email, password } = req.body; // will recieve json data from front to process further

  let existingCanowner;
  try {
    existingCanowner =await Canowner.findOne({ email: email}) // find the email in database
      
  } catch (err) {
      return res.status(500).json({
        message:"Signup Falied.",
        success : false
      })
      
  }
  
      if (existingCanowner) {
          return res.status(422).json({
            message:"User already exists.",
            success : false
          })
          
      }

      let hashedPassword;
      try{
      hashedPassword = await bcrypt.hash(password,12); // hash the password to 12 digits
      }
      catch(err)
      {
        return res.status(500).json({
            message:"Couldn't Create" ,
            success : false
        })
      }
  const createdCanowner =new Canowner ({ // create new user template to enter in database

    name, 
    email,
    password : hashedPassword
   
  });

  try {
    await createdCanowner.save(); // save the data in database by this line
  } catch (err) {
    return res.status(500).json({
        message:"Signup Failed",
        success : false
    })
  }
  let token;
  try {
    token = jwt.sign(
      { userId: createdCanowner.id, email: createdCanowner.email }, // it will create a token storing email and user ID in it
      'secret key cannot be shared ', // this is the key which is very specific and could lead to system hack
      { expiresIn: '1h' }// token will be expired in 1hr
    );
  } catch (err) {
    return res.status(500).json({
        message:"Signup Failed."
    })
  }
  res.status(201).json({Canowner: createdCanowner.toObject({ getters: true }),token: token,
  success : true}); // returns the object of created user and token
};// getters: true will send response object ID as 'id' instead of '_id' which mongoDB created automatically


const login =async  (req, res, next) => {
  const { email, password } = req.body;

  let existingCanowner ;

  try {
    existingCanowner = await Canowner.findOne({ email: email }) // find the entry in database
  } catch (err) {
    return res.status(500).json({
        message:"Login Failed",
        success : false
    })
  }

  if (!existingCanowner ) {
    return res.status(401).json({
        message:"Invalid EmailId.",
        success : false
    })
  }

  let isValidPassword= false;
  try {
  isValidPassword= await bcrypt.compare(password,existingCanowner.password) // will conpare the password you entered and which is saved hashed in database.
  }
  catch(err)
  {
   return res.status(500).json({
    message:"Login Failed",
    success : false
   })
  }
  if(!isValidPassword){
    return res.status(401).json({
        message:"Wrong Password.",
        success : false
    })
  }
  
  let token;
  try {
    token = jwt.sign(
      { userId: existingCanowner.id ,email:existingCanowner.email }, // it will create a token using ur user ID and email.
      'secret key cannot be shared',// this is the key which is very specific and could lead to system hack
      { expiresIn: '1h' } // token will be expired in 1hr
    );
  } catch (err) {
    return res.status(500).json({
        message:"Login Failed",
        success : false
    })
  }

  res.json({message: 'Logged in!',
  user: existingCanowner.toObject({getters: true}),
  token:token,
  success : true});// getters: true will send response object ID as 'id' instead of '_id' which mongoDB created automatically

};

// and finally export all files.
exports.signup = signup;
exports.login = login;