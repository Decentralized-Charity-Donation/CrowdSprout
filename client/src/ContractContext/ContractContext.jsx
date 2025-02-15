import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';


const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS; 
  const contractABI = import.meta.env.VITE_ABI;

  const wallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts && accounts.length > 0) {
          const tempProvider = new ethers.BrowserProvider(window.ethereum);
          const tempSigner = await tempProvider.getSigner();
          setProvider(tempProvider);
          setSigner(tempSigner);

          const tempContract = await new ethers.Contract(contractAddress, contractABI, tempSigner);
          setContract(tempContract);

          const address = await tempSigner.getAddress();
          
          setIsOwner(address === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" || "" ); 

          setIsAdmin(address === "0x70997970C51812dc3A010C7d01b50e0d17dc79C8")

          toast.success("Wallet connected successfully!");
        } else {
          toast.error("No accounts found in MetaMask.");
        }
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        toast.error("Failed to connect to MetaMask. Please try again.");
      }
    } else {
      toast.warn("Please install MetaMask!");
    }
  };

  return (
    <ContractContext.Provider value={{ wallet, signer, provider, contract, isOwner,isAdmin }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
