import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContract } from "@/ContractContext/ContractContext";
import { useNavigate } from "react-router-dom";
import CreateCampaignButton from "@/components/CreateCampaignButton";

const OwnerCampaigns = () => {
  const [isToastShown, setIsToastShown] = useState(false);
  const [campaignsList, setCampaignsList] = useState([]);
  const { signer, contract } = useContract();
  const [clickedSubmit, setClickedSubmit] = useState(false);
  const navigate = useNavigate();
  const handleClick = (campaignId) => {
    navigate(`/viewcampaign/${campaignId}`);
  };

  useEffect(() => {
    if (!isToastShown && signer) {
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
        const campaignImageCid = await contract.getCardImage(
          campaignDetails.id
        );
        const owner_address = campaignDetails.owner;
        const address = await signer.getAddress();
        if (owner_address === address) {
          campaigns.push({
            id: campaignDetails.id,
            title: campaignDetails.title,
            description: campaignDetails.description,
            imageCid: campaignImageCid,
          });
        }
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

  useEffect(() => {
    if (clickedSubmit) {
      fetchCampaigns();
      setClickedSubmit(false);
    }
  }, [clickedSubmit]);

  const addNewCampaign = (newCampaign) => {
    setCampaignsList((prevList) => [newCampaign, ...prevList]);
  };

  return (
    <>
      <CreateCampaignButton
        addNewCampaign={addNewCampaign}
        fetchCampaigns={fetchCampaigns}
        setclickedSubmit={setClickedSubmit}
      />
      
      <div className="min-h-screen w-full bg-gray-100 py-10">
        <div className="  py-5">
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-1 text-center">
            Ongoing Campaigns
          </h2>
          </div>
          <div className="my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
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
                    View Campaign
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

export default OwnerCampaigns;
