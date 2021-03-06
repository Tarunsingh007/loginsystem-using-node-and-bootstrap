var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
mongoose.connect('mongodb://localhost/loginApp');
var schema=mongoose.Schema;
var userschema=new schema({
	username:{
		type:String,
		index:true
	},
	password:{
		type:String
	},
	email:{
		type:String,
	},
	name:{
		type:String
	}
});

var User =module.exports=mongoose.model('User',userschema);

module.exports.createUser=function(newUser,callback){
	bcrypt.genSalt(10,function(err,salt){
		bcrypt.hash(newUser.password,salt,function(err,hash){
		newUser.password=hash;
		newUser.save(callback);
	});
	});
}
module.exports.getuserbyusername=function(username, callback){
	var query={username:username};
	User.findOne(query,callback);
}
module.exports.getuserbyid=function(id, callback){
	User.findById(id,callback);
}
module.exports.comparePassword=function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
		if(err) throw err;
		callback(null,isMatch);
	});
}