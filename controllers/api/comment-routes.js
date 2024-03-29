const router = require("express").Router();
const { Comment } = require("../../models");
const { withAuth } = require('../../utils/auth');

//get all comments
router.get("/", withAuth, (req, res) => {
  Comment.findAll()
    .then((comments) => res.json(comments))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//create a new comment
router.post("/", withAuth, (req, res) => {
  // expects => {comment_text: "This is the comment", user_id: 1, post_id: 2}
  Comment.create({
    comment_text: req.body.comment_text,
    user_id: req.session.user_id,
    post_id: req.body.post_id,
  })
    .then((newComment) => res.json(newComment))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

//delete a comment
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(deletedComment => {
        if (!deletedComment) {
          res.status(404).json({ message: 'No comment found with this id!' });
          return;
        }
        res.json(deletedComment);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;