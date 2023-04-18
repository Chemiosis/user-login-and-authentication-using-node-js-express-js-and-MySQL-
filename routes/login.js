const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//connect and process the environmental variables for mysql in database for full connection
let db = require('../database');



// route for login
router.get("/login", (req, res) => {
    res.render("login")
})



// variables required

var username;
var password;




// route for login post
const log0 = function (req, res, next) {

	console.log('log0')

	// assigning values to input
    username = req.body.name
    password = req.body.password

    if (!username || !password) {
          return res.render('login', {
                  message: "Username or Password not present",
          })
     }
    next()
}


const log1 = function (req, res, next) {
	console.log('log1')

	let sql = 'SELECT name FROM users WHERE name =' + db.escape(username) + " OR email =" + db.escape(username);

    // db.query() code confirm if user exist

        db.query(sql, async (error, response) => {
        // remaining code goes here
                //for errors
        if(error){
                console.log(error)
        }
               // if user doesnt exist
		
		lenn = await response.length

	if( lenn == 0 ) {
		return res.render('login', {
                            message: 'User does not exist, try signing up'
                })
        }
	})
	next()
}

const log2 = function (req, res, next) {
	console.log('log2')

                //verify the password
        db.query('SELECT name, password FROM users WHERE name = ?', [username], async (error, response) => {
                //for errors
	
	
                if(error){
			console.log(error)
                }

                // if password is not verified

		const pass = await response[0].password

		bcrypt.compare(password, pass).then(function (result) {

		
			if( !result ) {

			
				console.log('a user just attempt to login with info:  ' + username+ '  and  ' + password + '  but failed' )

			
				return res.render('login',{
				
					message: username + ' You entered a wrong password. try again ' 
			
				})
			}
	
		})
	})


	next()
}

// if password verified

const log3 = function (req, res) {

	console.log('log3')


	//verify the password
        db.query('SELECT name, password FROM users WHERE name = ?', [username], async (error, response) => {

		//for errors
		
		if(error){
			console.log(error)
		}                                                                                                                                             
		// if password is not verified

		const pass = await response[0].password

		bcrypt.compare(password, pass).then(function (result) {


			if (result){

			   console.log('a user just logged in with info:  ' + username )

			// render profile page

			   return res.render('index', {
				
				   message: username + '  Welcome to your profile. You have successfully logged in'
			
			   })
			}
		})
	})
	
}


router.post("/login", [log0,log1,log2,log3])

// export the variable specified
module.exports = router;
