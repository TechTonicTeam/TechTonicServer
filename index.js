const express = require('express');
const cors = require('cors');
const cookiePaser = require('cookie-parser')
require('dotenv').config()
const userRouter = require('./routes/user.routes')
const postRouter = require('./routes/post.routes')
const commentRouter = require('./routes/comment.routes')
const authMiddleware = require('./middleware/auth-middleware')
const fileupload = require('express-fileupload')
const path = require('path')


const PORT = process.env.PORT;

const app = express();

app.use(cors())
app.use(express.json())
app.use(cookiePaser())
app.use(fileupload({}))
app.use(express.static(path.resolve(__dirname, 'static/post')))
app.use('/api', userRouter)
app.use('/api', authMiddleware, postRouter)
app.use('/api', authMiddleware, commentRouter)
app.listen(PORT, () => console.log(PORT))