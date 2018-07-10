var express=require('express');
var path=require('path');
var cookieparser=require('cookie-parser');
var bodyparser=require('body-parser');
var exphbs=require('express-handlebars');
var expressValidator=require('express-validator');
var flash=require('connect-flash');
var session=require('express-session');
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var mongo=require('mongodb');
var mongoose=require('mongoose');
var hbs =require('hbs');
var app=express(); 
var port=process.env.PORT || 3000;
var indexrouter=require('./routes/index');
var usersrouter=require('./routes/users');


//view engine
app.set('views',path.join(__dirname+'views'));
app.use(express.static(__dirname+'/public'));
app.set('view engine', 'hbs');


//middleware body-parser
app.use(bodyparser.json());
app.use(cookieparser());
app.use(bodyparser.urlencoded({extended: false}));

//set static folder
app.use('/',express.static(__dirname+'/public'));
app.use('/users',express.static(__dirname+'/public'));

//express session
app.use(session({
	secret:'secret',
	saveuninitialized:true,
	resave:true
}));


//express validators
app.use(expressValidator({
	errorFormatter:function (param,msg,value){
		var namespace=param.split('.'),
		root =namespace.shift(),
		formParam=root;
		while(namespace.length){
			formParam+='['+namespace.shift()+']';
		}
		return{
			param:formParam,
			msg:msg,
			value:value
		};
	}
}));

//passport
app.use(passport.initialize());
app.use(passport.session());


//routes middleware
app.use('/',indexrouter);
app.use('/users',usersrouter);



//express validators
//app.use(expressvalidator({}))

//connect flash middleware
app.use(flash());

//global vars
app.use((req,res,next)=>{
	res.locals.success_msg=req.flash('success_msg');
	res.locals.error_msg=req.flash('error_msg');
	res.locals.error=req.flash('error');
	res.locals.user=req.user||null;
	next();
});


app.listen(port,()=>{
		console.log(`server is up on port ${port}`);
	});