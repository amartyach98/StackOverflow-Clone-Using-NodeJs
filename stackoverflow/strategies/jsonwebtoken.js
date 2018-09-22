const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const mongoose=require("mongoose");

//import schema forjwt
const Person =mongoose.model("myPerson");
//import /setup/mydburl 
const secretkey=require("../setup/mydburl");


var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretkey.secret;

{
  
}

module.exports= passport =>{
  passport.use(new JwtStrategy(opts,(jwt_payload, done)=>{
    Person.findById(jwt_payload.id)
    .then(person =>{
        if(person){
            return done(null,person);
        }
        return (null,false);
    })
    .catch(err => console.log(err));
  }));
}