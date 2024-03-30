const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
require('dotenv').config()
const errorMiddleware = require('./middleware/error-middleware')
const userRouter = require('./routes/user.routes')
const postRouter = require('./routes/post.routes')
const commentRouter = require('./routes/comment.routes')
const authMiddleware = require('./middleware/auth-middleware')
const fileupload = require('express-fileupload')
const path = require('path')


const PORT = process.env.PORT;
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use(fileupload({}))
app.use(express.static(path.resolve(__dirname, 'static/post')))
app.use('/api', userRouter)
app.use('/api', authMiddleware, postRouter)
app.use('/api', authMiddleware, commentRouter)
app.use(errorMiddleware)
app.listen(PORT, () => console.log(PORT))