const session = require("express-session");
const { Post, User, Comment } = require("../models");
const { withAuth } = require("../utils/auth");

const router = require("express").Router();

//render home page with posts
router.get("/", (req, res) => {
  Post.findAll({ include: [User, Comment] }).then((postsData) => {
    const posts = postsData.map((post) => post.get({ plain: true }));
    return res.render("home", { posts });
  })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//render home page with posts if user types /home
router.get("/home", (req, res) => {
  Post.findAll({ include: [User, Comment] }).then((postsData) => {
    const posts = postsData.map((post) => post.get({ plain: true }));
    return res.render("home", { posts });
  })
    .catch((err) => {
      res.status(500).json(err);
    });
});

//render post by id
router.get("/post/:id", withAuth, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      User,
      {
        model: Comment,
        include: [User],
      },
    ],
  }).then((dbPostData) => {
      
    if (dbPostData) {
        const post = dbPostData.get({plain: true})
    return res.render("single-post", { post: post });
    } else {
        res.status(404).end();
    }
    
  });
});

//render login/sign up page
router.get("/login", (req, res) => {
  return res.render("login", {
    layout: "landing",
  });
});

//render login/sign up page if user tries to go to /sign-up
router.get("/signup", (req, res) => {
  return res.render("login", {
    layout: "landing",
  });
});

//render logout
router.get("/logout", withAuth, (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
