const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user.routes')
const postRouter = require('./routes/post.routes')
const commentRouter = require('./routes/comment.routes')
const fileupload = require('express-fileupload')
const path = require('path')


const PORT = 5000;

const app = express();

app.use(cors())
app.use(express.json())
app.use(fileupload({}))
app.use(express.static(path.resolve(__dirname, 'static/post')))
app.use('/api', userRouter)
app.use('/api', postRouter)
app.use('/api', commentRouter)
app.listen(PORT, () => console.log(PORT))