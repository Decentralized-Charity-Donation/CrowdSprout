import React, { useState } from "react";
import Modal from "react-modal";
import OwnerInfo from "./OwnerInfo";
import CreateCampaign from "./CreateCampaign";
import { useContract } from "@/ContractContext/ContractContext";
import handleLogOut from "./handleLogOut"; 

Modal.setAppElement("#root");

const CreateCampaignButton = ({
  addNewCampaign,
  fetchCampaigns,
  setclickedSubmit,
  setShowExpired,
  showExpired,
}) => {
  const { contract, signer } = useContract();
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);

  const handleOwnerSubmit = async () => {
    try {
      const check = await contract.getOwner(signer.getAddress());
      if (check[0] === "0x0000000000000000000000000000000000000000") {
        setShowOwnerModal(true);
      } else {
        setShowCreateCampaignModal(true);
      }
    } catch (error) {
      console.error("Error verifying owner:", error);
    }
  };

  const handleCampaignCreation = async (newCampaign) => {
    try {
      addNewCampaign(newCampaign);
      setShowCreateCampaignModal(false);
      await fetchCampaigns();
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <div>
      <div
        className="fixed top-0 left-0 w-full z-50 bg-white shadow-md flex items-center justify-between px-6 py-2"
        style={{ height: "50px" }}
      >
        <div className="text-xl font-bold flex-shrink-0">
      
        </div>
        <div className="flex space-x-4 ml-auto">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
            onClick={() => setShowExpired(!showExpired)}
          >
            {showExpired ? "Ongoing Campaigns" : "Ended Campaigns"}
          </button>
          <button
            onClick={handleOwnerSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
          >
            Create Campaign
          </button>
          <button
            onClick={handleLogOut} 
            className="text-sm text-purple-600 font-semibold py-2 px-4 rounded-md hover:bg-purple-200"
          >
            Logout
          </button>
        </div>
      </div>

     
      <Modal
        isOpen={showOwnerModal}
        onRequestClose={() => setShowOwnerModal(false)}
        contentLabel="Owner Info Modal"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            width: "400px",
            height: "300px",
            margin: "auto",
            borderRadius: "10px",
            padding: "20px",
            boxSizing: "border-box",
          },
        }}
      >
        <OwnerInfo
          closeModal={() => setShowOwnerModal(false)}
          onSubmit={() => {
            setShowOwnerModal(false);
            setShowCreateCampaignModal(true);
          }}
        />
      </Modal>

      <Modal
        isOpen={showCreateCampaignModal}
        onRequestClose={() => setShowCreateCampaignModal(false)}
        contentLabel="Create Campaign Modal"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: { maxWidth: "500px", margin: "auto", borderRadius: "10px" },
        }}
      >
        <CreateCampaign
          closeModal={() => setShowCreateCampaignModal(false)}
          onSubmit={handleCampaignCreation}
          setclickedSubmit={setclickedSubmit}
        />
      </Modal>
    </div>
  );
};

export default CreateCampaignButton;
