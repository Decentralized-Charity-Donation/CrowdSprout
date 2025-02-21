import { useState } from "react";
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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.goal || parseFloat(formData.goal) <= 0) errors.goal = "Goal must be greater than 0";
    if (!formData.minContribution || parseFloat(formData.minContribution) <= 0) errors.minContribution = "Minimum Contribution must be greater than 0";
    if (!formData.days && !formData.hours && !formData.minutes) errors.time = "At least one time value (days/hours/minutes) is required";
    if (formData.hours < 0 || formData.hours > 23) errors.hours = "Hours must be between 0 and 23";
    if (formData.minutes < 0 || formData.minutes > 59) errors.minutes = "Minutes must be between 0 and 59";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const tx = await contract.addCampaign(
        formData.title,
        formData.description,
        formData.goal,
        formData.days || 0,
        formData.hours || 0,
        formData.minutes || 0,
        formData.minContribution
      );

      await tx.wait();
      closeModal();
      setclickedSubmit(true);
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <div className="h-[600px] flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-300 to-purple-500">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl w-full mt-16">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Create a New Campaign
        </h2>
        <div className="modal-content max-h-[92vh]">
          <form onSubmit={handleCampaignSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Campaign Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter campaign title"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter campaign description"
                rows="4"
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Goal (ETH)</label>
              <input
                id="goal"
                type="number"
                value={formData.goal}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter fundraising goal (ETH)"
              />
              {errors.goal && <p className="text-red-500 text-sm">{errors.goal}</p>}
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Minimum Contribution (ETH)</label>
              <input
                id="minContribution"
                type="number"
                value={formData.minContribution}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Minimum amount the contributor can contribute"
              />
              {errors.minContribution && <p className="text-red-500 text-sm">{errors.minContribution}</p>}
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Campaign must End in</label>
              
              <div className="flex space-x-4">
             
                <input
                  id="days"
                  type="number"
                  value={formData.days}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-1/3 py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Days"
                  min="0"
                />
                <input
                  id="hours"
                  type="number"
                  value={formData.hours}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-1/3 py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Hours"
                  min="0"
                  max="23"
                />
                <input
                  id="minutes"
                  type="number"
                  value={formData.minutes}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg w-1/3 py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Minutes"
                  min="0"
                  max="59"
                />
              </div>
              {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
              {errors.hours && <p className="text-red-500 text-sm">{errors.hours}</p>}
              {errors.minutes && <p className="text-red-500 text-sm">{errors.minutes}</p>}
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
    </div>
  );
};

export default CreateCampaign;
