const { Post } = require('../models');

const postdata = [
    {
      title: 'Donec posuere metus vitae ipsum.',
      post_body: 'lorem lorem lorem latin latin blah blah',
      user_id: 1
    },
    {
      title: 'Morbi non quam nec dui luctus rutrum.',
      post_body: 'lorem lorem lorem latin latin blah blah',
      user_id: 2
    }
]

const seedPosts = () => Post.bulkCreate(postdata);

module.exports = seedPosts;