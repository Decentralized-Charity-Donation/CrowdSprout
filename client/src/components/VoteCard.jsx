import React from 'react';

const VoteCard = ({ campaignId, onVote }) => {
  const handleVote = async () => {
    try {
      await onVote(campaignId);
      alert('Vote submitted successfully!');
    } catch (error) {
      console.error('Voting failed:', error);
      alert('Voting failed. Please try again.');
    }
  };

  return (
    <div className="bg-purple-100 rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-purple-600">VOTE</h2>
      <p className="text-sm text-purple-600">
        Support this campaign by voting for its success. Your vote helps determine the priority and visibility of this campaign.
      </p>
      <button
        onClick={handleVote}
        className="mt-4 w-full py-3 rounded-md text-white font-medium bg-purple-700 hover:bg-purple-600"
      >
        Vote
      </button>
    </div>
  );
};

export default VoteCard;
