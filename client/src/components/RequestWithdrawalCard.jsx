import React from 'react';

const RequestWithdrawalCard = ({ campaignId, onVote }) => {
  const handleRequest = async () => {
    try {
      await onVote(campaignId);
      alert('Request submitted successfully!');
    } catch (error) {
      console.error('Voting failed:', error);
      alert('Request failed. Please try again.');
    }
  };

  return (
    <div className="bg-purple-100 rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-purple-600">REQUEST WITHDRAWAL</h2>
      <p className="text-sm text-purple-600">
        Support this campaign by voting for its success. Your vote helps determine the priority and visibility of this campaign.
      </p>
      <button
        onClick={handleRequest}
        className="mt-4 w-full py-3 rounded-md text-white font-medium bg-purple-700 hover:bg-purple-600"
      >
        Request
      </button>
    </div>
  );
};

export default RequestWithdrawalCard;
