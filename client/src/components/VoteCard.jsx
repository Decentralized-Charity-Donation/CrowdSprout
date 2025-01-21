import React, { useState, useEffect } from 'react';
import { useContract } from '@/ContractContext/ContractContext';

const VoteCard = ({ campaignId, onVote }) => {
  const [voted, setVoted] = useState(false); 
  const [deadlineReached, setDeadlineReached] = useState(false); 
  const { contract } = useContract();


  useEffect(() => {
    const checkDeadline = async () => {
      try {
        const vote=await contract.getContributorsIfVoted(campaignId);
        setVoted(vote)
        const isDeadline = await contract.isDeadlineReached(campaignId);
        console.log(isDeadline)
        setDeadlineReached(isDeadline); 
      } catch (error) {
        console.error("Error checking deadline:", error);
      }
    };

    checkDeadline();
  }, []);

  const handleVote = async () => {
    try {
      const isDeadline = await contract.isDeadlineReached(campaignId);
      const hasVoted = await contract.getContributorsIfVoted(campaignId);
      if(!isDeadline)
       {
        if(!hasVoted){
          await onVote(campaignId);
          await contract.voteForWithdrawal(campaignId);
          alert("Vote submitted successfully!");
          setVoted(true);
        }
        else{
          alert("Have have already voted so no return")
          return
        }
       }
       else{
        const votesInFavor=contract.isVotesInFavour(campaignId)
        if(!votesInFavor){
          await contract.voteForWithdrawal(campaignId);
          return
        }
       }
  //     if (hasVoted) {
  //       alert("You have already voted");
      
  //       return;
  //     }

     
  //     if (deadlineReached) {
  //       alert("Deadline is over. Cannot vote now.");
  //       return;
  //     }

  //     // Proceed with voting
  //     await onVote(campaignId);
  //     await contract.voteForWithdrawal(campaignId);
  //     alert("Vote submitted successfully!");
  //     setVoted(true); // Mark as voted
    } catch (error) {
      console.error("Voting failed:", error);
      alert("To vote, you have to be a contributor.");
    }
  };

  const handleDisabledClick = () => {
    if (deadlineReached) {
      alert("Deadline is over. Cannot vote now.");
    }
  };

  return (
    <div className="bg-purple-100 rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-purple-600">VOTE</h2>
      <p className="text-sm text-purple-600">
        Support this campaign by voting for its success. Your vote helps determine the priority and visibility of this campaign.
      </p>

      {/* Red alert message if the user has voted */}
      {voted && (
        <p className="text-sm text-red-600 mt-2">You have already voted!</p>
      )}

      {/* Red alert message if the deadline is reached */}
      {deadlineReached && (
        <p className="text-sm text-red-600 mt-2">The deadline has passed. You cannot vote anymore.</p>
      )}

      <button
        onClick={voted || deadlineReached ? handleDisabledClick : handleVote} 
        className={`mt-4 w-full py-3 rounded-md font-medium ${
          voted || deadlineReached
            ? 'bg-pink-200 cursor-not-allowed' 
            : 'bg-purple-700 hover:bg-purple-600 text-white'
        }`}
        disabled={voted || deadlineReached}
      >
        Vote
      </button>
    </div>
  );
};

export default VoteCard;
