const express = require("express")
const cors = require('cors')
const multer = require("multer")
const cookieParser = require('cookie-parser');

const documentRouter = require("./routes/document.routes")
const userRouter = require("./routes/user.routes")

const app = express()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.'
        const newFileName = file.fieldname + '-' + uniqueSuffix + file.originalname.split(".").pop()
        cb(null, newFileName)
    }
})

const upload = multer({storage: storage})


app.use(upload.any())
app.use(cookieParser());
app.use(express.json())
app.use(express.static('client'))

app.use(express.urlencoded({ limit: "1kb", extended: true }));
app.use(express.json({ limit: "1kb" }));
const corsOptions = {origin: "*"}

app.use(cors(corsOptions))


app.use('/api', documentRouter)
app.use('/api/user', userRouter)


module.exports = app