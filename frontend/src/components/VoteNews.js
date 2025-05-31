"use client";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, Hash, Loader2 } from "lucide-react";

// Mock function - replace with your actual contract utility
const getContract = async () => {
  return {
    voteNews: async (hash, voteType) => {
      // Mock transaction
      return { wait: async () => Promise.resolve() };
    }
  };
};

export default function VoteNews() {
  const [ipfsHash, setIpfsHash] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType) => {
    if (!ipfsHash.trim()) {
      setStatus("Please enter an IPFS hash");
      return;
    }

    setIsLoading(true);
    setStatus("Connecting to wallet...");

    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } else {
        throw new Error("MetaMask is not installed");
      }

      setStatus("Sending vote transaction...");
      const contract = await getContract();
      const tx = await contract.voteNews(ipfsHash, voteType);
      await tx.wait();

      setStatus(`✅ ${voteType === 1 ? "Upvoted" : "Downvoted"} successfully!`);
      setIpfsHash("");
    } catch (error) {
      console.error(error);
      setStatus("❌ " + (error.message || "Vote failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Vote on News</h3>
        <p className="text-sm text-gray-600">Rate the authenticity of verified news</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IPFS Hash
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter IPFS hash (e.g., QmX7Y8Z9...)"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleVote(1)}
            disabled={isLoading || !ipfsHash.trim()}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ThumbsUp className="w-4 h-4" />
            )}
            <span>Upvote</span>
          </button>
          
          <button
            onClick={() => handleVote(0)}
            disabled={isLoading || !ipfsHash.trim()}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ThumbsDown className="w-4 h-4" />
            )}
            <span>Downvote</span>
          </button>
        </div>

        {status && (
          <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-sm text-gray-700 text-center">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}