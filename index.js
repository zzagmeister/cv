const fs = require('fs');
const http = require('http');
// const https = require('https');
const express = require('express');

// const CERT = fs.readFileSync('./certs/cert.pem');
// const PRIVKEY = fs.readFileSync('./certs/key.pem');

const app = express();
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});
app.use(express.static(__dirname));

http.createServer(app)
  .listen(3000);
/* https.createServer({
  cert: CERT,
  key: PRIVKEY,
}, app)
  .listen(3001); */

console.log('http://localhost:3000');
// console.log('https://localhost:3001');
