import { useContract } from "@/ContractContext/ContractContext";
import React, { useState, useEffect } from 'react';

const RequestWithdrawalCard = ({ campaignId }) => {
  const { contract } = useContract(); // Assuming contract comes from context
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [didWithdraw, setDidWithdraw] = useState(false);
 
 
  const checkConditions = async () => {
    try {
      const exists = await contract.exists(campaignId);
      if (!exists) {
        setIsButtonEnabled(false); // Disable if campaign does not exist
        return;
      }
      const deadlineReached = true;

      if (deadlineReached) {
        const votesInFavour = await contract.isVotesInFavour(campaignId);
        console.log(votesInFavour ,deadlineReached)
        setIsButtonEnabled(votesInFavour); // Enable only if votes are in favor
        return;
      }

      // If the campaign is ongoing, disable the button
      setIsButtonEnabled(false);
    } catch (error) {
      console.error("Error checking conditions:", error);
      setIsButtonEnabled(false); // Disable in case of errors
    }
  };

  // Run the check on component mount and whenever `campaignId` changes
  useEffect(() => {
    checkConditions();
  }, []);

  const handleRequest = async () => {
    try {
      const exists = await contract.exists(campaignId);
      if (!exists) {
        alert("Funds already withdrawn or campaign does not exist.");
        setIsButtonEnabled(false); // Disable the button after failure
        return;
      }

      const deadline = await contract.isDeadlineReached(campaignId);
      if (deadline) {
        const votes = await contract.isVotesInFavour(campaignId);
        if (votes) {
          await contract.ownerWithdraw(campaignId);
          setDidWithdraw(true);
          setIsButtonEnabled(false); // Disable button after successful withdrawal
        } else {
          alert("50% of votes not reached :(");
          return;
        }
      } else {
        const votes = await contract.isVotesInFavour(campaignId);
        if (votes) {
          await contract.ownerWithdraw(campaignId);
          setDidWithdraw(true);
          setIsButtonEnabled(false); // Disable button after successful withdrawal
        } else {
          alert("50% of votes not reached :(");
          return;
        }
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Request failed. Please try again.");
      setIsButtonEnabled(false); // Disable button after error
    }
  };

  return (
    <div className="bg-purple-100 rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-purple-600">WITHDRAW ETH</h2>
      <p className="text-sm text-purple-600">
        You can only withdraw the money if you have reached 80% of the goal and got more than 50% votes.
      </p>

      {/* Show success message if withdrawal is successful */}
      {didWithdraw && (
        <div className="text-green-500 font-medium mb-4">
          Withdrawal successful!
        </div>
      )}

      <button
        onClick={handleRequest}
        disabled={!isButtonEnabled} // Disable the button if conditions are not met
        className={`mt-4 w-full py-3 rounded-md text-white font-medium ${isButtonEnabled ? "bg-purple-700 hover:bg-purple-600" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Request
      </button>
    </div>
  );
};

export default RequestWithdrawalCard;
