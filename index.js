const express = require('express')
const app = express()
const auth = require('./Routes/auth')
const userProfile = require('./Routes/userProfile')
const mongoose = require('mongoose')
const path = require('path')
// const passport = require('./passport/passport')
const passport = require('passport')
const bodyParser = require('body-parser')
require('./passport/passport')(passport)
// 
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/auth',auth)
app.use('/user',passport.authenticate('jwt',{session: false}),userProfile)
app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))

mongoose.connect('mongodb://localhost:27017/pjwtusers',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=>console.log('Connected'))
    .catch((err)=>console.log(err))

app.get('/',(req,res)=>{
    res.render('home')
})

app.listen('1000',()=>console.log('Listening'))