// import all models
const Post = require('./Post');
const User = require('./User');
const Comment = require('./Comment');

// create associations
  
  Post.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
  });

  Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'SET NULL'
  });

  
  Post.hasMany(Comment, {
    foreignKey: 'post_id'
  });

  module.exports = { User, Post, Comment };