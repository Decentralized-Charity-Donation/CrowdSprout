import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContract } from '@/ContractContext/ContractContext';
import handleLogOut from '@/components/handleLogOut';

const ViewCampaign = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const { contract } = useContract();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const campaignDetails = await contract.getCampaignBasicDetails(id);
        const financialDetails = await contract.getCampaignFinancialDetails(id);
        const voteRequestDetails = await contract.getCampaignVoteRequestDetails(id);

        const campaignData = {
          id: campaignDetails.id.toString(),
          title: campaignDetails.title,
          description: campaignDetails.description,
          goal: parseFloat(financialDetails.goal),
          balance: parseFloat(financialDetails.balance),
          noOfContributors: financialDetails.noOfContributors,
          image: `https://placeimg.com/640/480/tech?id=${id}`,
          creatorAddress: campaignDetails.owner,
          daysLeft: campaignDetails.deadline - Date.now() / 1000,
          requestStatus: voteRequestDetails.requestStatus,
          votesInFavor: voteRequestDetails.votesInFavor,
        };

        setCampaign(campaignData);
      } catch (error) {
        console.error('Error fetching campaign:', error);
      }
    };

    fetchCampaign();
  }, [id, contract]);

  const handleDonate = (e) => {
    e.preventDefault();
    if (!donationAmount || donationAmount <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    contract.fund(id, { value: donationAmount });
    alert(`Donating ${donationAmount} ETH to campaign ${id}`);
  };

  const handleVote = async () => {
    await contract.voteForWithdrawal(id);
    alert('Voted for campaign withdrawal.');
  };

  if (!campaign) return <p className="text-center text-purple-700 mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-6 py-2" style={{ height: '50px' }}>
        <div className="text-xl font-bold flex-shrink-0">
          {/* Navbar Content */}
        </div>
        <button onClick={handleLogOut} className="text-sm text-purple-600 font-semibold py-2 px-4 rounded-md hover:bg-purple-200">
          Logout
        </button>
      </div>
      <div className="my-10 border-l-[50px] border-r-[50px] border-purple-200">
        <div className="my-10 max-w-5xl mx-auto py-10 px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="bg-purple-100 rounded-lg mt-4 p-4">
                <h1 className="text-2xl text-purple-600 font-semibold">{campaign.title}</h1>
                <p className="mt-2 text-sm text-purple-600">CREATOR</p>
                <div className="flex items-center mt-1">
                  <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                    W
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{campaign.creatorAddress}</p>
                    <p className="text-xs text-purple-600">10 Campaigns</p>
                  </div>
                </div>
                <h2 className="text-lg font-semibold mt-6 text-purple-600">STORY</h2>
                <p className="mt-2">{campaign.description}</p>
                <h2 className="text-lg font-semibold mt-6 text-purple-600">DONATORS</h2>
                {/* Replace with the list of contributors if available */}
                <ul className="mt-2">
                  {/* Add logic to display donators */}
                </ul>
              </div>
            </div>
            <div>
              <div className="bg-purple-100 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-purple-600">FUND</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-sm">Days Left</p>
                    <p className='text-purple-600'>{Math.floor(campaign.daysLeft / 86400)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Raised</p>
                    <p className='text-purple-600'>
                      {campaign.balance} of {campaign.goal} ETH
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Total Backers</p>
                    <p className='text-purple-600'>{campaign.noOfContributors}</p>
                  </div>
                  <div className="w-full bg-purple-300 h-2 rounded-full mt-4">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(campaign.balance / campaign.goal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <form onSubmit={handleDonate} className="mt-6">
                  <label className="block text-black-600 text-sm mb-2">
                    Pledge without reward:
                  </label>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full p-2 bg-white border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter ETH amount"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-4 w-full bg-purple-600 py-3 rounded-md text-white font-medium hover:bg-purple-700 transition">
                    Fund Campaign
                  </button>
                </form>
              </div>

              {/* VOTE Card */}
              <div className="bg-purple-100 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-purple-600">VOTE</h2>
                <button
                  onClick={handleVote}
                  className="w-full bg-purple-600 py-3 rounded-md text-white font-medium hover:bg-purple-700 transition">
                  Vote for this Campaign
                </button>
                {campaign.requestStatus && (
                  <p className="mt-4 text-sm text-purple-600">Your vote helps support this campaign and raises awareness about its cause. Please consider voting to show your support!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCampaign;
