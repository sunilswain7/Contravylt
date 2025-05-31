"use client"
import { useState } from "react";
import { getContract } from "../utils/contract";

export default function Vote() {
  const [newsId, setNewsId] = useState("");
  const [isCredible, setIsCredible] = useState(true);
  const [status, setStatus] = useState("");

  const handleVote = async () => {
    setStatus("Connecting...");
    try {
      const contract = getContract();
      setStatus("Sending vote...");
      const tx = await contract.vote(Number(newsId), isCredible);
      await tx.wait();
      setStatus("Vote submitted!");
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
      <select
        value={isCredible ? "agree" : "disagree"}
        onChange={(e) => setIsCredible(e.target.value === "agree")}
      >
        <option value="agree">Agree</option>
        <option value="disagree">Disagree</option>
      </select>
      <button onClick={handleVote}>Vote</button>
      <p>{status}</p>
    </div>
  );
}
