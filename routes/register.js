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

const reg0 = function (req, res, next) {
  console.log('reg0')

  //get inputs
  username = req.body.name
  email = req.body.email
  password = req.body.password
  password_confirm = req.body.password_confirm

  //verify inputs
  if (!email || !username || !password) {
	  return res.render('register', {
		  message: 'Any of the fields can not be empty!!'
	  })
  }
	next()
}
const reg1 = async (req, res, next) =>{

	//hashing the password using bcrypt

	console.log('hashing the password')

	hashedPassword = await bcrypt.hash(password, 8)

	next()

}

const reg2 = async (req, res, next) =>{
	console.log('reg2')

	// if password and comfirm password do not match
	//console.log(password)
	 // console.log(password_confirm)
	
	let messages;

  
	if (password !== password_confirm) {
	  
		messages = 'Passwords do not match!'
  
	}


	let p = Number(password.length)

	console.log(p)

	if (p < 8) {

		messages = 'password too short can not be less 8  !'
	}

	if (password === username || password === email) {

		messages = '!! that password is not allowed!'
	}

	if (messages) {
	  
	
		return res.render('register', {
		  
			message: messages
	  
		})
	
	}

  

	next()
}



    // db.query() code verify email

const reg3 = function(req, res, next) {
	console.log('reg3')

	console.log (email)

	let sql = 'SELECT email, name FROM users WHERE email =' + db.escape(email) + " OR name =" + db.escape(username);



	db.query(sql, async (err, response) => {
     
		// remaining code goes here
                //for errors
        if(err){
            console.log(err)
	}
		console.log(response.length)
	

                // if the email has registered before

		//  console.log(email + username)
		 // console.log(response[l].email + response[l].name)
	if(response.length) {


		if(response[0].email) {
			messages = 'This email is already in use'
		}

		if(response[0].name) {

			messages = 'This username is already in use'
		}

		if(response[0].email && response[0].name) {
			messages = 'This email and username is already in use'
		}


		return res.render('register', {
			message: messages
		})
	}

	
	})

	next()
}


                //add User to the database

const reg4 = function(req, res) {
console.log('reg4')

	let sql = 'SELECT email, name FROM users WHERE email =' + db.escape(email) + " OR name =" + db.escape(username
);

	db.query(sql, async (error, result) => {
		if(error){
			console.log(error)
		}

		let len = await result.length

		if(len == 0) {

	//console.log(hashedPassword)

	
			db.query('INSERT INTO users SET?', {name: username, email: email, password: hashedPassword}, (err, response) => {
                // if not add user
        
				if (err) {
             
					console.log(err)

					messages =  "User not successfully created"
				}
			
			
				if (len == 0) {

					console.log( 'new user  ' + username + '  is successfully registered')
				
					messages = 'User has successfully registered!  you can proceed to login'

				}
                
			

		// if saved user
	
				console.log('almost done with user:  ' + username)


				return res.render('register', {

					message: messages

				})

	
			})
		}
	})
}


router.post("/auth/register", [reg0,reg1,reg2,reg3,reg4])

// export the variable specified
module.exports = router;
