import React, { useEffect, useState } from "react";
import { useContract } from "@/ContractContext/ContractContext";

const CampaignDocumentViewer = ({ campaignId }) => {
  const { contract } = useContract();
  const [cid, setCid] = useState(null);

  useEffect(() => {
    const fetchCid = async () => {
      try {
        const details = await contract.getCampaignBasicDetails(campaignId);
        const ownerAddress = details[0];
        const ownerCid = await contract.getCid(ownerAddress);
        setCid(ownerCid);
      } catch (error) {
        console.error("Error fetching CID:", error);
      }
    };

    if (contract) {
      fetchCid();
    }
  }, [contract, campaignId]);

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${cid}`, "_blank")}
        className="mx-2 bg-purple-600 hover:bg-purple-700 text-white w-[310px] h-[100px]  font-semibold py-3 px-7 rounded-[15px] transition duration-300"
      >
        View Owner Document
      </button>
    </div>
  );
};

export default CampaignDocumentViewer;
