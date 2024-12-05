import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContract } from '@/ContractContext/ContractContext';
import handleLogOut from '@/components/handleLogOut';

const ViewCampaign = () => {
  const { id } = useParams();
  const [basicDetails, setBasicDetails] = useState(null);
  const [financialDetails, setFinancialDetails] = useState(null);
  const [voteRequestDetails, setVoteRequestDetails] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { contract } = useContract();

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        setIsLoading(true);
        const fetchedBasicDetails = await contract.getCampaignBasicDetails(id);
        const fetchedFinancialDetails = await contract.getCampaignFinancialDetails(id);
        const fetchedVoteRequestDetails = await contract.getCampaignVoteRequestDetails(id);
        const fetchedContributors = await contract.getContributorsForCampaign(id);
        const fetchedOwnerDetails = await contract.getOwner(fetchedBasicDetails.owner);

        setBasicDetails({
          id: fetchedBasicDetails.id.toString(),
          title: fetchedBasicDetails.title,
          description: fetchedBasicDetails.description,
          creatorAddress: fetchedBasicDetails.owner,
        });

        setFinancialDetails({
          goal: parseFloat(fetchedFinancialDetails.goal),
          balance: parseFloat(fetchedFinancialDetails.balance),
          totalContributors: fetchedFinancialDetails.noOfContributors,
        });

        setVoteRequestDetails({
          requested: fetchedVoteRequestDetails.requestStatus,
          votesInFavor: fetchedVoteRequestDetails.votesInFavor,
        });

        setContributors(fetchedContributors);

        setOwnerDetails({
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
          className="text-sm text-purple-600 font-semibold py-2 px-4 rounded-md hover:bg-purple-200">
          Logout
        </button>
      </div>
      <div className="my-10 border-l-[50px] border-r-[50px] border-purple-200">
        <div className="my-10 max-w-5xl mx-auto py-10 px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <img
                src={`https://placeimg.com/640/480/tech?id=${basicDetails?.id}`}
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
  <p className="mt-2">{basicDetails?.description}</p>
</div>
                <h2 className="text-lg font-semibold mt-6 text-purple-600">DONATORS</h2>
                <ul className="mt-2">
                  {contributors.map((contributor, index) => (
                    <li key={index} className="flex justify-between border-b border-purple-200 py-2">
                      <span>{contributor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className="bg-purple-100 rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-purple-600">FUND</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-sm">Days Left</p>
                    <p className="text-purple-600">10</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Raised</p>
                    <p className="text-purple-600">
                      {financialDetails?.balance} of {financialDetails?.goal} ETH
                    </p>
                  </div>
                  <div className="w-full bg-purple-300 h-2 rounded-full mt-4">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(financialDetails?.balance / financialDetails?.goal) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-4">
                    <p className="text-sm">Total Backers</p>
                    <p className="text-purple-600">{financialDetails?.totalContributors}</p>
                  </div>
                  <button
                    className="w-full bg-purple-600 text-white py-2 rounded-lg mt-4 hover:bg-purple-700">
                    Fund Campaign
                  </button>
                </div>
              </div>
              <div className="bg-purple-100 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-purple-600">VOTE</h2>
                <p>
                  {voteRequestDetails?.requested ? `Votes in favor: ${voteRequestDetails?.votesInFavor}` : 'No vote request available'}
                </p>
                <button
                  className="w-full bg-purple-600 text-white py-2 rounded-lg mt-4 hover:bg-purple-700">
                  Vote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCampaign;
