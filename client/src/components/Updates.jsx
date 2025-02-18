import React, { useState, useEffect } from "react";
import UpdatesInfo from "./UpdatesInfo";
import { useContract } from "@/ContractContext/ContractContext";

const Updates = ({ campaignId,setLoad}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeadlineReached, setIsDeadlineReached] = useState(false);
  const { contract } = useContract();

  useEffect(() => {
    const checkDeadline = async () => {
      const deadline = await contract.isDeadlineReached(campaignId,Math.floor(Date.now() / 1000));
      console.log(deadline);
      setIsDeadlineReached(deadline);
    };

    checkDeadline();
  }, [contract, campaignId]);

  const openModal = () => {
    if (!isDeadlineReached) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button
        onClick={openModal}
        className={`w-[285px] h-[100px] mx-[10px] mt-[30px] font-semibold py-3 px-7 rounded-[15px] transition duration-300 ${
          isDeadlineReached
            ? "bg-purple-400 cursor-not-allowed text-gray-50"
            : "bg-purple-600 hover:bg-purple-700 text-white"
        }`}
        disabled={isDeadlineReached}
      >
        Add Updates
      </button>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <UpdatesInfo closeModal={closeModal} campaignId={campaignId} setLoad={setLoad}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Updates;
