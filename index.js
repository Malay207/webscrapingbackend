const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 5000
app.use(cors())
app.use(express.json());
mongoose.connect(process.env.URI)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));
app.use('/api/data', require('./router'));
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});