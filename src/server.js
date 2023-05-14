const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

app.listen(PORT, () => console.log('your server is running on port ' + PORT))