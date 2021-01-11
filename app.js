const express = require("express")
const dotenv = require("dotenv")
const morgan = require('morgan')
const mongoose = require('mongoose')
const exhbs = require('express-handlebars')
const path = require('path')
const { connectDB } = require('./config/db')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// Load config 
dotenv.config({ path: './config/config.env' })

//Passport config 
require('./config/passport.js')(passport)

connectDB()

const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())
//Logging 
if (process.env.NODE_ENV === 'developement') {
    app.use(morgan('dev'))
}

//HandleBars Helpers
const { formatDate , stripTags , truncate} = require('./helpers/hbs')



//  Handlebars
app.engine('.hbs', exhbs({helpers:{formatDate , stripTags,truncate
}, defaultLayout: 'main', extname: ".hbs" }))
app.set('view engine', '.hbs')

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store : new MongoStore({mongooseConnection : mongoose.connection})
}))



// Passport middleware
app.use(passport.initialize())
app.use(passport.session())


// Static folder 
app.use(express.static(path.join(__dirname, 'public')))



//Routes 

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))