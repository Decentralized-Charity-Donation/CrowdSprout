import React from "react";
import { Link } from "react-router-dom";
import ConnectWallet from "./ConnectWallet";

const Navbar = ({ homeRef, aboutUsRef, contactUsRef }) => {
  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-6 py-2">
      <div className="text-xl font-bold flex-shrink-0">
        <Link to="/home">CharityChain</Link>
      </div>

      <div className="flex flex-grow justify-center space-x-8">
        <button
          onClick={() => scrollToSection(homeRef)}
          className="font-medium hover:text-purple-500 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Home
        </button>
        <button
          onClick={() => scrollToSection(aboutUsRef)}
          className="font-medium hover:text-purple-500 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          About Us
        </button>
        <button
          onClick={() => scrollToSection(contactUsRef)}
          className="font-medium hover:text-purple-500 hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          Contact Us
        </button>
      </div>

      <div className="flex items-center space-x-4 flex-shrink-0">
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Navbar;
