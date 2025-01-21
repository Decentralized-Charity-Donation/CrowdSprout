import React, { useEffect, useState } from "react";
import { useContract } from "@/ContractContext/ContractContext";

const ViewUpdates = ({ campaignId }) => {
  const { contract } = useContract();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [startTouch, setStartTouch] = useState(0);

  useEffect(() => {
    const fetchUpdates = async () => {
      if (!contract) {
        setError("Contract not connected.");
        setLoading(false);
        return;
      }

      try {
        const result = await contract.getUpdates(campaignId);
        const structuredUpdates = result.map((item) => ({
          title: item[0] || "No title available",
          description: item[1] || "No description available",
          images: Array.isArray(item[2]) ? item[2] : [],
        }));
        setUpdates(structuredUpdates);
      } catch (err) {
        console.error("Error fetching updates:", err);
        setError("Failed to fetch updates.");
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  const openModal = (updateIndex, imageIndex) => {
    setCurrentUpdateIndex(updateIndex);
    setModalImageIndex(imageIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSwipe = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = startTouch - touchEnd;

    if (swipeDistance > 50) {
      setModalImageIndex(
        (prevIndex) =>
          (prevIndex + 1) % updates[currentUpdateIndex]?.images.length
      );
    } else if (swipeDistance < -50) {
      setModalImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + updates[currentUpdateIndex]?.images.length) %
          updates[currentUpdateIndex]?.images.length
      );
    }
  };

  const handleTouchStart = (e) => {
    setStartTouch(e.touches[0].clientX);
  };

  const handlePrevImage = () => {
    setModalImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + updates[currentUpdateIndex]?.images.length) %
        updates[currentUpdateIndex]?.images.length
    );
  };

  const handleNextImage = () => {
    setModalImageIndex(
      (prevIndex) =>
        (prevIndex + 1) % updates[currentUpdateIndex]?.images.length
    );
  };

  if (loading) return <div>Loading updates...</div>;

  if (error) return <div className="text-red-500">{error}</div>;

  if (updates.length === 0) return <div className="text-gray-400">No updates available for this campaign.</div>;

  return (
    <div className="bg-gray-100 p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Updates</h2>
      {updates.map((update, updateIndex) => (
        <div key={updateIndex} className="bg-white p-4 rounded-lg shadow-lg mb-4">
          <p className="mb-2">
            <strong>{update.title}</strong>
          </p>
          <p className="mb-2">{update.description}</p>
          <div className="mb-2">
            {update.images.length > 0 ? (
              <div className="flex flex-col items-center">
                <img
                  src={`https://ipfs.io/ipfs/${update.images[0]}`}
                  alt={`Update Image 1`}
                  className="w-100 h-auto rounded-lg shadow-md mb-2 cursor-pointer"
                  onClick={() => openModal(updateIndex, 0)}
                />
              </div>
            ) : (
              <p>No images available for this update.</p>
            )}
          </div>
        </div>
      ))}

      {modalOpen && (
        <div
          className="fixed w-100 h-100 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleSwipe}
        >
          <div className="bg-white p-4 rounded-lg max-w-md mx-auto relative">
            <div className="flex justify-between items-center">
              <button
                className="text-xl text-gray-700"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xl text-white bg-gray-700 p-2 rounded-full"
            >
              &lt;
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xl text-white bg-gray-700 p-2 rounded-full"
            >
              &gt;
            </button>
            <img
              src={`https://ipfs.io/ipfs/${updates[currentUpdateIndex]?.images[modalImageIndex]}`}
              alt={`Modal Image ${modalImageIndex + 1}`}
              className="w-full h-auto mt-4 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUpdates;
