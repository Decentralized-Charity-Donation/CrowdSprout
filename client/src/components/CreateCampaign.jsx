import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to import the CSS
import { useContract } from "@/ContractContext/ContractContext";

const CreateCampaign = ({ closeModal }) => {
  const {contract}=useContract()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    minContribution: "",
    deadline: "",
  });

  // Handle input change and update state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert the goal and minContribution to the appropriate format (e.g., wei)
      

      // Call the addCampaign function from the contract
      const tx = await contract.addCampaign(
        formData.title,
        formData.description,
        formData.goal,
        formData.deadline, // Assuming the deadline is in days
        formData.minContribution
      );

      // Wait for the transaction to be mined
      await tx.wait();

      closeModal(); // Close modal after submission
      toast.success("Campaign created successfully!"); // Show success toast
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
            {/* Campaign Title */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Campaign Title</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter campaign title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter campaign description"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            {/* Goal */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Goal (ETH)</label>
              <input
                type="number"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter fundraising goal (ETH)"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Min Contribution */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Minimum Contribution (ETH)</label>
              <input
                type="number"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Minimum amount the contributor can contribute"
                name="minContribution"
                value={formData.minContribution}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* End Date */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">End Date</label>
              <input
                type="number"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Submit Campaign
            </button>
          </form>
        </div>
      </div>

      {/* Add ToastContainer here */}
      <ToastContainer />
    </div>
  );
};

export default CreateCampaign;
