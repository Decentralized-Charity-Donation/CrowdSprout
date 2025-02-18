import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useContract } from "../ContractContext/ContractContext"; 
import { useNavigate } from "react-router-dom";

const ConnectWallet = () => {
  const { wallet, isOwner, contract ,isAdmin} = useContract();
  const [connecting, setConnecting] = useState(false); 
  const [connected,setConnected]=useState(false)
  const navigate = useNavigate();


  useEffect(() => {
    if (contract) {
      if(isAdmin){
        navigate("/adminPage");
      }
      
     else if (isOwner) {
        navigate("/ownercampaigns");
      } 
      else {
        navigate("/allcampaigns");
      }
      setConnecting(false); 
    }
  }, [connected]);

  const connectWallet = async () => {
    setConnecting(true); 
    try {
      await wallet(); 
      setConnected(true)
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast.error("An error occurred. Please try again.");
      setConnecting(false); 
    }
  };

  return (
    <div>
      <button
        onClick={connectWallet}
        className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600"
        disabled={connecting}
      >
        {connecting ? "Connecting..." : "Connect Wallet"}
      </button>
      <ToastContainer />
    </div>
  );
};

export default ConnectWallet;