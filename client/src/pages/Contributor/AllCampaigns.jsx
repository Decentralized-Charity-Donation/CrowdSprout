import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContract } from "@/ContractContext/ContractContext";
import { useNavigate } from "react-router-dom";
import handleLogOut from "@/components/handleLogOut";

const AllCampaigns = () => {
  const [isToastShown, setIsToastShown] = useState(false);
  const [campaignsList, setCampaignsList] = useState([]);
  const [showExpired, setShowExpired] = useState(false);
  const { signer, contract } = useContract();
  const navigate = useNavigate();

  const handleClick = (campaignId) => {
    navigate(`/fundcampaign/${campaignId}`);
  };

  useEffect(() => {
    if (signer && !isToastShown) {
      toast.success("Connected to MetaMask successfully!", {
        autoClose: 6000,
      });
      setIsToastShown(true);
    }
  }, [signer, isToastShown]);

  const fetchCampaigns = async () => {
    try {
      const campaigns = [];
      const campaignCount = await contract.getCampaignCount();
      
      for (let i = 0; i < campaignCount; i++) {
        const isExpired = await contract.isDeadlineReached(i, Math.floor(Date.now() / 1000));
        
        if (showExpired ? !isExpired : isExpired) continue;

        const campaignDetails = await contract.getCampaignBasicDetails(i);
        const campaignImageCid = await contract.getCardImage(campaignDetails.id);
        campaigns.push({
          id: campaignDetails.id,
          title: campaignDetails.title,
          description: campaignDetails.description,
          imageCid: campaignImageCid,
        });
      }
      
      setCampaignsList(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to fetch campaigns. Please try again.");
    }
  };

  useEffect(() => {
    if (signer && contract) {
      fetchCampaigns();
    }
  }, [signer, contract, showExpired]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-6 py-2" style={{ height: "50px" }}>
        <div className="text-xl font-bold flex-shrink-0"></div>
        
        <div className="flex items-center gap-4 ml-auto">
          <button
            onClick={() => setShowExpired((prev) => !prev)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            {showExpired ? "Show Ongoing Campaigns" : "Show Ended Campaigns"}
          </button>
          
          <button
            onClick={handleLogOut}
            className="text-sm text-purple-600 font-semibold py-2 px-4 rounded-md hover:bg-purple-200"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="min-h-screen my-10 w-full bg-gray-100 py-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {showExpired ? "Ended Campaigns" : "Ongoing Campaigns"}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {campaignsList.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 p-4"
            >
              <img
                src={`https://ipfs.io/ipfs/${campaign.imageCid}`}
                alt={campaign.title}
                className="mx-auto rounded-lg shadow-lg w-[350px] h-[150px]"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {campaign.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {campaign.description.length > 100
                    ? `${campaign.description.slice(0, 100)}...`
                    : campaign.description}
                </p>
                <button
                  onClick={() => handleClick(campaign.id)}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Raise Fund
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default AllCampaigns;
