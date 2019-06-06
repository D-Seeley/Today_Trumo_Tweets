const { Op } = require('sequelize');

const Tweet = require('../db/Tweet');
const btoa = require('btoa');
const axios = require('axios');
const querystring = require('querystring');

const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;
const API_URL = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=realDonaldTrump&tweet_mode=extended&count=10';

const tokenEncoded = encodeURIComponent(ACCESS_TOKEN);
const secretEncoded = encodeURIComponent(ACCESS_TOKEN_SECRET);
const consumerKey = btoa(tokenEncoded + ':' + secretEncoded);

// Default config options
const defaultOptions = {
  method: 'post', // default
  baseURL: 'https://api.twitter.com/',
  headers: {
      Authorization: `Basic ${consumerKey}`
    }
}

// Create instance
const api = axios.create();

const grantTypeCC = querystring.stringify({
    grant_type: 'client_credentials'
  });

const authTwitter = () => api.post('/oauth2/token', grantTypeCC, defaultOptions)
    .then(response => response.data)
    .then(token => 
        {
            console.log('Setting Auth Token');
            api.defaults.headers.common['Authorization'] = `bearer ${token.access_token}`;
            console.log(`Setting Auth Token Complete`);
        })
    .catch(err => console.log(`
        error: ${err.message}
    `))

const twitterPull = () => api.get(API_URL)
    .then(response => response.data)
    .then(tweets => {
        console.log('tweets receied from Axios in twitterPull: ', Object.keys(tweets).length )
        tweets.forEach(tweet => {
            // console.log(`
            //     - Tweet data -
            //     id: ${tweet.id}
            //     id_str: ${tweet.id_str}
            //     created_at: ${tweet.created_at}
            //     tweet_message: ${tweet.full_text}
            // `)
            
            Tweet.findOrCreate({ where: { id: tweet.id}, defaults: {
                id_str: tweet.id_str,
                created_at: tweet.created_at,
                tweet_message: tweet.full_text }
            })
                // .then( ()=> console.log('tweet added'))
                .catch(err => console.log(err))
        });
    })
    .catch(err => console.error(`
            twitterPull failed
            error: ${err.message}
            error message: ${err.response.data.errors ? err.response.data.errors[0].message : 'undefinded'}
            error status: ${err.response.status}
            
        
        `))
    
const dateNow = new Date();
dateNow.setHours(-4,0,0,0);

console.log('twitterPull dateObject: ', dateNow)
// console.log("2) "+  new Date().toISOString());

const todayTweetParams = {
    where: {
        created_at: {
            [Op.gte]: dateNow
        }
    }
}

Tweet.calcTweets(todayTweetParams);

module.exports = {
    authTwitter,
    twitterPull
}