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
    deadline: "",
  });

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const goal = document.getElementById("goal").value;
    const minContribution = document.getElementById("minContribution").value;
    const deadline = document.getElementById("deadline").value;

    const collectedData = {
      title,
      description,
      goal,
      minContribution,
      deadline,
    };

    // Save the collected data in state for further use
    setFormData(collectedData);


    try {
      const tx = await contract.addCampaign(
        collectedData.title,
        collectedData.description,
        collectedData.goal,
        collectedData.deadline,
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
              <input
                id="deadline"
                type="number"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter deadline in days"
                required
              />
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
