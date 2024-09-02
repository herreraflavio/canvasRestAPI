require("dotenv").config();

const axios = require("axios");
const FormData = require("form-data");

// please read the README.md file to know how to get the API_URL and API_KEY

const API_URL = process.env.CANVAS_API_URL;
const API_KEY = process.env.CANVAS_API_KEY;

let data = new FormData();
data.append(
  "user[avatar][url]",
  "https://secure.gravatar.com/avatar/e249c6fcaedcb3b09d6575fb7626dd26?s=128&d=identicon"
);
data.append("_method", "PUT");

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: `${API_URL}users/self`,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    ...data.getHeaders(),
  },
  data: data,
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
