var express=require('express');
var app=express();
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User=require('../models/user.js');
app.get('/login',(req,res)=>{
	res.render('login');
});

app.get('/register',(req,res)=>{
	res.render('register');
});

app.get('/logout',(req,res)=>{
	res.render('logout');
});

app.post('/register',(req,res)=>{
	 var name=req.body.name;
	 var username=req.body.username;
	 var email=req.body.email;
	 var password=req.body.password;
	 var password2=req.body.password2;
	 
	 req.check('name','name is required').notEmpty();
	 req.check('username','username is required').notEmpty();
	 req.check('email','email is required').notEmpty();
	 req.check('email','email is not valid').isEmail();
	 req.check('password','password is required').notEmpty();
	 req.check('password2','password is required').equals(req.body.password);
	 var errors=req.validationErrors();

	 if(errors)
	 {
	 	res.render('register'),{
	 		errors:errors
	 	}
	 }
	 else
	 {
	 	var newUser= new User({
	 		username:username,
	 		password:password,
	 		email:email,
	 		name:name
	 		
	 	});
	 	User.createUser(newUser,(err,user)=>{
	 		if(err)
	 			throw err;
	 		console.log(user);
	 	});
	 	res.redirect('/users/login');
	 }
});
passport.use(new LocalStrategy(
  function(username, password, done) {
  				User.getuserbyusername(username,(err,user)=>{
  					if(err) throw err;
  					if(!user){
  						return done(null,false,{message:'Unknown user'});

  					}
  				User.comparePassword(password,user.password,(err,isMatch)=>{
  					if(err) throw err;
  					if(isMatch){
  						return done(null,user);
  					}
  					else{
  						return done(null,false,{message :'Invalid Password'});
  					}

  				});
  			});
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getuserbyid(id, function(err, user) {
    done(err, user);
  });
});

app.post('/login',
  passport.authenticate('local' ,{
  	successRedirect:'/',failureRedirect:'/users/login'}),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout',(req,res)=>{
	req.logout();
	res.redirect('/users/login');
});
module.exports=app;