// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract UShare is ERC721URIStorage {
    uint256 public contentCount = 0;

    constructor() ERC721("NFT UShare", "NFT-US") {
        console.log("This is UShare NFT Contract");
    }

    // mint NFT
    function makeAnNFT() public {
        _safeMint(msg.sender, contentCount);
        _setTokenURI(contentCount, "https://jsonkeeper.com/b/4VXC");
    }

    // Content structure definition
    struct Content {
        uint256 id;
        address creator;
        string contentHash;
        string thumbnailHash;
        string detailsHash;
        bool isUploaded;
        uint256 likesCount;
        uint256 tipsCount;
        uint256 commentsCount;
    }

    struct Comment {
        address commentor;
        string comment;
    }

    mapping(uint256 => Content) public contents;
    mapping(uint256 => address[]) likes;
    mapping(uint256 => address[]) tips;
    mapping(uint256 => Comment[]) comments;

    // Check for valid uploaded content
    modifier validContent(uint256 _id) {
        require(contents[_id].isUploaded == true, "Content not found");
        _;
    }
    function uploadContent(
        string memory _contentHash,
        string memory _thumbnailHash,
        string memory _detailsHash
    ) public {
        contentCount++;
        contents[contentCount] = Content(
            contentCount,
            msg.sender,
            _contentHash,
            _thumbnailHash,
            _detailsHash,
            true,
            0,
            0,
            0
        );
        makeAnNFT();
    }

    // Like the content
    function likeContent(uint256 _id) public validContent(_id) {
        likes[_id].push(msg.sender);
        contents[_id].likesCount++;
    }

    // Tip the content creator
    function tipCreator(uint256 _id) public payable validContent(_id) {
        require(msg.sender != contents[_id].creator, "Can't tip yourself");
        payable(contents[_id].creator).transfer(msg.value);
        tips[_id].push(msg.sender);
        contents[_id].tipsCount++;
    }

    // Comment on the content
    function commentContent(uint256 _id, string memory _comment)
        public
        validContent(_id)
    {
        comments[_id].push(Comment(msg.sender, _comment));
        contents[_id].commentsCount++;
    }

    // Get Content's likes
    function getLikes(uint256 _id) public view returns (address[] memory) {
        return likes[_id];
    }

    // Get Content's tips
    function getTips(uint256 _id) public view returns (address[] memory) {
        return tips[_id];
    }

    // Get Content's comments
    function getComments(uint256 _id) public view returns (Comment[] memory) {
        return comments[_id];
    }
}
