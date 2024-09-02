require("dotenv").config({ path: "../.env" });

const axios = require("axios");

const API_URL = process.env.CANVAS_API_URL;
const API_KEY = process.env.CANVAS_API_KEY;

async function checkProfilePicture() {
  console.log("Checking profile picture...");

  try {
    // Make a GET request to the Canvas API to get the current user's profile
    const response = await axios.get(`${API_URL}/users/self/profile`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const profile = response.data;

    // Check if the profile picture exists
    if (profile.avatar_url) {
      console.log("Profile picture found.");
      return profile.avatar_url;
    } else {
      console.log("No profile picture found.");
      return null;
    }
  } catch (error) {
    console.error("Error checking profile picture:", error.message);
    return null;
  }
}

module.exports = {
  checkProfilePicture,
};
