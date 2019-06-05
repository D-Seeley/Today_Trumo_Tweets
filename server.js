//Dev - force load of local .env file
require('dotenv').config()

const path = require('path');
const express = require('express');
const db = require('./db');
const { User } = db.models;

const { authTwitter, twitterPull } = require('./utils/twitterPull');

const app = express();
app.use(require('body-parser').json());

const port = process.env.PORT || 3000;
const key = '';
const secret = '';

app.use('/dist', express.static(path.join(__dirname, 'dist')));

const index = path.join(__dirname, 'index.html');

app.get('/', (req, res)=> res.sendFile(index));


app.use((err, req, res, next)=> {
  res.status(500).send({ error: err.message });
});

app.listen(port, ()=> console.log(`listening on port ${port}`));

const startServer = async () => {
  try {
    //Note - not sure if await is working the way I think here, is my authTwitter func a promise...?
    await authTwitter()
    await db.syncAndSeed()
    await twitterPull()
  }
  catch (err) {
    console.log('Server did not start ', err)
  }
}

startServer();

