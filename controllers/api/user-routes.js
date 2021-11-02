const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const { withAuth, withoutAuth } = require("../../utils/auth");

// get all users
router.get("/", withAuth, (req, res) => {
  User.findAll({
    attributes: { exclude: ["password"] },
  })
    .then((users) => res.json(users))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//fetch a specifc user and their post/comment history
router.get('/:id', withAuth, (req, res) => {
    User.findOne({
      attributes: { exclude: ['password'] },
      where: {
        id: req.params.id
      },
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'post_url', 'created_at']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'created_at'],
          include: {
            model: Post,
            attributes: ['title']
          }
        }
      ]
    })
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(user);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

//login
router.post("/login", withoutAuth, (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    }
  }).then((user) => {
    console.log(user);
    //check for existing user with this email
    if (!user) {
      res.status(400).json({ message: "No user with that username!" });
      return;
    }

    //check for valid password
    const validPassword = user.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }

    //otherwise log them in
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;

      res.json(user);
    });
  });
});

//logout
router.post('/logout', withAuth, (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).json({ message: "You are now logged out." });
      });
    }
    else {
      res.status(404).end();
    }
  });

//create a new user
router.post("/", withoutAuth, (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  User.create(
    req.body
  )
    .then((newUser) => {
      req.session.save(() => {
        req.session.user_id = newUser.id;
        req.session.username = newUser.username;
        req.session.loggedIn = true;

        res.json(newUser);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//update a user
router.put("/:id", withAuth, (req, res) => {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

  // pass in req.body instead to only update what's passed through
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(updatedUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//delete a user
router.delete("/:id", withAuth, (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedUser) => {
      if (!deletedUser) {
        res.status(404).json({ message: "No user found with this id" });
        return;
      }
      res.json(deletedUser);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
