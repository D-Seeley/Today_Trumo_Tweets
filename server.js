//Dev - force load of local .env file
require('dotenv').config()

const path = require('path');
const express = require('express');
const db = require('./db');
const { Op } = require('sequelize');
const { Tweet } = db.models;

const { authTwitter, twitterPull } = require('./utils/twitterPull');

const app = express();
app.use(require('body-parser').json());

const port = process.env.PORT || 3000;
const index = path.join(__dirname, 'index.html');

const dateNow = new Date();
dateNow.setHours(-4,0,0,0);

const todayTweetParams = {
    where: {
        created_at: {
            [Op.gte]: dateNow
        }
    }
}

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res)=> res.sendFile(index));
app.get('/api/count', (req, res)=> Tweet.calcTweets(todayTweetParams).then( tweetCount => res.send({ tweetCount })));


app.use((err, req, res, next)=> {
  res.status(500).send({ error: err.message });
});

app.listen(port, ()=> console.log(`listening on port ${port}`));

const startServer = async () => {
  try {
    //Note - not sure if await is working the way I think here, is my authTwitter func a promise...?
    await authTwitter();
    await db.sync();
    await twitterPull();
  }
  catch (err) {
    console.log('Server did not start ', err);
  }
}

//Start Server and pull from Twitter every 5 minutes (300000 ms)
startServer();
setInterval(twitterPull, 5000);
