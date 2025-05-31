"use client"
import { useState } from "react";
import { getContract } from "../utils/contract";

export default function AdminVerify() {
  const [newsId, setNewsId] = useState("");
  const [status, setStatus] = useState("");

  const handleVerify = async (verified) => {
    setStatus("Connecting...");
    try {
      const contract = getContract();
      setStatus("Sending verification...");
      const tx = await contract.verifyNews(Number(newsId), verified);
      await tx.wait();
      setStatus("News verification updated!");
      setNewsId("");
    } catch (error) {
      setStatus("Error: " + error.message);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="News ID"
        value={newsId}
        onChange={(e) => setNewsId(e.target.value)}
      />
      <button onClick={() => handleVerify(true)}>Verify</button>
      <button onClick={() => handleVerify(false)}>Unverify</button>
      <p>{status}</p>
    </div>
  );
}
