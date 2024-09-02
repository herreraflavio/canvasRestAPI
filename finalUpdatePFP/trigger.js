const schedule = require("node-schedule");
const { checkProfilePicture } = require("./checkProfilePicture"); // Importing the function from the module
const { uploadProfileImage } = require("./updatePFP"); // Importing the function from the module

const startYear = 2024;
const startMonth = 8; // September (months are zero-indexed, so 8 = September)
const startDay = 1;
const startHour = 18; // 1 PM
const startMinute = 40;
const startSecond = 10;

const endYear = 2024;
const endMonth = 8; // September (months are zero-indexed, so 8 = September)
const endDay = 1;
const endHour = 19; // 1 PM
const endMinute = 25;
const endSecond = 30;

const intervalMinutes = 0; // Interval in minutes
const intervalSeconds = 60; // Interval in seconds
const intervalDuration = (intervalMinutes * 60 + intervalSeconds) * 1000; // Convert to milliseconds

const cooldownSeconds = 10; // Cooldown period in seconds
const cooldown = cooldownSeconds * 1000; // Convert cooldown to milliseconds

let jobRunning = false; // Boolean flag to control the interval

// Create Date objects for start and end times
let startDate = new Date(
  startYear,
  startMonth,
  startDay,
  startHour,
  startMinute,
  startSecond
);
let endDate = new Date(
  endYear,
  endMonth,
  endDay,
  endHour,
  endMinute,
  endSecond
);

// Current time
const now = new Date();

// Ensure start and end dates make sense
if (endDate <= now) {
  console.log("End date is in the past. Exiting script.");
  process.exit(0);
}

if (startDate <= now) {
  console.log(
    "Start date is in the past. Adjusting start time to current time plus cooldown."
  );
  startDate = new Date(now.getTime() + cooldown);
  console.log(
    `Adjusted start time: ${startDate.toLocaleString()} (Timestamp: ${startDate.getTime()})`
  );
}

// Function to display the countdown
function displayCountdown() {
  const now = new Date();
  const timeDifference = startDate - now;

  if (timeDifference > 0) {
    const seconds = Math.floor((timeDifference / 1000) % 60);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    console.log(`Countdown: ${days}d ${hours}h ${minutes}m ${seconds}s`);
  } else {
    clearInterval(countdownInterval);
    console.log("Job is starting now!");
  }
}

// Start a countdown timer that updates every second
const countdownInterval = setInterval(displayCountdown, 1000);

// Schedule the job to start at the adjusted start date and time
const startJob = schedule.scheduleJob(startDate, async function () {
  console.log(
    `Job started at ${startDate.toLocaleString()} (Timestamp: ${startDate.getTime()}).`
  );
  let imageURL = await uploadProfileImage("grid.jpg"); // Call the function to upload the profile picture
  console.log("=====================================");
  console.log(`Uploading profile image with URL: ${imageURL}`);
  console.log("=====================================");
  jobRunning = true;

  const intervalId = setInterval(async function () {
    if (jobRunning) {
      console.log("Running interval job...");
      const profilePictureUrl = await checkProfilePicture(); // Call the function to check the profile picture
      if (profilePictureUrl) {
        console.log(`Profile picture URL: ${profilePictureUrl}`);
        if (profilePictureUrl !== imageURL) {
          console.log("Profile picture updated. Exiting script.");
          imageURLUpdated = await uploadProfileImage("grid.jpg"); // Call the function to upload the profile picture
          console.log("=====================================");
          console.log(`Uploading profile image with URL: ${imageURLUpdated}`);
          console.log("=====================================");
          imageURL = imageURLUpdated;
        }
      } else {
        console.log("No profile picture URL found.");
      }
    } else {
      clearInterval(intervalId);
      console.log("Interval stopped.");
    }
  }, intervalDuration);

  // Schedule the job to end at the specific end date and time
  schedule.scheduleJob(endDate, function () {
    console.log(
      `Job ended at ${endDate.toLocaleString()} (Timestamp: ${endDate.getTime()}).`
    );
    jobRunning = false;

    clearInterval(intervalId);
    console.log("Interval cleared.");

    // Add a cooldown after the job ends before exiting the script
    console.log(
      `Cooling down for ${cooldownSeconds} seconds before exiting...`
    );
    setTimeout(() => {
      console.log("Cooldown finished. Exiting script.");
      process.exit(0);
    }, cooldown);
  });
});

console.log(
  `Job scheduled to start at ${startDate.toLocaleString()} and end at ${endDate.toLocaleString()}.`
);
