import React, { useEffect, useState } from 'react'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import CheckIfOwner from "../utils/isOwner";
import { useContract } from '../ContractContext/ContractContext';
import CreateCampaignButton from '@/components/CreateCampaignButton';

const Campaigns = () => {
  const [isOwner, setIsOwner] = useState(false);
  const { signer } = useContract(); // Get the signer from the contract context
  const [isToastShown, setIsToastShown] = useState(false); // To track if the toast was shown

  useEffect(() => {
    const checkOwner = async () => {
      if (signer) {
        const ownerStatus = await CheckIfOwner(signer);
        console.log(ownerStatus); 
        setIsOwner(ownerStatus);
      }
    };

    checkOwner(); // Check if the user is the owner on component mount

    if (!isToastShown && signer) {
      toast.success('Connected to MetaMask successfully!', {
       
        autoClose: 6000,
      });
      setIsToastShown(true); // Mark toast as shown
    }
  }, [signer]); // Dependency on signer to recheck when it changes

  return (
    <>
<CreateCampaignButton isOwner={isOwner}/>

      <div className="bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-8 text-center">
            Ongoing Campaigns
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 p-4"
              >
                <img
                  src={`campaign${i}.jpg`} 
                  alt={`Campaign ${i}`} 
                  className="w-full h-40 object-cover"
                 
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Campaign Title {i}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    Brief description of the campaign goes here. Share the purpose and impact of this campaign.
                  </p>
                  <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
                    Raise Fund
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 p-4"
              >
                <img
                  src={`campaign${i}.jpg`}
                  alt={`Campaign ${i}`}
                  className="w-full h-40 object-cover"
                  onError={(e) => e.target.src = 'fallback.jpg'} // Set a fallback image
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Campaign Title {i}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    Brief description of the campaign goes here. Share the purpose and impact of this campaign.
                  </p>
                  <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
                    Raise Fund
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Campaigns;
