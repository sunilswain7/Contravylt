const axios = require("axios");

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY;



async function uploadToIPFS(content) {
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataContent: JSON.parse(content)
      },
      {
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY
        }
      }
    );
    return res.data.IpfsHash; // return the IPFS hash
  } catch (error) {
    console.error("Pinata upload error:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { uploadToIPFS };
