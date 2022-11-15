const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const userRoutes=require("./routes/userRoutes");
const session =  require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const DB_URI = "mongodb+srv://manastewari:Manas_tewari@cluster0.uqebqar.mongodb.net/AuthDB";
const cors = require('cors');
const userModel = require('./models/userModel');
const {PassportAuth} = require('./auth/userAuth');
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(DB_URI).then(()=>{
    console.log('Connected to PC_AuthDB');
}).catch((err)=>{
    console.log(err);
})

const store = new MongoDBStore({
    uri: DB_URI,
    collection: 'userSessions'
})

app.use(session({
    secret: 'this is a secret',
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    },
    store: store,
    resave: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done)=>{
    done(null,user._id)
})

passport.deserializeUser((id,done)=>{
    userModel.findById(id,(err,user)=>{
        done(err,user);
    })
})

passport.use('login-local',PassportAuth());

app.use('/auth', userRoutes);

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

module.exports = app;