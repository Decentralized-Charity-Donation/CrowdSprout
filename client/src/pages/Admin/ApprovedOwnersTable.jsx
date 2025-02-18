import { useEffect, useState } from "react";
import { useContract } from "@/ContractContext/ContractContext";
import { Button } from "../../components/ui/button";

const ApprovedOwnersTable = ({upload,setUpload}) => {
 
  console.log("TABLE PAGE: ", upload);
  const { contract } = useContract();
  const [owners, setOwners] = useState([]);
  const [cids, setCids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const fetchApprovedOwners = async () => {
      try {
        if (!contract) return;
        const [addresses, documentCIDs] = await contract.getAllApprovedOwners();
        if(addresses.length==0){
          return
        }
        setOwners(addresses);
        setCids(documentCIDs);
      } catch (err) {
        console.error("Error fetching owners:", err);
      } finally {
        setLoading(false);
        setUpload(false)
      }
    };

    fetchApprovedOwners();
  }, [upload,contract]);

  return (
    <div className="w-100 flex justify-center items-center mt-20 pt-0">
      <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-3xl">
        <h2 className="text-xl font-semibold text-center mb-4">Approved Owners</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">Sl. No</th>
                <th className="border p-3">Owner Address</th>
                <th className="border p-3">Document</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner, index) => (
                <tr key={index} className="border">
                  <td className="border p-3">{index + 1}</td>
                  <td className="border p-3">{owner}</td>
                  <td className="border p-3">
                    <Button
                      onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${cids[index]}`, "_blank")}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      View Document
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ApprovedOwnersTable;
