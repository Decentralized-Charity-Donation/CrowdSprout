import React, { useState } from "react";
import UpdatesInfo from "./UpdatesInfo"; 
const Updates = (campaignId) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button
        onClick={openModal}
        className="bg-purple-600 hover:bg-purple-700 mx-[70px] my-[100px] text-white font-semibold py-2 px-7 rounded-full transition duration-300"
      >
        Add Updates
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <UpdatesInfo closeModal={closeModal} campaignId={campaignId} onSubmit={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Updates;
