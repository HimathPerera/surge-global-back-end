const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user.model");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { 
      throw new HttpError('Invalid data passed. Please check the inputs !', 422)  
    }
    const { email, password, name ,todos} = req.body;

    let existingUser
    try {
      existingUser = await User.findOne({ email: email })
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }

    if (existingUser) {
      const error = new HttpError(
        'User exists already, please login instead.',
        422
      );
      return next(error);
    }

  let hashedPassword;
  try { 
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) { 
    const error = new HttpError(
      'User creation error',
      500
    );
    return next(error);
  }
    const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      todos
    });

    try {
      await createdUser.save();
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again.',
        500
      );
      return next(error);
  }
  
  let token;
  try{
    token = jwt.sign({
      userId: createdUser.id,
      email:createdUser.email
    }, 'STARKINDUSTRY', {expiresIn:'1h'})
  
   }catch (err) { 
    const error = new HttpError(
      'Signing up failed, please try again.',
      500
    );
    return next(error);
  }
    res.status(201).json({userId: createdUser.id, token});
}
 
////////////////////////////////////////////////////////////////////////////
const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
  
    try {
      existingUser = await User.findOne({ email: email })
    } catch (err) {
      const error = new HttpError(
        'Logging in failed, please try again later.',
        500
      );
      return next(error);
    }
  
    if (!existingUser) {
      const error = new HttpError(
        'Invalid credentials, could not log you in.',
        401
      );
      return next(error);
    }
    
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
   } catch (err) { 
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }

  if (!isValidPassword) { 
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401
    );
    return next(error);
  }
  let token;
  try{
    token = jwt.sign({
      userId: existingUser.id,
      email:existingUser.email
    }, 'STARKINDUSTRY', {expiresIn:'1h'})
  
   }catch (err) { 
    const error = new HttpError(
      'Signing in failed, please try again.',
      500
    );
    return next(error);
  }

    res.json({userId: existingUser.id, token});
 }

exports.signIn = signIn;
exports.signUp = signUp;