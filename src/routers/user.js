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
        const buffer = await sharp(req.file.buffer).jpeg().toBuffer()

        req.body.image = buffer.toString('base64')

        const user = await User.findById(req.params.id)
        user['name'] = req.body.name
        user['age'] = req.body.age
        user['school'] = req.body.school
        user['city'] = req.body.city
        user['website'] = req.body.website
        user['about'] = req.body.about
        user['projects'] = req.body.projects
        user['skills'] = req.body.skills
        user["image"] = req.body.image


        const updatedUser = await User.findByIdAndUpdate(req.params.id, user, { new: true, runValidators: true })

        console.log(user)
        res.render('portfolio', {
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
        res.render('portfolio', {
            user
        })
    } catch (e) {
        res.send(e)
    }
})



//search
router.post('/search', async (req, res) => {
    try {
        res.send(req.body)
    } catch (e) {
        res.send(e)
    }
})




// //public
// // viewing events of a category
// router.get('/events/category/:type', async (req, res) => {
//     const events = await User.find({ type: req.params.type })
//     res.render('general', {
//         title: req.params.type,
//         events
//     })
// })

// //reading event
// router.get('/events/:id', async (req, res) => {
//     try {
//         var event = await User.findById(req.params.id)
//         event.image = event.image.toString('base64')
        
//         res.render('eventPage', {
//             event
//         })
//     } catch (e) {
//         res.send(e)
//     }
// })




// //private
// //creating new event

// router.get('/events/create/:pass', auth, (req, res) => {
//     res.render('createEvent', {
//         title: "Create Event"
//     })
// })

// router.post('/events/create', upload.single('image') , async (req, res) => {
//     const buffer = await sharp(req.file.buffer).jpeg().toBuffer()
//     req.body.image = buffer.toString('base64')

//     const event = new User(req.body) 

//     try {
//         const newevent = await event.save()
//         res.render('eventPage', {
//             event: newevent
//         })
//     } catch (e) {
//         res.send(e)
//     }
// })







// //updating event

// router.get('/events/update/:id', auth, async (req, res) => {
//     try {
//         const event = await User.findById(req.params.id)
//         res.render('updateEvent', {
//             event
//         })
//     } catch (e) {
//         res.send(e)
//     }
    
// })

// router.post('/events/update/:id', async (req, res) => {
//     try {
//         const updatedEvent = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

//         res.render('eventPage', {
//             event: updatedEvent
//         })
//     } catch (e) {
//         res.send(e)
//     }
    
// })


// // deleting event
// router.get('/events/delete/:id', auth, async (req, res) => {
//     try {
//         await User.findByIdAndDelete(req.params.id)
        
//         res.send("Event deleted successfully!")
        
//     } catch (e) {
//         res.send(e)
//     }
    
// })



module.exports = router