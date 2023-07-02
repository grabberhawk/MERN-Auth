//@desc Auth user/set token  route: POST/api/users/auth  @access:Public
import generateToken from '../utils/generateToken.js'
import asyncHandler from 'express-async-handler' //not to wrap in try and catch
import User from '../models/userModel.js'
import { Error } from 'mongoose'
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } else {
    res.status(401)
    throw new Error('Invalid Email or Password ')
  }
})
//@desc register new user/set token  route: POST/api/users  @access:Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User Already Exists')
  }
  const user = await User.create({
    name,
    email,
    password,
  })
  if (user) {
    generateToken(res, user._id)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } else {
    res.status(400)
    throw new Error('Try Again! @ ID not Created')
  }
})

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  })

  res.status(200).json({ message: 'Logged Out Successfully!' })
})
const getUserProfile = asyncHandler(async (req, res) => {
  const { _id, name, email } = req.userDetails
  const user = {
    _id,
    name,
    email,
  }
  res.status(200).json(user)
})
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userDetails._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedDetails = await user.save()
    res.status(200).json({
      email: updatedDetails.email,
      name: updatedDetails.name,
      message: `Updated Details`,
    })
  } else {
    res.status(404)
    throw new Error('User Not Found!')
  }
})
export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile }
