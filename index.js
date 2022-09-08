require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require('node:dns');

const arrayOfURLs = [];
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use((req, res, next) => {
  console.log(req.method, req.path, req.ip)
  next();
})
app.use('/public', express.static(`${process.cwd()}/public`));

// Middleware for parsing req.body 
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  let checkLink = req.body.url;
  let regHttps = /(https?:\/\/)/
  let regEndSlash = /\/+$/

  if (checkLink.includes("https://") || checkLink.includes("http://")) {
    let lookupLink = checkLink.replace(regHttps, "").replace(regEndSlash,"");
    console.log(lookupLink);
    dns.lookup(lookupLink, (err) => {
      if (err) res.json({ "error": "Invalid URL" })
      else {
        arrayOfURLs.indexOf(checkLink) == -1 ? arrayOfURLs.push(checkLink) : null;
        res.json({ "original_url": checkLink.replace(regEndSlash,""), "short_url": arrayOfURLs.indexOf(checkLink) })
      }
    })
  }
  else {
    res.json({ "error": "Invalid URL" })
  }
})

app.get('/api/shorturl/:index', (req, res) => {
  res.status(301).redirect(arrayOfURLs[req.params.index]);
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
