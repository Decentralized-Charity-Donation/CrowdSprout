import { useContract } from "@/ContractContext/ContractContext";
import React, { useState, useEffect } from 'react';

const RequestWithdrawalCard = ({ campaignId }) => {
  const { contract } = useContract(); 
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [didWithdraw, setDidWithdraw] = useState(false);
 
 
  const checkConditions = async () => {
    try {
      const exists = await contract.exists(campaignId);
      if (!exists) {
        setIsButtonEnabled(false); 
        return;
      }
      const deadlineReached = true;

      if (deadlineReached) {
        const votesInFavour = await contract.isVotesInFavour(campaignId);
        console.log(votesInFavour ,deadlineReached)
        setIsButtonEnabled(votesInFavour);
        return;
      }

      setIsButtonEnabled(false);
    } catch (error) {
      console.error("Error checking conditions:", error);
      setIsButtonEnabled(false); 
    }
  };

  useEffect(() => {
    checkConditions();
  }, []);

  const handleRequest = async () => {
    try {
      const exists = await contract.exists(campaignId);
      if (!exists) {
        alert("Funds already withdrawn or campaign does not exist.");
        setIsButtonEnabled(false); 
        return;
      }

      const deadline = await contract.isDeadlineReached(campaignId);
      if (deadline) {
        const votes = await contract.isVotesInFavour(campaignId);
        if (votes) {
          await contract.ownerWithdraw(campaignId);
          setDidWithdraw(true);
          setIsButtonEnabled(false); 
        } else {
          alert("50% of votes not reached :(");
          return;
        }
      } else {
        const votes = await contract.isVotesInFavour(campaignId);
        if (votes) {
          await contract.ownerWithdraw(campaignId);
          setDidWithdraw(true);
          setIsButtonEnabled(false); 
        } else {
          alert("50% of votes not reached :(");
          return;
        }
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Request failed. Please try again.");
      setIsButtonEnabled(false); 
    }
  };

  return (
    <div className="bg-purple-100 rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-purple-600">WITHDRAW ETH</h2>
      <p className="text-sm text-purple-600">
        You can only withdraw the money if you have reached 80% of the goal and got more than 50% votes.
      </p>

     
      {didWithdraw && (
        <div className="text-green-500 font-medium mb-4">
          Withdrawal successful!
        </div>
      )}

      <button
        onClick={handleRequest}
        disabled={!isButtonEnabled} 
        className={`mt-4 w-full py-3 rounded-md text-white font-medium ${isButtonEnabled ? "bg-purple-700 hover:bg-purple-600" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Request
      </button>
    </div>
  );
};

export default RequestWithdrawalCard;
