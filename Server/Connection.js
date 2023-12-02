const mongoose = require("mongoose");
require("dotenv").config()

mongoose.connect(`${process.env.DB_URL}/crud`).then(res => {
    console.log("Connected to database successfully!")
}).catch(err => {
    console.log(err)
})