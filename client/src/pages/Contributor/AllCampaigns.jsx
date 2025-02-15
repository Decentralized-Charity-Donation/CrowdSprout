import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContract } from "@/ContractContext/ContractContext";
import { useNavigate } from "react-router-dom";
import handleLogOut from "@/components/handleLogOut";

const AllCampaigns = () => {
  const [isToastShown, setIsToastShown] = useState(false);
  const [campaignsList, setCampaignsList] = useState([]);
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
        const campaignDetails = await contract.getCampaignBasicDetails(i);
        const campaignImageCid = await contract.getCardImage(campaignDetails.id); // Fetch CID for image
        campaigns.push({
          id: campaignDetails.id,
          title: campaignDetails.title,
          description: campaignDetails.description,
          imageCid: campaignImageCid, // Add image CID to campaign details
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
  }, [signer, contract]);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-6 py-2"
        style={{ height: "50px" }}
      >
        <div className="text-xl font-bold flex-shrink-0">{/* Navbar Content */}</div>
        <button
          onClick={handleLogOut}
          className="text-sm text-purple-600 font-semibold py-2 px-4 rounded-md hover:bg-purple-200"
        >
          Logout
        </button>
      </div>

      <div className="min-h-screen w-full bg-gray-100 py-10">
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
      </div>

      <ToastContainer />
    </>
  );
};

export default AllCampaigns;
