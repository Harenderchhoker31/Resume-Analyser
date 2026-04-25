const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, "http://localhost:5173"]
    : [
        "http://localhost:5173",
        "https://resume-analyser-ebon-six.vercel.app",
        "https://resume-analyser-harenderchhoker31s-projects.vercel.app"
    ]

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app