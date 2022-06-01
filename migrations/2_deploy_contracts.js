var BookStore = artifacts.require("./BookStore.sol");
var StoreFront = artifacts.require("./StoreFront.sol");
module.exports = async function(deployer) {

  await deployer.deploy(BookStore);

  const bookStore = await BookStore.deployed()

  await deployer.deploy(StoreFront)

  const storeFront = await StoreFront.deployed()

  await bookStore.setStoreFront(storeFront.address)
  await storeFront.setBookStore(bookStore.address)
};
