const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { GenerateToken, VerifyToken } = require('../auth/userAuth');
const jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer');
const SECRET_KEY = "ABDGJYD165DXS";

function RegisterUser(user) {
    return new Promise((resolve, reject) => {
        userModel.findOne({ email: user.email }, (err, data) => {
            if (data) {
                resolve({ status: 402, message: 'User with specified email already exists' })
            } else if (!data) {
                let newuser = new userModel({
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    country: user.country,
                    resetToken: null,
                    password: bcrypt.hashSync(user.password, 10)
                });

                newuser.save((err) => {
                    if (!err) {
                        resolve({ status: 200, message: 'User Registered successfully' });
                    } else {
                        reject(err);
                    }
                });
            }
        })

    });
}

function LoginUser(user_session_data) {
    return new Promise((resolve, reject) => {
        userModel.findOne({ _id: user_session_data.user }, (err, data) => {
            if (data) {
                resolve({
                    status: 200,
                    user: data,
                    token: GenerateToken(user_session_data),
                    message: 'Logged In'
                });
            } else if (err) {
                reject(err);
            }
        })

    })
}

function AuthenticateUser(auth_header) {
    return new Promise((resolve, reject) => {
        resolve({
            status: 200,
            authenticated: VerifyToken(auth_header)
        });
    })
}

function EditProfile(userid, user) {
    return new Promise((resolve, reject) => {
        let newuser = {
            firstname: user.firstname,
            lastname: user.lastname,
            country: user.country,
            state: user.state,
            city: user.city

        };
        userModel.findOneAndUpdate({ _id: userid }, { $set: newuser }, (err) => {
            if (!err) {
                resolve({message:'Profile Edited!'});
            } else {
                reject(err);
            }
        });
    });
}

function LogoutUser(req) {
    return new Promise((resolve, reject) => {
        req.logout((err) => {
            if (!err) {
                resolve({
                    status: 200,
                    message: 'Logged Out!'
                })
            } else {
                reject(err);
            }
        })
    })
}

function findMailRepo(email) {
    return new Promise((resolve,reject)=>{
        userModel.findOne({email: email},(err,data)=>{
            if(data) {
                resolve({resettoken: data.resetToken})
            }else{
                resolve({status:403,message:'No email found!'})
            }
        })
    })
}


function ResetPassword(user) {
    return new Promise((resolve, reject) => {
        userModel.findOne({ email: user.email }, (err, data) => {
            if (data) {
                const token = jwt.sign({reset:"reset key"},SECRET_KEY,{expiresIn:'900s'})
                userModel.updateOne({email: user.email},{$set:{resetToken:token}},{upsert: true},(err,data)=>{
                    if(err){
                        console.log(err);
                    }
                });
                resolve({ status: 201, message: 'Password Reset Link has been sent to the registered Email ID.', email: `${user.email}` })
                var transporter = nodemailer.createTransport({
                    service: 'outlook',
                    auth: {
                        user: 'checkpollution7@outlook.com',
                        pass: 'Pollution@123'
                    }
                });

                var mailOptions = {
                    from: 'checkpollution7@outlook.com',
                    to: user.email,
                    subject: 'Password reset link',
                    html: `<h1>Password Reset Link</h1> 
                            To reset your Password <a href="http://localhost:3000/confirmpwreset/${user.email}/${token}">Click Here</a> `
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        res.send({ status: 201, msg: "Password Reset Link has been sent to your E-Mail" })
                    }
                });
            } else if (!data) {
                resolve({ status: 404, message: 'Not a Registered User.' })
            }
        })

    });
}


function verifyReset(password, email) {
    return new Promise((resolve, reject) => {
            userModel.findOneAndUpdate({ email: email }, { $set: { password: bcrypt.hashSync(password, 10) } }, (err) => {
                if (!err) {
                    resolve({ status: 200, message: 'Password updated.' });
                } else {
                    reject(err);
                }
            })
        // } else {
        //     resolve({ status: 404, message: 'Invalid Link' })
        // }
    });

}

module.exports = { RegisterUser, LoginUser, EditProfile,findMailRepo , LogoutUser, AuthenticateUser, ResetPassword, verifyReset };
