import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Campaigns = () => {
 


  return (
    <>
      

      <div className="bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-8 text-center">
            Ongoing Campaigns
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-500 hover:scale-105 p-4">
                <img src={`campaign${i}.jpg`} alt={`Campaign ${i}`} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">Campaign Title {i}</h3>
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