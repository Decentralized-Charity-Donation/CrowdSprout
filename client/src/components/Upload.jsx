import React, { useState, useEffect } from 'react';
import { useContract } from '@/ContractContext/ContractContext';
import axios from 'axios';
import { PinataSDK } from "pinata-web3";

const Upload = ({ campaignId }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cid, setCid] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const { contract } = useContract();

  const pinata = new PinataSDK({
    pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0MWYxMDA4ZC0zZmYwLTRjYzQtODI1MC0xN2JkNGU4MGJhZTgiLCJlbWFpbCI6InZpbmF5YWdhbmdhZGhhcjIwMDRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjRmNDc0ZTYxNzBmMGJhNGZlNTllIiwic2NvcGVkS2V5U2VjcmV0IjoiMWMzOTIyOGJjMGM5YzNlYWY2ODM1MDcxZDc3ZGRlNTU0OTZkYzI3OWQ0NWJkODZkNzk3ODg1Y2NlZGE4MWViNiIsImV4cCI6MTc2NTE4NzIwMH0.t52SfjIcD9n-Qs0exomJhEfuTP2mojXUNV8D2vuoTO8",
    pinataGateway: "fuchsia-late-magpie-847.mypinata.cloud",
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };


async function main() {
    
    try {
      const fileContent = await file.arrayBuffer(); 
      const fileBlob = new Blob([fileContent], { type: file.type }); 
      const file1 = new File([fileBlob], file.name, { type: file.type }); 
      const upload = await pinata.upload.file(file1);
      console.log(upload);
      return upload;
    } catch (error) {
      console.log(error);
    }
  }
  
//   async function main1() {
//     try {
//       const data = await pinata.gateways.get("bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq");
//       console.log(data)
//     } catch (error) {
//       console.log(error);
//     }
//   }

  const handleUpload = async () => {
    if (!file) return;

    const confirm = window.confirm(
      'Are you sure you want to upload this image to the campaign?'
    );

    if (!confirm) return;

    setIsUploading(true);
     const response= await main();
     const imageCid=response?.IpfsHash;
     console.log(imageCid)
    if (imageCid) {
      setCid(imageCid);
    
      try {
        await contract.updateCardImage(campaignId, imageCid);
        setIsUploaded(true);
      } catch (error) {
        console.error('Error storing CID in contract:', error);
      }
    } else {
      alert('Image upload failed');
    }

    setIsUploading(false);
  };

  useEffect(() => {
    const fetchCidFromContract = async () => {
      try {
        const storedCid = await contract.getCardImage(campaignId);
        setCid(storedCid);
      } catch (error) {
        console.error('Error fetching CID from contract:', error);
      }
    };

    if (isUploaded) {

      fetchCidFromContract();
    }
  }, [cid]);

  useEffect(() => {
    const fetchCidFromContract = async () => {
      try {
        const storedCid = await contract.getCardImage(campaignId);
        setCid(storedCid);
        console.log("dddddd")
      } catch (error) {
        return;
      }
    };

   
      fetchCidFromContract();

  }, [campaignId]);


  return (
    <div>
    
      {!cid ? (
        <div className="max-w-md mx-auto bg-white border-2 border-purple-400 rounded-lg shadow-lg p-6">
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-lg bg-gray-50 p-10"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="mb-4">
            {!file ? (
            <div className="flex flex-col items-center text-gray-400">
          <div className="flex flex-col items-center text-gray-400">
  <div className="flex items-center justify-center w-24 h-24 bg-purple-200 rounded-full mb-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-purple-600"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="9" cy="9" r="2"></circle>
      <path d="M21 15l-5-5L5 21"></path>
    </svg>
  </div>
  <p className="text-gray-500">Drag and Drop File</p>
  <p className="text-xs text-gray-400">JPG, PNG, up to 5MB</p>
  <p className="text-xs text-gray-400">Dimensions : 600 x 300</p>
</div>

          </div>
          
            ) : (
              <p className="text-gray-700">File Selected: {file.name}</p>
            )}
          </div>
          
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="fileInput"
            className="px-6 py-3 bg-purple-500 text-white rounded-lg cursor-pointer hover:bg-purple-600"
          >
            Choose File
          </label>
          <button
            className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-purple-300"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Submit'}
          </button>
        </div>
        </div>
      ) : (
        <div className="text-center">
          <img
            src={`https://ipfs.io/ipfs/${cid}`}

            alt="Uploaded"
            className="mx-auto rounded-lg shadow-lg r w-[600px] h-[300px]"
          />
          
          <div className="mt-4 text-purple-600">
            
             
            
          </div>
        </div>
      )}
    
    </div>
  );
};

export default Upload;
