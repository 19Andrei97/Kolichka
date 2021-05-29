const path = require("path");
const express = require("express");

const PORT = 3000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', (req, res) => res.render('public/index.html'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));