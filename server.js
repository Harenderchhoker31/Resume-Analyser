require("dotenv").config()
const app =  require('./src/app.js')
const connet_to_db = require('./src/config/database.js')

connet_to_db()  
app.listen(3000, () => console.log('Server running on port 3000'))