
// import express as app api
const express = require('express');

// import bcrypt for password encryption
const bcrypt = require("bcryptjs");

// import path to process static
const path = require("path");

// set app to express
const app = express();

//connect and process the environmental variables for mysql in database for full connection

var db = require('./database');

//import login routes
const login = require("./routes/login.js");

//import register routes
const register = require("./routes/register.js");


//set engine
//
app.set('view engine', 'hbs');


// import static files
const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))

// route for index
app.get("/", (req, res) => {
    res.render("index")
})


// configure express to get form as json
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

// use the imported routes
app.use(login);
app.use(register);



// set listening port to 5000
//
const server = app.listen(5000, ()=> {
    console.log("server started on port 5000")
})

// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})


// export the variable specified
module.exports = app;
