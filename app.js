const path = require("path");
const express = require("express");
var geoip = require('geoip-lite');

const PORT = process.env.PORT || 3000;

express()
  .use(express.static(path.join(__dirname, "/public")))
  .get("/", (req, res) => {
    var geo = geoip.lookup(req.ip);

    console.log("Browser: " + req.headers["user-agent"]);
    console.log("Language: " + req.headers["accept-language"]);
    console.log("Country: " + (geo ? geo.country: "Unknown"));
    console.log("Region: " + (geo ? geo.region: "Unknown"));

    res.render("app");
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
