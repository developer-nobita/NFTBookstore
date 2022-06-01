// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BookStore.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StoreFront {
    BookStore private _bookStore;

    address private _owner;

    constructor() {
        _owner = msg.sender;
    }
    
    function setBookStore(address _bookStoreAddress) public {
        require(
            msg.sender == _owner,
            "Storefront : only contract owner can set BookStore"
        );
        _bookStore = BookStore(_bookStoreAddress);
    }

    function purchaseFromAuthor(uint256 _bookVersionId) public payable {
        address payable author = _bookStore.bookVersionAuthor(_bookVersionId);
        uint256 price = _bookStore.bookVersionPrice(_bookVersionId);
        uint256 amount_recieved = msg.value;
        uint256 author_profit = amount_recieved / 5;
        require(amount_recieved >= price, "Not enough money sent");
        author.transfer(author_profit);
        address payable token_owner = payable(
            _bookStore.ownerOf(_bookVersionId)
        );
        token_owner.transfer(amount_recieved - author_profit);
        _bookStore.transferFromAuthor(msg.sender, _bookVersionId);
    }
}
