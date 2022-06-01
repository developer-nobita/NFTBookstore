// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

 import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 // NOTE : Only for Test purpose
contract PurchaseToken is ERC20 {
         
         constructor(uint256 _totalSupply) ERC20("PurchaseToken","PRCHS") {
              _mint(msg.sender,_totalSupply);

         }

}