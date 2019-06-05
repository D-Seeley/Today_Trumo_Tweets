const conn = require('./conn');
const Tweet = conn.define('Tweet', {
  id: {
    primaryKey: true,
    type: conn.Sequelize.BIGINT,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    },
  },
  id_str: {
    type: conn.Sequelize.STRING
  },
  created_at: {
    type: conn.Sequelize.DATE
  },
  tweet_message: {
    type: conn.Sequelize.TEXT
  }
});

Tweet.calcTweets = (params) => {
  return Tweet.findAndCountAll(params)
      .then( ({ count }) => console.log('Trump Has Tweeted - calcTweets in twitterPull is: ', count));
}


module.exports = Tweet;