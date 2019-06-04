const conn = require('./conn');
const Tweet = require('./Tweet');
const { twitterPull } = require('../utils/twitterPull')

console.log('Tweets in index are: ', Tweet)

const syncAndSeed = ()=> {
  return conn.sync({ force: false})
    .then(()=> {
      twitterPull()
        .then(tweets => {
          console.log('tweets pulled')
        })
        .then(err => console.log(err));
      // return Promise.all([
      //   Tweets.create({ name: 'moe' })
      // ]);
    });
};

module.exports = {
  models: {
    Tweet
  },
  syncAndSeed
};
