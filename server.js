const path = require('path');
const express = require('express');
const db = require('./db');
const { User } = db.models;

console.log('db in Server.js is: ', db)

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

db.syncAndSeed();
