const express = require("express")
const connectMongo = require("./db.js")
const app = express()
const PORT = 8080

const cors = require('cors');
app.use(cors())
app.use(express.json())
connectMongo()

app.use("/auth", require("./routes/auth"))
app.use("/notes", require("./routes/notes"))

app.listen(PORT, () => {
    console.log("listening on port 8080");
})