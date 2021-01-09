const express = require('express')
const router = express.Router()

// description Login/Landing page

router.get('/', (req,res)=>{
    res.render('login',{layout :'login'});
})

//get dashboard

router.get('/dashboard', (req,res)=>{
    res.render('dashboard.hbs');
})

module.exports = router ;