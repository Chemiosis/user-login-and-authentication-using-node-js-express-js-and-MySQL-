const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//connect and process the environmental variables for mysql in database for full connection

let db = require('../database');


// route for register 
router.get("/register", (req, res) => {
    res.render("register")
})


// variables required
var username;
var email;
var password;
var password_confirm;

var hashedPassword;

// route for register

const cb0 = function (req, res, next) {
  console.log('CB0')

  //get inputs
  username = req.body.name
  email = req.body.email
  password = req.body.password
  password_confirm = req.body.password_confirm

  //verify inputs
  if (!email || !username || !password) {
	  return res.render('register', {
		  message: 'Any of the feilds can not be empty!!'
	  })
  }
	next()
}
const cb1 = async (req, res, next) =>{

	//hashing the password using bcrypt

	console.log('hashing the password')

	hashedPassword = await bcrypt.hash(password, 8)

	next()

}

const cb2 = function (req, res, next) {
	console.log('CB2')

	// if password and comfirm password do not match
	//console.log(password)
	 // console.log(password_confirm)

  if (password !== password_confirm) {
	  return res.render('register', {
		  message: 'Passwords do not match!'
	  })
  }

	next()
}



    // db.query() code verify email

const cb3 = function(req, res, next) {
	console.log('CB3')

	console.log (email)

	let sql = 'SELECT email FROM users WHERE email =' + db.escape(email);



	db.query(sql, async (err, response) => {
     
		// remaining code goes here
                //for errors
        if(err){
            console.log(err)
	}
	

                // if the email has registered before
		console.log(response.length)

		len = await response.length


        if( len != 0 ) {
            return res.render('register', {
                message: 'This email is already in use'
            })
        }
	
	})

	next()
}


                //add User to the database

const cb4 = function(req, res, next) {
console.log('CB4')

	//console.log(hashedPassword)

	db.query('INSERT INTO users SET?', {name: username, email: email, password: hashedPassword}, (err, response) => {
                // if not add user
        if (err) {
             console.log(err)

	     return res.render('register', {
			message: "User not successfully created"
		    })
                }

		// if saved user
	console.log('almost done with user:  ' + username)

	})
	next()
}

const cb5 = function( req, res) {
	console.log('cb5')


	let sql = 'SELECT email FROM users WHERE email =' + db.escape(email);


	db.query(sql, async (err, response) => {                                                                                                                                                // remaining code goes here                                                             //for errors

		if(err){
            console.log(err)
        }


                // if the email has registered before
                console.log(response.length)
                                                                                                        len = await response.length
                                                                                                if( len != 0 ) {

													console.log( 'new user  ' + username + '  is successfully registered')

                // if user is added
													return res.render('register', {
														message: 'User has successfully registered!  you can proceed to login'

													})
												}
	})

}


router.post("/auth/register", [cb0,cb1,cb2,cb3,cb4,cb5])

// export the variable specified
module.exports = router;
