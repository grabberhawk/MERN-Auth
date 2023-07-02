import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()
import { notFound, errorHandler } from './middleware/errorMidlleware.js'

import userRoutes from './routes/userRoutes.js'
import connectDb from './config/db.js'
import cookieParser from 'cookie-parser'
const app = express()
connectDb()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve()
  app.use(express.static(path.join(__dirname, 'frontend/dist')))
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('Server Ready!')
  })
}
app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Server Started on ${port}`))
