import jwt from 'jsonwebtoken'
import expressAsyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = expressAsyncHandler(async (req, res, next) => {
  let tokenString
  tokenString = req.cookies.token

  if (tokenString) {
    try {
      const decoded = jwt.verify(tokenString, process.env.JWT_SECRET)

      req.userDetails = await User.findById(decoded.userId).select('-password') // so that password don't get return

      next()
    } catch (error) {
      res.status(401)
      throw new Error('Not Authorized!')
    }
  } else {
    res.status(401)
    throw new Error('Not Authorized, no JWT !')
  }
})
export { protect }
