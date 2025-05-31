require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { uploadToIPFS } = require("./ipfs");


const app = express();
app.use(cors());
app.use(express.json());

app.post("/checkNews", async (req, res) => {
  const { news } = req.body;

  try {
    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/mrm8488/bert-tiny-finetuned-fake-news-detection",
      { inputs: news },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`
        }
      }
    );

    const ipfsContent = JSON.stringify({
      news,
      verdict: hfResponse.data
    });

    const ipfsHash = await uploadToIPFS(ipfsContent);

    res.json({
      verdict: hfResponse.data,
      ipfsHash
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to process news verification" });
  }
});

app.listen(3001, () => {
  console.log("🧠 AI backend listening on port 3001");
});
