const express = require("express");
const cors = require("cors");
const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

let rawdata = fs.readFileSync("./countries_metadata.json");
let countries = JSON.parse(rawdata);
countryArr = countries.countries;

const server = express();
const port = process.env.PORT || 5000;
server.use(cors());
server.use(express.json());

const sendUserError = (status, message, res) => {
  res.status(status).json(message);
};

searchCountry = (country, query) => {
  if (country.name.startsWith(query)) {
    return {
      text: country.name,
      key: country.name,
      lat: country.lat,
      lng: country.lng,
      flag_png: country.flag_png,
    };
  }
};

async function getLatLng(req) {
  try {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    ip = ip.toString();
    let res = await axios.get(
      `http://api.ipstack.com/${ip}?access_key=a1d5abe0fd6709ed6ee80744cc29def2`
    );
    if (res) {
      return {
        lat: res.data.latitude,
        lng: res.data.longitude,
      };
    }
  } catch (err) {
    console.log(err);
  }
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var radlon1 = (Math.PI * lng1) / 180;
  var radlon2 = (Math.PI * lng2) / 180;
  var theta = lng1 - lng2;
  var radtheta = (Math.PI * theta) / 180;
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return dist;
}

server.get("/", (req, res) => {
  res.send("Hello World");
});

server.post("/api/search", (req, res) => {
  const { query } = req.body;
  if (!query) {
    sendUserError(
      400,
      { errorMessage: "Please provide query for the search." },
      res
    );
    return;
  }
  const queryCapitalized = query.charAt(0).toUpperCase() + query.slice(1);
  let filteredArr = [];
  filteredArr = countryArr
    .map(country => searchCountry(country, queryCapitalized))
    .filter(item => item);

  let loc = getLatLng(req);

  filteredArr = filteredArr.sort((item1, item2) => {
    return (
      calculateDistance(item1.lat, item1.lng, loc.lat, loc.lng) -
      calculateDistance(item2.lat, item2.lng, loc.lat, loc.lng)
    );
  });

  res.status(201).json(filteredArr);
});

server.listen(port, () => {
  //   console.log(countries.countries[0]);
  console.log(`API running on port ${port}`);
});
