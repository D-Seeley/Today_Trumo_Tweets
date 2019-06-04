const Tweet = require('../db/Tweet');
const btoa = require('btoa');
const axios = require('axios');
const querystring = require('querystring');

const ACCESS_TOKEN = 'FdvL5MqofP7eNnkInRmyffaQU';
const ACCESS_TOKEN_SECRET = 'TD8FOQgKsyWypsmINevu0Lz7x5FUZKsKblyYBYAhUKvzTopo81';

const tokenEncoded = encodeURIComponent(ACCESS_TOKEN);
const secretEncoded = encodeURIComponent(ACCESS_TOKEN_SECRET);
const consumerKey = btoa(tokenEncoded + ':' + secretEncoded);

// Default config options
const defaultOptions = {
  method: 'post', // default
  baseURL: 'https://api.twitter.com/',
  headers: {
      Authorization: `Basic ${consumerKey}`
    },
}

// Create instance
const api = axios.create();
// const apiAuthorized = axios.create(trumpTweets);

const grantTypeCC = querystring.stringify({
    grant_type: 'client_credentials'
  });

const twitterPull = () => api.post('/oauth2/token', grantTypeCC, defaultOptions)
    .then(response => response.data)
    .then(token => {
        console.log(`${token.token_type} token received`);
        console.log(`the token is ::: ${token.access_token}`);
        //api.defaults.headers.common['Authorization'] = `bearer ${token.access_token}`;
        // const apiAuthorized = axios.create({ header: { Authorization: `Bearer ${token.access_token}` }});
        //https://api.twitter.com/1.1/statuses/user_timeline.json?count=100&screen_name=realDonaldTrump
        const API_URL = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=realDonaldTrump&tweet_mode=extended&count=100';
        api.get(API_URL, { headers: { Authorization: `Bearer ${token.access_token}`}})
            .then(response => response.data)
            .then(tweets => {
                console.log('tweets receied from Axios in twitterPull: ', Object.keys(tweets).length )
                tweets.forEach(tweet => {
                    console.log(`
                        - Tweet data -
                        id: ${tweet.id}
                        id_str: ${tweet.id_str}
                        created_at: ${tweet.created_at}
                        tweet_message: ${tweet.full_text}
                    `)
                    
                    Tweet.findOrCreate({ where: { id: tweet.id}, defaults: {
                        id_str: tweet.id_str,
                        created_at: tweet.created_at,
                        tweet_message: tweet.full_text }
                    })
                        .then( ()=> console.log('tweet added'))
                        .catch(err => console.log(err))
                });
            })
            .catch(err => console.log(`
                error: ${err.message}

            `));
    })
    .catch(err => console.error(`
            error: ${err.message}
            error message: ${err.response.data.errors ? err.response.data.errors[0].message : 'undefinded'}
            error status: ${err.response.status}
            
        
        `))

module.exports = twitterPull;