import React, { useState, useEffect } from 'react';
import { useContract } from '@/ContractContext/ContractContext';

const DisplayImage = ({ campaignId }) => {
  const [cid, setCid] = useState(null);
  const { contract } = useContract();

  useEffect(() => {
    const fetchCidFromContract = async () => {
      try {
        const storedCid = await contract.getCardImage(campaignId);
        if (storedCid) {
          setCid(storedCid);
        }
      } catch (error) {
        console.error('Error fetching CID from contract:', error);
      }
    };

    fetchCidFromContract();
  }, [campaignId, contract]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg  p-6">
      {cid ? (
        <div className="text-center">
          <img
            src={`https://ipfs.io/ipfs/${cid}`}
            alt="Uploaded"
             className="mx-auto rounded-lg shadow-lg r w-[600px] h-[300px]"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-gray-500 text-lg font-medium">
            Image not yet uploaded
          </p>
          <p className="text-xs text-gray-400 mt-2">
            The campaign image will appear here once uploaded.
          </p>
        </div>
      )}
    </div>
  );
};

export default DisplayImage;
