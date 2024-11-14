import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useContract } from '../ContractContext/ContractContext';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { ethers } from 'ethers'; // Make sure to import ethers for Web3 functionality

const Navbar = ({ homeRef, aboutUsRef, contactUsRef }) => {
  const [account, setAccount] = useState(null);
  const { setSigner } = useContract();
  const navigate = useNavigate();

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: 'smooth',
    });
  };

  // Connect wallet function
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Reset any previous state before requesting accounts
        
        await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
  
        // Request the user's accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  
        if (accounts && accounts.length > 0) {
          // If accounts are found, set the account and signer
          setAccount(accounts[0]);
          const tempProvider = new ethers.BrowserProvider(window.ethereum);
          const tempSigner = await tempProvider.getSigner();
        await  setSigner(tempSigner); 
         const address=await tempSigner.getAddress()
      
          // Display success message
        
          navigate('/campaigns');
         
        } else {
          toast.error('No account found in MetaMask.');
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        toast.error('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      toast.warn('Please install MetaMask!');
    }
  };
  
  
  return (
    <div className='fixed top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-6 py-2'>
      <div className='text-xl font-bold flex-shrink-0'>
        <Link to="/home">Logo</Link>
      </div>
  
      <div className='flex flex-grow justify-center space-x-8'>
        <button onClick={() => scrollToSection(homeRef)} className="font-medium hover:text-purple-500 hover:scale-105 transition-transform duration-300 ease-in-out">Home</button>
        <button onClick={() => scrollToSection(aboutUsRef)} className="font-medium hover:text-purple-500 hover:scale-105 transition-transform duration-300 ease-in-out">About Us</button>
        <button onClick={() => scrollToSection(contactUsRef)} className="font-medium hover:text-purple-500 hover:scale-105 transition-transform duration-300 ease-in-out">Contact Us</button>
      </div>
  
      <div className='flex items-center space-x-4 flex-shrink-0'>
        <button onClick={connectWallet} className='bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600'>
          Connect Wallet
        </button>
      </div>
  
      <ToastContainer />
    </div>
  );
};

export default Navbar;
