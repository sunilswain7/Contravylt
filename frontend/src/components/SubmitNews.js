"use client";
import { useState } from "react";
import { Shield, CheckCircle, XCircle, AlertTriangle, Globe, Database, Link } from "lucide-react";
import axios from "axios";
import { getContract } from "../utils/contract";

export default function SubmitNews() {
  const [newsText, setNewsText] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const handleSubmit = async () => {
    if (!newsText.trim()) {
      setStatus("Please enter news text to verify");
      return;
    }

    setIsLoading(true);
    setStatus("Initializing verification process...");
    setVerdict(null);
    setConfidence(null);

    try {
      setStatus("Connecting to MetaMask wallet...");
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } else {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.");
      }

      setStatus("Analyzing news content with AI verification system...");
      const response = await axios.post("http://localhost:3001/checkNews", {
        news: newsText,
      });

      const { verdict: apiVerdict, ipfsHash } = response.data;
      const result = apiVerdict[0][0];
      setVerdict(result.label);
      setConfidence(result.score);

      if (result.label === "REAL") {
        setStatus("Content verified as authentic. Storing on blockchain...");

        const contract = await getContract();
        const tx = await contract.submitNews(ipfsHash);
        await tx.wait();

        setStatus("✅ Verified news successfully stored on blockchain!");
      } else {
        setStatus("⚠️ Content flagged as potentially false. Not stored on blockchain.");
      }

      setNewsText("");
    } catch (error) {
      console.error(error);
      setStatus("❌ " + (error.message || "Verification failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading)
      return (
        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      );
    if (verdict === "REAL") return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (verdict === "FAKE") return <XCircle className="w-5 h-5 text-red-500" />;
    if (status.includes("❌")) return <XCircle className="w-5 h-5 text-red-500" />;
    if (status.includes("✅")) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  };

  const getVerdictColor = () => {
    if (verdict === "REAL") return "text-green-600 bg-green-50 border-green-200";
    if (verdict === "FAKE") return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CONTRAVYLT</h1>
              <p className="text-sm text-gray-600">Blockchain-powered fake news detection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-semibold text-gray-900">AI Analysis</p>
                <p className="text-sm text-gray-600">Advanced ML verification</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-green-500" />
              <div>
                <p className="font-semibold text-gray-900">IPFS Storage</p>
                <p className="text-sm text-gray-600">Decentralized content</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <Link className="w-6 h-6 text-purple-500" />
              <div>
                <p className="font-semibold text-gray-900">Blockchain</p>
                <p className="text-sm text-gray-600">Immutable verification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Submit News for Verification</h2>
            <p className="text-blue-100 text-sm mt-1">Enter news content to check authenticity</p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">News Content</label>
                <textarea
                  placeholder="Paste or type the news content you want to verify..."
                  value={newsText}
                  onChange={(e) => setNewsText(e.target.value)}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">{newsText.length}/1000 characters</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading || !newsText.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Verify News</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Status Display */}
        {status && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-3">
                {getStatusIcon()}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Verification Status</h3>
                  <p className="text-gray-700">{status}</p>

                  {verdict && confidence && (
                    <div className={`mt-4 p-4 rounded-lg border ${getVerdictColor()}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-lg">Verdict: {verdict}</p>
                          <p className="text-sm opacity-75">
                            Confidence: {(confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-2xl">{verdict === "REAL" ? "✅" : "❌"}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How it Works */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                  1
                </div>
                <p>
                  <strong>Connect Wallet:</strong> MetaMask integration for blockchain interaction
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                  2
                </div>
                <p>
                  <strong>AI Analysis:</strong> Advanced ML models analyze content authenticity
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                  3
                </div>
                <p>
                  <strong>IPFS Storage:</strong> Verified content stored on decentralized network
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                  4
                </div>
                <p>
                  <strong>Blockchain Record:</strong> Immutable verification stored on-chain
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
