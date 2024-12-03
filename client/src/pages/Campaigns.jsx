import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckIfOwner from "../utils/isOwner";
import { useContract } from '../ContractContext/ContractContext';
import CreateCampaignButton from '@/components/CreateCampaignButton';

const Campaigns = () => {
  const [isOwner, setIsOwner] = useState(false);
  const [isToastShown, setIsToastShown] = useState(false);
  const [campaignsList, setCampaignsList] = useState([]); // State to store the campaign list
  const { signer, contract } = useContract(); 

  useEffect(() => {
    const checkOwner = async () => {
      if (signer) {
        const ownerStatus = await CheckIfOwner(signer);
        setIsOwner(ownerStatus);
      }
    };

    checkOwner(); 

    if (!isToastShown && signer) {
      toast.success('Connected to MetaMask successfully!', {
        autoClose: 6000,
      });
      setIsToastShown(true);
    }
  }, [signer, isToastShown]);

  const fetchCampaigns = async () => {
    try {
      const campaigns = [];
      const campaignCount = await contract.getCampaignCount()

      for (let i = 0; i < campaignCount; i++) {
        const campaignDetails = await contract.getCampaignBasicDetails(i)
        campaigns.push({
          id: campaignDetails.id,
          title: campaignDetails.title,
          description: campaignDetails.description,
        });
      }

      setCampaignsList(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    if (signer && contract) {
      fetchCampaigns();
    }
  }, [signer, contract]);

  return (
    <>
      <CreateCampaignButton isOwner={isOwner} />

      <div className="bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-8 text-center">
            Ongoing Campaigns
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {campaignsList.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 p-4"
              >
                <img
                  src={`campaign${campaign.id}.jpg`}
                  alt={`Campaign ${campaign.id}`}
                  className="w-full h-40 object-cover"
                  onError={(e) => e.target.src = 'fallback.jpg'}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    {campaign.description}
                  </p>
                  <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
                    Raise Fund
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Campaigns;
