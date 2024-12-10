import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContract } from "@/ContractContext/ContractContext";

const CreateCampaign = ({ closeModal, setclickedSubmit }) => {
  const { contract } = useContract();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    minContribution: "",
    days: "",
    hours: "",
    minutes: "",
  });

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const goal = document.getElementById("goal").value;
    const minContribution = document.getElementById("minContribution").value;
    const days = parseInt(document.getElementById("days").value) || 0;
    const hours = parseInt(document.getElementById("hours").value) || 0;
    const minutes = parseInt(document.getElementById("minutes").value) || 0;

   

    const collectedData = {
      title,
      description,
      goal,
      days,
      hours,
      minutes,
      minContribution
     
    };

    setFormData(collectedData);

    try {
      const tx = await contract.addCampaign(
        collectedData.title,
        collectedData.description,
        collectedData.goal,
        collectedData.days, 
        collectedData.hours,
        collectedData.minutes,
        collectedData.minContribution
      );

      await tx.wait();

      closeModal();
      setclickedSubmit(true);
      toast.success("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("There was an error creating the campaign");
    }
  };

  return (
    <div className="h-[600px] flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-300 to-purple-500">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl w-full mt-16">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Create a New Campaign
        </h2>
        <div className="modal-content max-h-[80vh]">
          <form onSubmit={handleCampaignSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Campaign Title</label>
              <input
                id="title"
                type="text"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter campaign title"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                id="description"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter campaign description"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Goal (ETH)</label>
              <input
                id="goal"
                type="number"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter fundraising goal (ETH)"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Minimum Contribution (ETH)</label>
              <input
                id="minContribution"
                type="number"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Minimum amount the contributor can contribute"
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">End Date</label>
              <div className="flex space-x-4">
                <input
                  id="days"
                  type="number"
                  className="border border-gray-300 rounded-lg w-1/3 py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Days"
                  min="0"
                  required
                />
                <input
                  id="hours"
                  type="number"
                  className="border border-gray-300 rounded-lg w-1/3 py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Hours"
                  min="0"
                  max="23"
                  required
                />
                <input
                  id="minutes"
                  type="number"
                  className="border border-gray-300 rounded-lg w-1/3 py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Minutes"
                  min="0"
                  max="59"
                  required
                />
                  

              </div>
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Submit Campaign
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateCampaign;
