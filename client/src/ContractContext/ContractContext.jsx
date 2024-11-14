
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractJson from '../../../web3/ignition/deployments/chain-31337/artifacts/LockModule_CharityDonation'

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your contract address
  const contractABI = contractJson.abi;

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum)
        setProvider(tempProvider); // Set provider
      } else {
        console.error('MetaMask not found. Please install it to use this dApp.');
      }
    };

    initProvider();
  }, []);

  // Update the signer and contract when the signer is available
  useEffect(() => {
    if (signer && provider) {
      const tempContract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(tempContract); // Set contract with signer
    }
  }, [signer, provider]);

  return (
    <ContractContext.Provider value={{ provider, signer, contract, setSigner }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
