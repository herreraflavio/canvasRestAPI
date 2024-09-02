// require("dotenv").config({ path: "../.env" });

// const axios = require("axios");
// const fs = require("fs");
// const FormData = require("form-data");
// const path = require("path");
// const qs = require("qs"); // For URL encoding

// const API_URL = process.env.CANVAS_API_URL;
// const API_KEY = process.env.CANVAS_API_KEY;
// // const localImagePath = path.resolve(__dirname, "mars.jpg");
// // const localImagePath = path.resolve(__dirname, "mars.jpg");

// const initiateFileUpload = async (localImagePath) => {
//   try {
//     const formData = new FormData();
//     formData.append("name", "profile.jpg");
//     formData.append("size", fs.statSync(localImagePath).size);
//     formData.append("content_type", "image/jpeg");
//     formData.append("parent_folder_path", "/profile pictures");
//     formData.append("on_duplicate", "overwrite");

//     const config = {
//       method: "post",
//       url: `${API_URL}users/self/files`,
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         ...formData.getHeaders(),
//       },
//       data: formData,
//     };

//     console.log("Initiating file upload with data:", formData);
//     const response = await axios.request(config);
//     console.log("Initiate File Upload Response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error initiating file upload:",
//       error.response ? error.response.data : error.message
//     );
//     throw error;
//   }
// };

// const uploadFileToCanvas = async (localImagePath, uploadData) => {
//   try {
//     // const localImagePath = path.resolve(__dirname, fileName);
//     const uploadUrl = uploadData.upload_url;
//     const uploadParams = uploadData.upload_params;

//     const formData = new FormData();
//     for (const key in uploadParams) {
//       formData.append(key, uploadParams[key]);
//     }
//     formData.append("file", fs.createReadStream(localImagePath));

//     const config = {
//       method: "post",
//       url: uploadUrl,
//       headers: {
//         ...formData.getHeaders(),
//       },
//       data: formData,
//       maxBodyLength: Infinity, // To handle large files
//     };

//     console.log("Uploading file to Canvas with data:", formData);
//     const response = await axios.request(config);
//     console.log(
//       "File uploaded successfully. Response headers:",
//       response.headers
//     );

//     // The location of the newly uploaded file is in the 'Location' header
//     const fileLocation = response.headers.location;
//     console.log("Uploaded file location:", fileLocation);

//     return fileLocation;
//   } catch (error) {
//     console.error(
//       "Error uploading file to Canvas:",
//       error.response ? error.response.data : error.message
//     );
//     throw error;
//   }
// };

// const fetchAvailableAvatars = async () => {
//   try {
//     const config = {
//       method: "get",
//       url: `${API_URL}users/self/avatars`,
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//       },
//     };

//     console.log("Fetching available avatars.");
//     const response = await axios.request(config);
//     console.log("Available Avatars:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error fetching available avatars:",
//       error.response ? error.response.data : error.message
//     );
//     throw error;
//   }
// };

// const setProfilePicture = async (avatarToken) => {
//   try {
//     const data = qs.stringify({
//       "user[avatar][token]": avatarToken,
//     });

//     const config = {
//       method: "put",
//       url: `${API_URL}users/self`,
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       data: data,
//     };

//     console.log("Setting profile picture with data:", data);
//     const response = await axios.request(config);
//     console.log("Profile picture set successfully:", response.data);
//   } catch (error) {
//     console.error(
//       "Error setting profile picture:",
//       error.response ? error.response.data : error.message
//     );
//     throw error;
//   }
// };

// const getFileDetails = async (fileUrl) => {
//   try {
//     const config = {
//       method: "get",
//       url: fileUrl,
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//       },
//     };

//     console.log("Fetching file details from URL:", fileUrl);
//     const response = await axios.request(config);
//     console.log("File details:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error fetching file details:",
//       error.response ? error.response.data : error.message
//     );
//     throw error;
//   }
// };

// const uploadProfileImage = async (fileName) => {
//   try {
//     // Step 1: Initiate File Upload
//     const localImagePath = path.resolve(__dirname, fileName);
//     const uploadInitData = await initiateFileUpload(localImagePath);

//     // Check if the response contains the required fields
//     if (!uploadInitData.upload_url || !uploadInitData.upload_params) {
//       throw new Error("Missing upload URL or upload params in the response");
//     }

//     // Step 2: Upload the File
//     const fileLocation = await uploadFileToCanvas(
//       localImagePath,
//       uploadInitData
//     );

//     // Step 3: Get File Details to retrieve the 'id' and 'thumbnail_url'
//     const fileDetails = await getFileDetails(fileLocation);

//     // Delay to ensure the avatar is processed
//     console.log("Waiting for 15 seconds to ensure the avatar is processed.");
//     await new Promise((resolve) => setTimeout(resolve, 15000));

//     // Step 4: Fetch Available Avatars
//     const avatars = await fetchAvailableAvatars();

//     // Step 5: Find the newly uploaded avatar and set it
//     const newAvatar = avatars.find(
//       (avatar) =>
//         (avatar.type === "attachment" && avatar.id === fileDetails.id) ||
//         (avatar.type === "attachment" &&
//           avatar.filename === fileDetails.filename)
//     );

//     if (newAvatar && newAvatar.token) {
//       console.log("Using avatar token:", newAvatar.token);
//       await setProfilePicture(newAvatar.token);

//       // Verify if the avatar_url has been updated
//       console.log("Fetching user profile to verify the avatar update.");
//       const config = {
//         method: "get",
//         url: `${API_URL}users/self/profile`,
//         headers: {
//           Authorization: `Bearer ${API_KEY}`,
//         },
//       };
//       const profileResponse = await axios.request(config);

