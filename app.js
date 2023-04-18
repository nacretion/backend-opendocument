
const express = require("express")
const cors = require('cors')
const multer = require("multer")

const documentRouter = require("./routes/document.routes")
const userRouter = require("./routes/user.routes")

const {PORT} = require("./config");
const app = express()

storage = multer.diskStorage({
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

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('client'))

const corsOptions = {origin: "*"}

app.use(cors(corsOptions))


app.use('/api', documentRouter)
app.use('/api', userRouter)

app.listen(PORT, () => console.log("started successfully on port", PORT))