require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const {resume,selfDescription,jobDescription} =require("./src/services/temp")
const generateInterviewReport = require("./src/services/ai.service")

generateInterviewReport({resume,selfDescrip tion,jobDescription})
connectToDB()



app.listen(3000, () => {
    console.log("Server is running on port 3000")
})