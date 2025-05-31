"use client";
import { useEffect, useState } from "react";
import { 
  Newspaper, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Hash, 
  RefreshCw, 
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Shield
} from "lucide-react";

// Mock function - replace with your actual contract utility
const getNewsRegistryContract = () => {
  // Mock contract methods
  return {
    getNewsCount: async () => Int(5), // Mock count
    getNewsItem: async (index) => {
      // Mock news items
      const mockItems = [
        ["QmHash1abc", "0x1234...5678", Int(Date.now() / 1000 - 3600)],
        ["QmHash2def", "0x8765...4321", Int(Date.now() / 1000 - 7200)],
        ["QmHash3ghi", "0x9999...1111", Int(Date.now() / 1000 - 10800)],
        ["QmHash4jkl", "0x2222...3333", Int(Date.now() / 1000 - 14400)],
        ["QmHash5mno", "0x4444...5555", Int(Date.now() / 1000 - 18000)]
      ];
      return mockItems[index] || ["", "", BigInt(0)];
    }
  };
};

// Mock axios for demonstration
const axios = {
  get: async (url) => {
    const mockNews = [
      {
        news: "Scientists discover breakthrough in renewable energy technology that could revolutionize solar power efficiency by 40%",
        verdict: [{ label: "REAL", score: 0.94 }]
      },
      {
        news: "Local government announces new infrastructure project to improve public transportation in the city center",
        verdict: [{ label: "REAL", score: 0.88 }]
      },
      {
        news: "Recent study shows significant improvement in air quality across major metropolitan areas",
        verdict: [{ label: "REAL", score: 0.91 }]
      },
      {
        news: "Tech company launches innovative platform for sustainable agriculture practices",
        verdict: [{ label: "REAL", score: 0.87 }]
      },
      {
        news: "Educational initiative receives funding to expand digital literacy programs in rural communities",
        verdict: [{ label: "REAL", score: 0.92 }]
      }
    ];
    
    const index = Math.floor(Math.random() * mockNews.length);
    return { data: mockNews[index] };
  }
};

export default function NewsList() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVerdict, setFilterVerdict] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const contract = getNewsRegistryContract();
        const countBigInt = await contract.getNewsCount();
        const count = Number(countBigInt);

        const newsData = [];
        for (let i = 0; i < count; i++) {
          const [ipfsHash, submitter, timestamp] = await contract.getNewsItem(i);
          const url = `https://ipfs.io/ipfs/${ipfsHash}`;
          const { data } = await axios.get(url);

          newsData.push({
            id: i,
            news: data.news,
            verdict: Array.isArray(data.verdict) ? data.verdict[0] : data.verdict,
            ipfsHash,
            submitter,
            timestamp: new Date(Number(timestamp) * 1000),
            timestampString: new Date(Number(timestamp) * 1000).toLocaleString(),
          });
        }

        setNewsList(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const getVerdictInfo = (verdict) => {
    if (!verdict) return { label: "UNKNOWN", score: 0, color: "gray", bgColor: "bg-gray-50", textColor: "text-gray-600" };
    
    const label = verdict.label || "UNKNOWN";
    const score = verdict.score || 0;
    
    if (label === "REAL") {
      return {
        label,
        score,
        color: "green",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200"
      };
    } else if (label === "FAKE") {
      return {
        label,
        score,
        color: "red",
        bgColor: "bg-red-50", 
        textColor: "text-red-700",
        borderColor: "border-red-200"
      };
    }
    
    return {
      label,
      score,
      color: "gray",
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
      borderColor: "border-gray-200"
    };
  };

  const filteredAndSortedNews = newsList
    .filter(news => {
      const matchesSearch = news.news.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterVerdict === "ALL" || 
        (news.verdict && news.verdict.label === filterVerdict);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return b.timestamp - a.timestamp;
      if (sortBy === "oldest") return a.timestamp - b.timestamp;
      if (sortBy === "confidence") {
        const aScore = a.verdict?.score || 0;
        const bScore = b.verdict?.score || 0;
        return bScore - aScore;
      }
      return 0;
    });

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const truncateAddress = (address) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const truncateHash = (hash) => {
    if (!hash) return "Unknown";
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Newspaper className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Verified News Feed</h1>
                <p className="text-sm text-gray-600">Blockchain-verified authentic news content</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>{newsList.length} verified articles</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <div>
                <p className="font-semibold text-gray-900">
                  {newsList.filter(n => n.verdict?.label === "REAL").length}
                </p>
                <p className="text-sm text-gray-600">Verified Real</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold text-gray-900">
                  {newsList.filter(n => n.verdict?.label === "FAKE").length}
                </p>
                <p className="text-sm text-gray-600">Flagged Fake</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-semibold text-gray-900">
                  {newsList.length > 0 ? formatTimeAgo(newsList[0]?.timestamp) : "N/A"}
                </p>
                <p className="text-sm text-gray-600">Latest Update</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search news content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterVerdict}
                  onChange={(e) => setFilterVerdict(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">All News</option>
                  <option value="REAL">Verified Real</option>
                  <option value="FAKE">Flagged Fake</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="confidence">Highest Confidence</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading verified news...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAndSortedNews.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No news found</h3>
            <p className="text-gray-600">
              {newsList.length === 0 
                ? "No verified news available yet." 
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        )}

        {/* News List */}
        <div className="space-y-6">
          {filteredAndSortedNews.map((news, idx) => {
            const verdictInfo = getVerdictInfo(news.verdict);
            
            return (
              <div key={news.id || idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${verdictInfo.bgColor}`}>
                        {verdictInfo.label === "REAL" ? (
                          <CheckCircle className={`w-5 h-5 text-${verdictInfo.color}-600`} />
                        ) : (
                          <XCircle className={`w-5 h-5 text-${verdictInfo.color}-600`} />
                        )}
                      </div>
                      <div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${verdictInfo.bgColor} ${verdictInfo.textColor}`}>
                          {verdictInfo.label}
                          {verdictInfo.score > 0 && (
                            <span className="ml-2 text-xs opacity-75">
                              {(verdictInfo.score * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>{formatTimeAgo(news.timestamp)}</p>
                      <p className="text-xs">{news.timestampString}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  <p className="text-gray-900 leading-relaxed text-lg mb-4">
                    {news.news}
                  </p>
                  
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Submitter: {truncateAddress(news.submitter)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4" />
                      <span>IPFS: {truncateHash(news.ipfsHash)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Verified on blockchain</span>
                      <span>•</span>
                      <span>Immutable record</span>
                    </div>
                    <button
                      onClick={() => window.open(`https://ipfs.io/ipfs/${news.ipfsHash}`, '_blank')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                    >
                      View on IPFS →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}