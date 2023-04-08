
// import mysql for database
const mysql = require("mysql");

// import mysql for database
const dotenv = require('dotenv');


// import path to process static
const path = require("path");	

//connect and process the environmental variables for mysql
dotenv.config({ path: './.env'});



// connect to mysql database
var db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


//if connected
db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
});



// export the variable specified
module.exports = db;
