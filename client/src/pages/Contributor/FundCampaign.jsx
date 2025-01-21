import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useContract } from '@/ContractContext/ContractContext';
import handleLogOut from '@/components/handleLogOut';
import FundCard from '@/components/FundCard';
import VoteCard from '@/components/VoteCard';
import TitleCard from '@/components/TitleCard'; 
import DisplayImage from '@/components/DisplayImage';
import Refund from '@/components/Refund';
import { ethers } from 'ethers';
import ViewUpdates from '@/components/ViewUpdates';

const FundCampaign = () => {
  const { id } = useParams();
  const [basicDetails, setBasicDetails] = useState(null);
  const [financialDetails, setFinancialDetails] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onFund, setOnFund] = useState(false);
  const { contract,signer } = useContract();
  const [show,setShow]=useState(false)
  const [refund,isRefunded]=useState(false)

  const isRefund=()=>{
  isRefunded(true)
  }
  useEffect(() => {
    if (refund) {
     isRefunded(false);
     setShow(false)
    }
  }, [refund]);
  
  const handleVote = async (campaignId) => {
    try {
      await contract.voteForCampaign(campaignId);
    } catch (error) {
      console.error('Voting error:', error);
    }
  };

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
    const checkConditions = async () => {
      try {
        // Check if the user is a contributor
        const isContributor = await contract.isContributor(id);
        // Check if the user has voted
        const hasVoted = await contract.getContributorsIfVoted(id);
        // Check if the deadline is reached
        const isDeadlineReached = await contract.isDeadlineReached(id);

        const VotesInFavour=await contract.isVotesInFavour(id);

        // If the user is a contributor, has not voted, and the deadline is not reached, show the refund button
        if ((isContributor && !hasVoted && !isDeadlineReached) || (isContributor && isDeadlineReached && !VotesInFavour )) {
          setShow(true);
        }
      } catch (error) {
        console.error("Error checking conditions:", error);
      }
    };

    checkConditions(); // Call the async function

}, [id, contract,onFund,refund]); // Dependency array - run this effect whenever `id` or `contract` changes


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
          title: fetchedBasicDetails[2],
          description: fetchedBasicDetails[3],
          creatorAddress: fetchedBasicDetails[0],
          minContribution: parseFloat(fetchedBasicDetails[4]),
          daysLeft: parseFloat(fetchedBasicDetails[5]),
        });

        setFinancialDetails({
          goal: parseFloat(fetchedFinancialDetails[0]),
          balance: parseFloat(fetchedFinancialDetails[1]),
          noOfContributors: parseFloat(fetchedFinancialDetails[2]),
         
        });

        setContributors(fetchedContributors);

        setOwnerDetails({
          address: fetchedOwnerDetails[0],
          name: fetchedOwnerDetails[1],
          verified: fetchedOwnerDetails[2],
        });

      } catch (err) {
        setError('Error fetching campaign details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id, contract, onFund,refund]);

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
              <DisplayImage campaignId={id}/>
              <TitleCard
                basicDetails={basicDetails}
                ownerDetails={ownerDetails}
                contributors={contributors}
                id={id}
              />
              <div  className="md:col-span-5">
              <ViewUpdates campaignId={id}/>
              </div>
            </div>
            <div>
              <FundCard
                campaign={financialDetails}
                minContribution={basicDetails?.minContribution}
                campaignId={basicDetails?.id}
                refreshCampaign={() => {}}
                setOnFund={setOnFund}
                deadline={basicDetails.daysLeft}
              />
              <VoteCard campaignId={basicDetails?.id} onVote={handleVote} />
              {
                show && <Refund campaignId={id} isRefund={isRefund}/>
              }
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundCampaign;
