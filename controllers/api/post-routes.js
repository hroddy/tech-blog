const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const { withAuth } = require("../../utils/auth");

// get all user's posts
router.get("/", withAuth, (req, res) => {
  console.log("======================");
  Post.findAll({
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
    .then((posts) => {
      return res.json(posts);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//get one post
router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
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
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      res.json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//create a new post
router.post("/", withAuth, (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_body: 'https://taskmaster.com/press', user_id: 1}
  Post.create({
    title: req.body.title,
    post_body: req.body.post_body,
    user_id: req.session.user_id,
  })
    .then((newPost) => res.json(newPost))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//update a post
router.put("/:id", withAuth, (req, res) => {
  Post.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((updatedPost) => {
      if (!updatedPost) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      res.json(updatedPost);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//delete a post
router.delete("/:id", withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedPost) => {
      if (!deletedPost) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      res.json(deletedPost);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
