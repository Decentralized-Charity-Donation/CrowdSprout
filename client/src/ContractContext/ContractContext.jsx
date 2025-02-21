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

          const tempContract = new ethers.Contract(contractAddress, contractABI, tempSigner);
          setContract(tempContract);

          const address = await tempSigner.getAddress();
          console.log(address)

          const admin=await tempContract.checkIfAdmin(address) 
          setIsAdmin(admin)
          console.log(admin)

          if(!admin){
          const owner=await tempContract.checkIfApprovedOwner(address)
          setIsOwner(owner)
          console.log(owner)
          }

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
    <ContractContext.Provider value={{ wallet, signer, provider, contract, isOwner,isAdmin}}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
