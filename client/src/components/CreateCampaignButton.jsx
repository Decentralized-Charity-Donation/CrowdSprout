import React, { useState } from 'react'
import OwnerInfo from './OwnerInfo' // Ensure OwnerInfo is in the same folder or adjust the path

const CreateCampaignButton = ({ isOwner }) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      {isOwner && (
        <div className="flex justify-end mt-4 mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
          >
            Create Campaign
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <OwnerInfo />
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateCampaignButton
