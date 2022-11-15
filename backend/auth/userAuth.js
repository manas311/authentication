const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Ye4LVPt4QE';

function PassportAuth() {
    return new localStrategy({usernameField:'email',passwordField:'password'},(username,password,done)=>{
        userModel.findOne({email: username},(err,user)=>{
            if(err){
                return done(null,err);
            }
            if(!user){
                return done(null,false,{message: 'Incorrect Email'})
            }
            if(!(bcrypt.compareSync(password,user.password))){
                return done(null,false,{message: "Incorrect Password"});
            }
            return done(null,user,{message: 'Logged In'});
    })
    })
}

function GenerateToken(user) {
    return jwt.sign(user,SECRET_KEY);
}

function VerifyToken(token) {
    return jwt.verify(token, SECRET_KEY,(err,decoded)=>{
        if(err){
            return false;
        }else if(decoded!==undefined){
            return true;
        }
    });
}

module.exports = { PassportAuth, GenerateToken, VerifyToken } ;