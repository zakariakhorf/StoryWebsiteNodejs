const express = require('express')
const passport = require('passport')
const router = express.Router()

// description Login/Landing page

router.get('/google', passport.authenticate('google',{scope:['profile']}))

//get /auth/google/callbakc

router.get('/google/callback', passport.authenticate('google',
 {failureRedirect:'/'}),(req,res)=>{res.redirect('/dashboard')} )

router.get('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/')


})




module.exports = router ;