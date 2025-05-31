// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Contravylt {
    // Struct to hold news report data
    struct NewsReport {
        string ipfsHash;       // IPFS hash of the content
        address reporter;      // Who submitted it
        uint256 agreeVotes;    // Number of agree votes
        uint256 disagreeVotes; // Number of disagree votes
        bool verified;         // Whether admin has verified it
    }

    // Mapping of news ID to NewsReport
    mapping(uint256 => NewsReport) public newsReports;
    uint256 public newsCount;

    // Keep track of who voted on what (one vote per address!)
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    // Function to submit news
    function submitNews(string memory _ipfsHash) external {
        newsReports[newsCount] = NewsReport({
            ipfsHash: _ipfsHash,
            reporter: msg.sender,
            agreeVotes: 0,
            disagreeVotes: 0,
            verified: false
        });
        newsCount++;
    }

    // Function for admin to verify a news report
    function verifyNews(uint256 _newsId, bool _status) external {
        require(msg.sender == admin, "Only admin can verify");
        newsReports[_newsId].verified = _status;
    }

    // Function to vote on credibility
    function vote(uint256 _newsId, bool _isCredible) external {
        require(!hasVoted[msg.sender][_newsId], "Already voted!");
        if (_isCredible) {
            newsReports[_newsId].agreeVotes++;
        } else {
            newsReports[_newsId].disagreeVotes++;
        }
        hasVoted[msg.sender][_newsId] = true;
    }

    // Get a news report by ID
    function getNews(uint256 _newsId) external view returns (NewsReport memory) {
        return newsReports[_newsId];
    }
}
