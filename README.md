# Contravylt

A decentralized platform for **news verification and citizen-driven verification** on blockchain, built to counter the spread of misinformation—particularly during crises and sensitive geopolitical events.

---

## 🚀 Problem Statement
In an age of rapid information dissemination, fake news can spark chaos, especially in tense geopolitical contexts. For example, during recent tensions between India and Pakistan, misinformation led to panic and confusion.

---

## 💡 Proposed Solution
**Contravylt** leverages:
- AI/ML models for real-time news verification.
- Blockchain (Polygon) for storing tamper-proof verification records.
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
- **Blockchain:** Polygon (Sepolia testnet for demo)

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

![Demo Screenshot](demo.png)
![swappy-20250531-200457](https://github.com/user-attachments/assets/cb1b5529-189c-43eb-ae58-00c218705ce9)
![swappy-20250531-201024](https://github.com/user-attachments/assets/ac507c4b-50f8-4925-a666-5f50560f4a65)
![swappy-20250531-201056](https://github.com/user-attachments/assets/2a6505a9-602a-43ba-804a-42a60c7e711f)
![swappy-20250531-201210](https://github.com/user-attachments/assets/d504bd08-9a1c-4974-9e21-a084e4025189)

---

## ⚡ Future Enhancements
🔹 Enhance AI accuracy (fine-tune ML models).  
🔹 Fully implement real-time voting & community review.  
🔹 Polish UI/UX and performance.  
🔹 Migrate to Polygon mainnet for real-world use.

---

## 📦 Running Locally
```bash
# Clone the repo
git clone https://github.com/<your-username>/contravylt.git
cd contravylt

# Install backend dependencies
cd backend
npm install
node index.js

# Install frontend dependencies
cd ../frontend
npm install
npm run dev
