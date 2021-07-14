const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')

const router = new express.Router()
const auth = require('../middleware/auth')
const { findById } = require('../models/user')




//login
router.get('/login', async (req, res) => {
    res.render('login')
})


router.post('/login', async (req, res) => {
    const data = await User.find({ email: req.body.email })

    if (data.length > 0) {
        if (data[0].password == req.body.password) {
            res.render('createPortfolio', {
                user: data[0],
            })
        } else {
            res.send('Incorrect password')
        }

    } else {
        const user = new User(req.body) 
        try {
            const newUser = await user.save()
            res.render('createPortfolio', {
                user: newUser
            })
        } catch (e) {
            res.send(e)
        }
    }
})



// create or edit portfolio
const upload = multer({
    limits: {
        fileSize: 3000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})


router.post('/createPortfolio/:id', upload.single('image') , async (req, res) => {
    try {
        console.log(req.body)
        const buffer = await sharp(req.file.buffer).jpeg().toBuffer()
        req.body.image = buffer.toString('base64')

        const user = await User.findById(req.params.id)
        user['name'] = req.body.name
        user['age'] = req.body.age
        user['school'] = req.body.school
        user['city'] = req.body.city
        user['website'] = req.body.website
        user['resume'] = req.body.resume
        user["image"] = req.body.image
        user['about'] = req.body.about
        user['theme'] = req.body.inlineRadioOptions


        // user['projects'] = req.body.projects
        // user['skills'] = req.body.skills


        const updatedUser = await User.findByIdAndUpdate(req.params.id, user, { new: true, runValidators: true })

        res.render(user.theme, {
            user
        })

    } catch (e) {
        res.send(e)
    }
})


// view portfolio
router.get('/portfolios/:id', async (req, res) => {
    try {
        var user = await User.findById(req.params.id)
        user.image = user.image.toString('base64')
        res.render(user.theme, {
            user
        })
    } catch (e) {
        res.send(e)
    }
})



//search
router.post('/search', async (req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name })
        user.image = user.image.toString('base64')
        res.render(user.theme, {
            user
        })
    } catch (e) {
        res.send(e)
    }
})




router.get('/preview/:id', async (req, res) => {
    try {
        const user = await User.find()
        res.render(req.params.id, {
            user: user[0]
        })

    } catch (e) {
        res.send(e)
    }
}) 






module.exports = router