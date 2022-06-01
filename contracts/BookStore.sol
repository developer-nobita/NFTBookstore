// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./StoreFront.sol";

contract BookStore is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _currentBookVersionId;

    mapping(uint256 => BookVersion) private _bookVersions;

    StoreFront private _storeFront;
    address private storeFrontAddress;
    struct BookVersion {
        uint256 id;
        uint256 price;
        address payable author;
        string uri;
        // TODO: wanna sell ?
    }

    address private _owner;

    constructor() ERC721("BookStore", "BK") {
        _owner = msg.sender;
    }

    function setStoreFront(address _storeFrontAddress) public {
        require(
            msg.sender == _owner,
            "BookStore : only contract owner can set storefront"
        );
        _storeFront = StoreFront(_storeFrontAddress);
        storeFrontAddress = _storeFrontAddress;
    }

    //NOTE: account for number of decimals on various whitelisted currencies(!)
    function safeMint(address to, string memory uri) private {
        uint256 tokenId = _currentBookVersionId.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function publish(
        uint256 _price,
        string memory _uri
    ) public {
        uint256 tokenId = _currentBookVersionId.current();
        safeMint(msg.sender, _uri);
        _bookVersions[tokenId] = BookVersion(
            tokenId,
            _price,
            payable(msg.sender),
            _uri
        );
        _currentBookVersionId.increment();
    }

    function transferFromAuthor(address _buyer, uint256 _bookVersionId) public {
        require(
            msg.sender == address(_storeFront),
            "Method can only be called from Store Front contract."
        );
        safeTransferFrom(ownerOf(_bookVersionId), _buyer, _bookVersionId, "");
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 _bookVersionId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(_exists(_bookVersionId), "ERC721URIStorage: URI query for nonexistent token");
        return _bookVersions[_bookVersionId].uri;
    }

    function bookVersionPrice(uint256 _bookVersionId)
        public
        view
        returns (uint256)
    {
        return _bookVersions[_bookVersionId].price;
    }

    function bookVersionAuthor(uint256 _bookVersionId)
        public
        view
        returns (address payable)
    {
        return _bookVersions[_bookVersionId].author;
    }
    
    function tokenCount()
        public
        view
        returns (uint256)
    {
        return _currentBookVersionId.current();
    }
}
