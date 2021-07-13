//importing packages
const express = require('express')
const hbs = require('hbs')
const path = require('path')
const bodyParser = require('body-parser')


//getting routers
const userRouter = require('./routers/user')


//starting database
require('./db/mongoose')

//importing models
const User = require('./models/user')


//defining paths
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')
const publicPath = path.join(__dirname, '../public')


//starting app
const app = express()
const port = process.env.PORT || 3000


//setting handlebars and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)


app.use(express.static(publicPath))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

//using routers
app.use(userRouter)

 
app.get('', async (req, res) => {
    try {
        const users = await User.find({})
        res.render('index', {
            users
        })
    } catch (e) {
        res.send(e)
    }
})


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})