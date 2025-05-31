# Contravylt

A decentralized platform for **news verification and citizen-driven verification** on blockchain, built to counter the spread of misinformation—particularly during crises and sensitive geopolitical events.

---

## 🚀 Problem Statement
In an age of rapid information dissemination, fake news can spark chaos, especially in tense geopolitical contexts. For example, during recent tensions between India and Pakistan, misinformation led to panic and confusion.

---

## 💡 Proposed Solution
**Contravylt** leverages:
- AI/ML models for real-time news verification.
- Blockchain (Ethereum testnet Sepolia) for storing tamper-proof verification records.
- IPFS for immutable storage of news verification data.
- Community-driven voting for credibility assessment.

---

## 🎯 Key Features
✅ Submit news and get real-time AI/ML verdicts.  
✅ Store verdicts on-chain for tamper-proof records.  
✅ Retrieve all verified news via blockchain.  
✅ Community voting on credibility of each news item.  
✅ Transparent, censorship-resistant records.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js, TailwindCSS, Ethers.js  
- **Backend:** Node.js, Express.js, HuggingFace AI API  
- **Smart Contracts:** Solidity, Hardhat  
- **Storage:** IPFS (via Pinata)  
- **Blockchain:** Ethereum (Sepolia testnet for demo)

---

## 🏗️ Architecture & Workflow
1️⃣ **User submits news** via frontend.  
2️⃣ **AI backend** checks news credibility using HuggingFace’s ML models.  
3️⃣ Verdict & metadata stored on **IPFS** and hash sent to smart contract (`NewsRegistry.sol`).  
4️⃣ Users retrieve verified news data and can **vote** on it.  
5️⃣ All actions are recorded on blockchain for transparency.

---

## 🏁 Current Progress
- [x] AI backend built & integrated (Node.js + HuggingFace)  
- [x] Smart contract deployed on Sepolia testnet  
- [x] Frontend built with Next.js
- [x] News submission + verification + blockchain storage  
- [x] Voting functionality (WIP)  

Screenshot of Demo:
![swappy-20250531-200457](https://github.com/user-attachments/assets/cb1b5529-189c-43eb-ae58-00c218705ce9)
![swappy-20250531-201024](https://github.com/user-attachments/assets/ac507c4b-50f8-4925-a666-5f50560f4a65)
![swappy-20250531-201056](https://github.com/user-attachments/assets/2a6505a9-602a-43ba-804a-42a60c7e711f)
![swappy-20250531-201210](https://github.com/user-attachments/assets/d504bd08-9a1c-4974-9e21-a084e4025189)
![swappy-20250531-201253](https://github.com/user-attachments/assets/78db7c73-3e48-4cd1-98f2-8ab8597e1193)
![swappy-20250531-201333](https://github.com/user-attachments/assets/83b7ea1c-185c-4564-9f3c-144ee70f6bec)
![swappy-20250531-201357](https://github.com/user-attachments/assets/1a2e1793-d9ba-478a-bb60-4455ee8a441d)
![swappy-20250531-201430](https://github.com/user-attachments/assets/6572eb70-66e6-44e8-8c95-20bb6e3bf62f)
![swappy-20250531-201944](https://github.com/user-attachments/assets/7215891e-253e-4ac6-824b-fcb1261d3309)
![swappy-20250531-202441](https://github.com/user-attachments/assets/f2bcae49-978b-4ca9-a18e-cec61dc74545)

---

## ⚡ Future Enhancements
🔹 Enhance AI accuracy (fine-tune ML models).  
🔹 Fully implement real-time voting & community review.  
🔹 Polish UI/UX and performance.  
🔹 Migrate to Ethereum mainnet for real-world use.

---

## 📦 Running Locally
```bash
# Clone the repo
git clone https://github.com/sunilswain7/contravylt.git
cd contravylt

# Install backend dependencies
cd backend
npm install
node index.js

# Install frontend dependencies
cd frontend
npm install
npm run dev
```

---

⚙️ AI Model Update  
We currently utilize an AI model from huggingface (api-inference.huggingface.co/models/mrm8488/bert-tiny-finetuned-fake-news-detection) for news verification.

LSTM Model Already Developed  
We’ve already built a deep learning LSTM-based AI model designed to enhance news verification on Contravylt. While it hasn’t been fully integrated yet, the foundation is in place and we are now working on improving its accuracy and ensuring proper connection to our platform.

Model Highlights:
- Libraries: Pandas, Scikit-learn, TensorFlow/Keras, NumPy, Pickle  
- Data: Merged real and fake news datasets, cleaned, tokenized, and padded to 150 tokens  
- Architecture:
  - Embedding layer (100-dimensional vectors)  
  - LSTM layer with 150 units and 0.5 dropout  
  - GlobalMaxPooling1D for sequence output aggregation  
  - Dense layers using ReLU and softmax for binary classification  
- Training: Adam optimizer (lr=0.0001), categorical cross-entropy loss, trained for 15 epochs  
- Prediction: Takes news text input, uses a pre-trained tokenizer, and returns a 'FAKE' or 'REAL' label with a confidence score.

We’re now focused on refining this model and completing the integration to deliver more reliable and accurate news verification.
