const conn = require('./conn');
const Tweet = require('./Tweet');
const { twitterPull } = require('../utils/twitterPull');

const sync = () => {
  return conn.sync({ force: false})
    // .then(()=> twitterPull());
        // .then(tweets => {
        //   console.log('tweets pulled')
        // })
};

module.exports = {
  models: {
    Tweet
  },
  sync
};
