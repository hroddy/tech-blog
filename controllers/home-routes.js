const session = require('express-session')
const { Post, User } = require('../models')

const router = require('express').Router()

//render home page with posts
router.get('/', (req, res) => {
    //res.render('home', posts)
    Post.findAll({include: User}).then(postsData => res.render('home', postsData))
})

//render login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
    }
    else res.render('login')
})

//render sign up
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/')
    }
    else res.render('signup')
})

//render logout
router.get('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
          res.status(204).end();
        });
      }
      else {
        res.status(404).end();
      }
})


module.exports = router;