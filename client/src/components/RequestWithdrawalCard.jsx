import { useContract } from "@/ContractContext/ContractContext";
import React, { useState, useEffect } from 'react';

const RequestWithdrawalCard = ({ campaignId }) => {
  const { contract } = useContract(); 
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [deadline, setDeadline] = useState(false);
  const [votes, setVotes] = useState(false);
  const [exist, setExist] = useState(true);
  const [isGoalReached, setIsGoalReached] = useState(false);

  const checkConditions = async () => {
    try {
      const campaignExists = await contract.exists(campaignId);
      setExist(campaignExists);

      if (!campaignExists) {
        setIsButtonEnabled(false);
        return;
      }

      const votesInFavour = await contract.isVotesInFavour(campaignId);
      setVotes(votesInFavour);

      const isDeadlinePassed = await contract.isDeadlineReached(campaignId, Math.floor(Date.now() / 1000));
      setDeadline(isDeadlinePassed);

      if (!isDeadlinePassed) {
        setIsButtonEnabled(false);
        return;
      }

      const goalReached = await contract.isGoalReached(campaignId);
      setIsGoalReached(goalReached);

      if (votesInFavour && goalReached) {
        setIsButtonEnabled(true);
      } else {
        setIsButtonEnabled(false);
      }

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
      await contract.ownerWithdraw(campaignId);
      alert("Money successfully received")
      setIsButtonEnabled(false);
    } catch (error) {
      console.error("Request failed:", error);
      alert("Request failed. Please try again.");
      setIsButtonEnabled(false);
    }
  };

  return (
    <div className="bg-purple-100 rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-purple-600">WITHDRAW ETH</h2>
      <p className="text-sm text-justify text-purple-600">
        The withdrawal of ETH will only be permitted if the campaign has reached 80% or more of its funding goal, the deadline has passed, and at least 50% of the contributors have approved the withdrawal. Otherwise, the funds will be refunded to the contributors.
      </p>

      {!exist && votes && (
        <div className="text-green-500 font-medium mb-4">
          Withdrawal successful!
        </div>
      )}

      <button
        onClick={handleRequest}
        disabled={!isButtonEnabled} 
        className={`mt-4 w-full py-3 rounded-md text-white font-medium ${isButtonEnabled ? "bg-purple-700 hover:bg-purple-600" : "bg-purple-400 cursor-not-allowed"}`}
      >
        Withdraw
      </button>
      
      {!deadline && <p className="text-sm text-purple-700 mt-2">Deadline not yet reached. Please try again later.</p>}
    
      {deadline && !isGoalReached && (
        <p className="text-sm text-red-700 mt-2">
          The deadline has passed, but the funding goal has not been met.
        </p>
      )}

      {deadline && !votes && (
        <p className="text-sm text-red-700 mt-2">
          Deadline reached but votes not more than 50%
        </p>
      )}
    </div>
  );
};

export default RequestWithdrawalCard;
