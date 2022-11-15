const { VerifyToken } = require('../auth/userAuth');
const repo = require('../Repository/userRepository');

function Register(req, res) {
    repo.RegisterUser(req.body).then(data => {
        res.status(200).send(data);
    })
}

function Login(req, res) {
    repo.LoginUser(req.session.passport).then((data) => {
        res.status(200).send(data)
    })
}

function Reset(req, res) {
    repo.ResetPassword(req.body).then((data) => {
        res.status(200).send(data)
    })
}

function findMail(req,res) {
    repo.findMailRepo(req.params.email).then((data)=>{
        res.status(200).send(data);
    })
}

function ConfReset(req, res) {
    repo.verifyReset(req.body.password, req.params.email, req.params.resettoken).then((data) => {
        res.status(200).send(data)
    })
}

function Logout(req, res) {
    repo.LogoutUser(req).then((data) => {
        res.status(200).send(data)
    })
}

function isAuth(req, res) {
    repo.AuthenticateUser(req.headers.authorization).then((data) => {
        res.status(200).send(data);
    })
}

function EditProfile(req, res) {
    repo.EditProfile(req.params.userid, req.body).then((data) => {
        res.status(200).send(data)
    })
}

function getNames(req, res) {
    repo.getNames(req.params.userid).then((data) => {
        res.status(200).send(data)
    })
}

module.exports = { Register, Login, isAuth, EditProfile,findMail, Logout, Reset, ConfReset };
