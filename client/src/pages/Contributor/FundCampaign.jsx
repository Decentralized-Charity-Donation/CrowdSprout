import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContract } from '@/ContractContext/ContractContext';
import handleLogOut from '@/components/handleLogOut';
import FundCard from '@/components/FundCard';
import { ethers } from 'ethers'; 

const FundCampaign = () => {
  const { id } = useParams();
  const [basicDetails, setBasicDetails] = useState(null);
  const [financialDetails, setFinancialDetails] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { contract } = useContract();

  const handleDonate = async (amountInWei) => {
    try {
      await contract.donateToCampaign(id, { value: amountInWei });
      alert('Thank you for your donation!');
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed. Please try again.');
    }
  };

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setIsLoading(true);
        const fetchedBasicDetails = await contract.getCampaignBasicDetails(id);
        const fetchedFinancialDetails = await contract.getCampaignFinancialDetails(id);
        const fetchedContributors = await contract.getContributorsForCampaign(id);
        const fetchedOwnerDetails = await contract.getOwner(fetchedBasicDetails.owner);

        setBasicDetails({
          id: fetchedBasicDetails.id.toString(),
          title: fetchedBasicDetails.title,
          description: fetchedBasicDetails.description,
          creatorAddress: fetchedBasicDetails.owner,
          minContribution:fetchedBasicDetails.minContribution
        });

        setFinancialDetails({
          goal: parseFloat(fetchedFinancialDetails.goal),
          balance: parseFloat(fetchedFinancialDetails.balance),
          noOfContributors: fetchedFinancialDetails.noOfContributors,
          daysLeft: fetchedFinancialDetails.daysLeft,
        });

        setContributors(fetchedContributors);
        
        setOwnerDetails({
          adress:fetchedOwnerDetails.owner,
          name: fetchedOwnerDetails.ownerName,
          verified: fetchedOwnerDetails.verified,
        });
      } catch (err) {
        setError('Error fetching campaign details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id, contract]);

  if (isLoading) return <p className="text-center text-purple-700 mt-20">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-20">{error}</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-6 py-2" style={{ height: '50px' }}>
        <h1 className="text-xl font-bold text-purple-600">Campaign Portal</h1>
        <button
          onClick={handleLogOut}
          className="text-sm text-purple-600 font-semibold py-2 px-4 rounded-md hover:bg-purple-200"
        >
          Logout
        </button>
      </div>
      <div className="my-10 border-l-[50px] border-r-[50px] border-purple-200">
        <div className="my-10 max-w-5xl mx-auto py-10 px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <img
                src=''
                alt={basicDetails?.title}
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="bg-purple-100 rounded-lg mt-4 p-4">
                <h1 className="text-2xl text-purple-600 font-semibold">{basicDetails?.title}</h1>
                <p className="mt-2 text-sm text-purple-600">CREATOR</p>
                <div className="flex items-center mt-1">
                  <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                    W
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{basicDetails?.creatorAddress}</p>
                    <p className="text-xs text-purple-600">Owner Name {ownerDetails?.name}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-purple-600">STORY</h2>
                  <p className="mt-2 text-sm text-purple-700">{basicDetails?.description}</p>
                </div>

                {/* Contributors List Below the Story */}
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-purple-600">Contributors</h2>
                  <div className="overflow-x-auto mt-4">
                    <table className="min-w-full text-sm text-left text-purple-600">
                      <thead className="bg-purple-200 text-purple-800">
                        <tr>
                          <th className="px-4 py-2">Index</th>
                          <th className="px-4 py-2">Address</th>
                          <th className="px-4 py-2">Amount (ETH)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contributors.map((contributor, index) => (
                          <tr key={index+1} className="border-b">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{contributor}</td>
                            <td className="px-4 py-2">100 ETH</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <FundCard
                campaign={financialDetails}
                minContribution={basicDetails?.minContribution}// Example minimum contribution
                campaignId={basicDetails?.id}
                refreshCampaign={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundCampaign;
