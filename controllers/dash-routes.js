const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const { withAuth } = require("../utils/auth");

// get all posts for dashboard
router.get("/", withAuth, (req, res) => {
  console.log("======================");
  Post.findAll({
    where: {
      user_id: req.session.user_id,
    },
    attributes: ["id", "post_body", "title", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((allPosts) => {
      const posts = allPosts.map((post) => post.get({ plain: true }));
      res.render("dashboard", { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//edit post by id
router.get("/edit/:id", withAuth, (req, res) => {
  Post.findByPk(req.params.id, {
    attributes: ["id", "post_body", "title", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((editedPost) => {
      console.log(editedPost);
      if (editedPost) {
        const post = editedPost.get({ plain: true });
        res.render("edit-post", {
          post,
          loggedIn: true,
        });
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;
