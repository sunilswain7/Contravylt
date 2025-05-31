// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NewsRegistry {
    struct NewsItem {
        string ipfsHash;
        address submitter;
        uint256 timestamp;
    }

    NewsItem[] public newsItems;

    event NewsSubmitted(string ipfsHash, address indexed submitter, uint256 timestamp);

    function submitNews(string memory ipfsHash) external {
        newsItems.push(NewsItem({
            ipfsHash: ipfsHash,
            submitter: msg.sender,
            timestamp: block.timestamp
        }));

        emit NewsSubmitted(ipfsHash, msg.sender, block.timestamp);
    }

    function getNewsCount() external view returns (uint256) {
        return newsItems.length;
    }

    function getNewsItem(uint256 index) external view returns (string memory, address, uint256) {
        require(index < newsItems.length, "Invalid index");
        NewsItem memory item = newsItems[index];
        return (item.ipfsHash, item.submitter, item.timestamp);
    }
}
