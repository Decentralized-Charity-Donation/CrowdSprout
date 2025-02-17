import React, { useState, useEffect } from 'react';
import { useContract } from '@/ContractContext/ContractContext';

const TitleCard = ({ basicDetails, ownerDetails, contributors, id}) => {

  const [contributions, setContributions] = useState([]);
  const {contract}=useContract()
  useEffect(() => {
    
    const fetchContributions = async () => {
      const contributionsData = await Promise.all(
        contributors.map(async (contributor) => {
          const res = await contract.getContributionForAddress(id, contributor);
          return { contributor, amount: Number(res) }; 
        })
      );
   
      setContributions(contributionsData);
     
    };

    if (contract) {
    
      fetchContributions();
    }
  }, []);

  return (
   
    <div>
    
      <div className="bg-purple-100 rounded-lg mt-20 p-4">
        <h1 className="text-2xl text-purple-600 font-semibold">{basicDetails?.title}</h1>
        <p className="mt-2 text-sm text-purple-600">CREATOR</p>
        <div className="flex items-center mt-1">
          <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold">
            {ownerDetails?.name?.charAt(0)} 
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{basicDetails?.creatorAddress}</p>
            <p className="text-xs text-purple-600">Owner Name: {ownerDetails?.name}</p>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-purple-600">STORY</h2>
          <p className="mt-2 text-sm text-purple-700 break-words">
            {basicDetails?.description}
          </p>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-purple-600">Contributors</h2>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm text-left text-purple-600">
              <thead className="bg-purple-200 text-purple-800">
                <tr>
                  <th className="px-4 py-2">Index</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Amount (ETH)</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((data, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{data.contributor}</td>
                    <td className="px-4 py-2">{data.amount} ETH</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleCard;
