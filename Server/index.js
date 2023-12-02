const express = require("express")
const app = express();
require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieparser = require("cookie-parser")
const cors = require("cors")

require("./Connection.js")

const Users = require("./Models/UserAuth_model.js") // UserAuth model
const Customer = require ("./Models/Customer.js")

//middlewares

app.use(express.json())

app.use(cookieparser())

app.use(cors({
origin: ["http://localhost:3000"],
credentials : true
}))


const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server is running at port :${PORT}`)
})


// Register API

app.post("/register", async (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;

    if (!firstname || !lastname || !email || !phone || !password) {
        return res.status(400).json({ "msg": "Please enter all the fields" })

    }
    const checkExistinguser = await Users.findOne({ email });

    if (checkExistinguser) {
        return res.status(400).json({ "msg": "User is already registered with this email address, please try with some other email" })
    }
    else {
        const hashpassword = await bcrypt.hash(password, 12)
        const createUser = await Users.create({
            firstname,
            lastname,
            email,
            phone,
            password: hashpassword
        });
    }

    return res.status(201).json({ "msg": "Registred successfully!, Please login to the accoount" })

})




// Login API

app.post("/login", async (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.json({ "msg": "Please enter all the fields" })
    }

    const checkexistingUser = await Users.findOne({ email });
    if (checkexistingUser && await (bcrypt.compare(password, checkexistingUser.password))) {

        const token = jwt.sign({
            email: checkexistingUser.email
        }, process.env.SECRETE_KEY)


        return res.status(200).cookie("Token" , token).send("Logged in successfully!")         

    }

    else {
        return res.status(400).json({ "msg": "Invalid email address or password" })
    }
})

//logout

app.post("/logout", async(req, res)=>{
    const logout = await res.clearCookie("Token")
    if(logout){
        return res.json({"msg":"Logged out!"})
    }
})







// Create Customers

app.post("/users/create", async (req, res) =>{
    const {name, email, phone, gender, isactive, refemail } = req.body


    const token = req.cookies
    const Usertoken = token.Token
        console.log(Usertoken)
    
    
        const VerifyToken = await jwt.verify(Usertoken, process.env.SECRETE_KEY);
        const userEmail =  VerifyToken.email



    const createUsers = await Customer.create ({
        name,
        email,
        phone,
        gender,
        isactive,
        refemail : userEmail
    })

    if (createUsers) {
        return res.json({"msg" : "Customer created successfully!"})
    }

    else {
        return res.json({
            "msg" : "Failed to create Customer"
        })
    }

})

// get customers

app.get("/users/get", async (req, res) =>{

    const token = req.cookies
const Usertoken = token.Token
    console.log(Usertoken)


    const VerifyToken = await jwt.verify(Usertoken, process.env.SECRETE_KEY);
    const userEmail =  VerifyToken.email

    const getAllusers = await Customer.find({refemail :userEmail });

    if (getAllusers) {
        return res.json(getAllusers)
    }

    else {
        return res.json({"msg":"Failed to get users"})
    }
})

// delete user

app.delete("/users/delete/:id", async(req, res)=>{
const ids = req.params.id;

const deleteUser = await Customer.findByIdAndDelete({_id:ids});

if (deleteUser){
    return res.json({"msg":"User deleted successfully"})
}

else {
    return res.json({"msg":"Failed to delete user"})
}
})



//getSingleuser

app.get("/users/user/:id", async(req, res)=>{
    const ids = req.params.id;

    const getUser = await Customer.findById({_id:ids})
    if(getUser){
        return res.json(getUser)
    }
    else{
        return res.json({"msg":"Failed to get user"})
    }
})


// Update user

app.put("/users/update/:id", async (req, res)=>{
    const {name, email, phone, gender, isactive } = req.body
    const ids = req.params.id;

    const updateUser = await Customer.findByIdAndUpdate(ids, {name, email, phone, gender, isactive })

    if(updateUser) {
        return res.json({"msg":"User details updated successfully"})
    }
    else {
        res.json({"msg":"Failed to update "})
    }
})

