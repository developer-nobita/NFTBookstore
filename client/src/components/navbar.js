import React from 'react';
import { FaWallet } from "react-icons/fa";

const Navbar = (props) => {
    
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">BooK Store</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
            <li className="nav-item">
            <a className="nav-link" href="/">Store</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/upload">Upload New book</a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="/mybooks">My Books</a>
            </li>
        </ul>
        </div>
        <span className="navbar-text">
            <FaWallet className="mx-2"/>
            {props.name}
        </span>
      </nav>
    </>
  );
};

export default Navbar;

