import Navbar from "../NavBar/NavBar";
import ContactUs from "../components/ContactUs";

const CreateCampaign = () => {
  return (
    <>
      <Navbar />
      <div className=" min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-300 to-purple-500">
        <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl w-full mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Create a New Campaign
          </h2>
          <form>
            {/* Name */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Campaign Title */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                Campaign Title
              </label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter campaign title"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter campaign description"
                rows="4"
                required
              ></textarea>
            </div>

            {/* Goal */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                Goal (ETH)
              </label>
              <input
                type="number"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter fundraising goal (ETH)"
                required
              />
            </div>

            {/* End Date */}
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Campaign Image */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Campaign Image
              </label>
              <input
                type="file"
                className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                accept="image/*"
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
      <ContactUs/>
    </>
  );
};

export default CreateCampaign;