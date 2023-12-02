const mongoose = require ("mongoose")

const customerScehma = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },

    email :  {
        type : String,
        required : true
    },

    phone :  {
        type : Number,
        required : true
    },

    gender :  {
        type : String,
        required : true
    },

    isactive : {
        type : String,
        required : true
    },
    refemail : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model("Customer", customerScehma)