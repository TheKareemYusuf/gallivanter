// Config cloudinary using Cloud Name, API Key and API Secret

const cloudinary = require("cloudinary").v2;
const CONFIG = require("./../config/config");
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: CONFIG.CLOUDINARY_NAME,
  api_key: CONFIG.CLOUDINARY_API_KEY,
  api_secret: CONFIG.CLOUDINARY_API_SECRET,
});

// These tow functions that cloudinary provide us, such as upload and destroy
// uploadToCloudinary = async (path, folder) => {
//   try {
//     const data = await cloudinary.uploader
//       .upload(path, {
//         folder
//       });
//     return { url: data.url, public_id: data.public_id };
//   } catch (error) {
//     console.log(error);
//   }
// };

uploadToCloudinary = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { quality: "auto:low" }, // You can adjust the quality level as needed
        ],
      },
      (error, result) => {
        if (error) {
          console.log("Upload error:", error);
          reject(error); // Reject the promise on error
        } else {
          // console.log("Cloudinary upload result:", result);
          resolve({ url: result.url, public_id: result.public_id }); // Resolve the promise with the upload result
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

removeFromCloudinary = async (public_id) => {
  await cloudinary.uploader.destroy(public_id, function (error, result) {
    console.log(result, error);
  });
};

module.exports = { uploadToCloudinary, removeFromCloudinary };
