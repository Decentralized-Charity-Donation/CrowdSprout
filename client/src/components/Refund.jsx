import { useContract } from '@/ContractContext/ContractContext';
import React from 'react'

const Refund = ({  campaignId, setShow}) => { // Destructure campaignId correctly
  const { contract } = useContract();
  
  
  const getRefund = async () => {
    try {
      await contract.refundMyContribution(campaignId);
      setShow(false)
      alert("Money Refunded");
      return
    } catch (error) {
      console.error("Refund failed:", error);
      alert("No refund available");
    }
  }

  return (
    <div className="bg-purple-100 rounded-lg p-6 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-purple-600">REFUND</h2>
      <p className="text-sm text-purple-600">
        Get Your Money Back!Only if Not yet Voted!
      </p>

      <button
        onClick={getRefund} // Handles disabled clicks with an alert
        className={"mt-4 w-full py-3 rounded-md font-medium bg-purple-700 hover:bg-purple-600 text-white"}
      >
        Get Refund {/* Button text */}
      </button>
    </div>
  );
}

export default Refund;
