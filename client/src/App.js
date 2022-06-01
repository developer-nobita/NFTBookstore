import React, { Component } from "react";
import BookStore from "./contracts/BookStore.json";
import StoreFront from "./contracts/StoreFront.json";

import getWeb3 from "./getWeb3";

import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Navbar, DataForm, BookList } from "./components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    storeFront: null,
    bookStore: null,
    user: null,
    // owner: null,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const user = accounts[0];

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetworkStoreFront = StoreFront.networks[networkId];
      const storeFront = new web3.eth.Contract(
        StoreFront.abi,
        deployedNetworkStoreFront && deployedNetworkStoreFront.address,
      );

      const deployedNetworkBookStore = BookStore.networks[networkId];

      const address = "0x1490433f1E65f665a20E28EcB3f49B9a01c0Aa60"
      const bookStore = new web3.eth.Contract(
        BookStore.abi,
        deployedNetworkBookStore && deployedNetworkBookStore.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, storeFront, bookStore, user }, this.setApproval);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);

    }
  };

  setApproval = async () => {
    const flag = await this.state.bookStore.methods.isApprovedForAll(this.state.user, this.state.storeFront._address).call();
    if (flag == false) {
      try {
        alert("Please approve our app for transactions")
        await this.state.bookStore.methods.setApprovalForAll(this.state.storeFront._address, true).send({ from: this.state.user });
      }
      catch (error) {
        alert("Approval Fail:" + error)
      }
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App mx-3">
        <Router>
          <Navbar name={this.state.accounts[0]} />
          <Routes>
            <Route path="/" element={<BookList pageName="Books for Sale" bookStore={this.state.bookStore} user={this.state.user} storeFront={this.state.storeFront} web3={this.state.web3} />} />
            <Route path="/upload" element={<DataForm web3={this.state.web3} bookStore={this.state.bookStore} user={this.state.user} />} />
            <Route path="/mybooks" element={<BookList pageName="My Books" bookStore={this.state.bookStore} user={this.state.user} storeFront={this.state.storeFront} web3={this.state.web3} />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