//       console.log("=====================================");
//       console.log(
//         "User profile after avatar update:",
//         profileResponse.data.avatar_url
//       );
//       console.log("=====================================");
//       return profileResponse.data.avatar_url; // Return the updated avatar URL
//     } else {
//       console.error("Failed to find the newly uploaded avatar.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Failed to update profile picture:", error);
//     return null;
//   }
// };

// module.exports = {
//   uploadProfileImage,
// };
// // uploadProfileImage();
require("dotenv").config({ path: "../.env" });

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const qs = require("qs");

// Environment variables
const API_URL = process.env.CANVAS_API_URL;
const API_KEY = process.env.CANVAS_API_KEY;

// Function to generate a random string
const generateRandomString = (length = 8) => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};

// Initiate file upload with a randomized name
const initiateFileUpload = async (localImagePath) => {
  try {
    const formData = new FormData();
    const randomFileName = `profile_${generateRandomString()}.jpg`; // Randomized file name
    formData.append("name", randomFileName);
    formData.append("size", fs.statSync(localImagePath).size);
    formData.append("content_type", "image/jpeg");
    formData.append("parent_folder_path", "/profile pictures");
    formData.append("on_duplicate", "overwrite");

    const config = {
      method: "post",
      url: `${API_URL}users/self/files`,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        ...formData.getHeaders(),
      },
      data: formData,
    };

    console.log("Initiating file upload with data:", formData);
    const response = await axios.request(config);
    console.log("Initiate File Upload Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error initiating file upload:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Upload file to Canvas
const uploadFileToCanvas = async (localImagePath, uploadData) => {
  try {
    const uploadUrl = uploadData.upload_url;
    const uploadParams = uploadData.upload_params;

    const formData = new FormData();
    for (const key in uploadParams) {
      formData.append(key, uploadParams[key]);
    }
    formData.append("file", fs.createReadStream(localImagePath));

    const config = {
      method: "post",
      url: uploadUrl,
      headers: {
        ...formData.getHeaders(),
      },
      data: formData,
      maxBodyLength: Infinity, // To handle large files
    };

    console.log("Uploading file to Canvas with data:", formData);
    const response = await axios.request(config);
    console.log(
      "File uploaded successfully. Response headers:",
      response.headers
    );

    // The location of the newly uploaded file is in the 'Location' header
    const fileLocation = response.headers.location;
    console.log("Uploaded file location:", fileLocation);

    return fileLocation;
  } catch (error) {
    console.error(
      "Error uploading file to Canvas:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Fetch available avatars with cache control
const fetchAvailableAvatars = async () => {
  try {
    const config = {
      method: "get",
      url: `${API_URL}users/self/avatars?_=${Date.now()}`, // Cache buster
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Cache-Control": "no-cache", // Force bypass of cache
        Pragma: "no-cache",
        Expires: "0",
      },
    };

    console.log("Fetching available avatars.");
    const response = await axios.request(config);
    console.log("Available Avatars:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching available avatars:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Set profile picture
const setProfilePicture = async (avatarToken) => {
  try {
    const data = qs.stringify({
      "user[avatar][token]": avatarToken,
    });

    const config = {
      method: "put",
      url: `${API_URL}users/self`,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    console.log("Setting profile picture with data:", data);
    const response = await axios.request(config);
    console.log("Profile picture set successfully:", response.data);
  } catch (error) {
    console.error(
      "Error setting profile picture:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Get file details
const getFileDetails = async (fileUrl) => {
  try {
    const config = {
      method: "get",
      url: fileUrl,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    };

    console.log("Fetching file details from URL:", fileUrl);
    const response = await axios.request(config);
    console.log("File details:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching file details:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Upload and set profile image
const uploadProfileImage = async (fileName) => {
  try {
    // Step 1: Initiate File Upload
    const localImagePath = path.resolve(__dirname, fileName);
    const uploadInitData = await initiateFileUpload(localImagePath);

    // Check if the response contains the required fields
    if (!uploadInitData.upload_url || !uploadInitData.upload_params) {
      throw new Error("Missing upload URL or upload params in the response");
    }

    // Step 2: Upload the File
    const fileLocation = await uploadFileToCanvas(
      localImagePath,
      uploadInitData
    );

    // Step 3: Get File Details to retrieve the 'id' and 'thumbnail_url'
    const fileDetails = await getFileDetails(fileLocation);

    // Delay to ensure the avatar is processed
    console.log("Waiting for 15 seconds to ensure the avatar is processed.");
    await new Promise((resolve) => setTimeout(resolve, 15000));

    // Step 4: Fetch Available Avatars
    const avatars = await fetchAvailableAvatars();

    // Step 5: Find the newly uploaded avatar and set it
    const newAvatar = avatars.find(
      (avatar) =>
        (avatar.type === "attachment" && avatar.id === fileDetails.id) ||
        (avatar.type === "attachment" &&
          avatar.filename === fileDetails.filename)
    );

    if (newAvatar && newAvatar.token) {
      console.log("Using avatar token:", newAvatar.token);
      await setProfilePicture(newAvatar.token);

      // Verify if the avatar_url has been updated
      console.log("Fetching user profile to verify the avatar update.");
      const config = {
        method: "get",
        url: `${API_URL}users/self/profile`,
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      };
      const profileResponse = await axios.request(config);

      console.log("=====================================");
      console.log(
        "User profile after avatar update:",
        profileResponse.data.avatar_url
      );
      console.log("=====================================");
      return profileResponse.data.avatar_url; // Return the updated avatar URL
    } else {
      console.error("Failed to find the newly uploaded avatar.");
      return null;
    }
  } catch (error) {
    console.error("Failed to update profile picture:", error);
    return null;
  }
};

module.exports = {
  uploadProfileImage,
};
// uploadProfileImage();
