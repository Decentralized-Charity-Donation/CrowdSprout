import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { PinataSDK } from 'pinata-web3';
import { useContract } from '@/ContractContext/ContractContext';

const AdminUpload = ({setUpload}) => {
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [address,setAddress]=useState()
  const {contract}=useContract()
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_PINATA_GATEWAY
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


async function main() {
    try {
      const fileContent = await file.arrayBuffer(); 
      const fileBlob = new Blob([fileContent], { type: file.type }); 
      const file1 = new File([fileBlob], file.name, { type: file.type }); 
      const upload = await pinata.upload.file(file1);
      console.log(upload.IpfsHash);
      return upload.IpfsHash;
    } catch (error) {
      console.log(error);
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsUploading(true);
   

    const isApproved = await contract.checkIfApprovedOwner(address); 
    
    if (isApproved) {
      alert("This address is already an approved owner.");
      setLoading(false);
      setIsUploading(false);
      setIsModalOpen(false)
      return;
    }

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      alert("Invalid Ethereum address.");
      setLoading(false);
      setIsUploading(false);
      setIsModalOpen(false);
      return;
    }
    
    try {
      const upload = await main(); 
      const cid = upload;
      const tx=await contract.addApprovedOwners(address, cid);
      await tx.wait();
     
    } catch (err) {
      setIsModalOpen(false)
      console.error(err);
      setError("An error occurred while uploading.");
     
    } finally {
      setLoading(false);
      setIsUploading(false);
      setIsModalOpen(false)
      setUpload(true)
    }
  };
  

  return (
    <div>
      <div className="text-sm text-purple-600 font-semibold py-2 px-4 rounded-md hover:bg-purple-200">
        <button onClick={openModal}>Upload</button>
      </div>

      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[350px]">
            <Card>
              <CardHeader>
                <CardTitle>Add Owner</CardTitle>
                <CardDescription>Enter owner address and document.</CardDescription>
              </CardHeader>
              <CardContent>
                {error && <div className="text-red-500">{error}</div>}
                <form onSubmit={handleSubmit} id="updateForm">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="title">Owner account address</Label>
                      <Input
                        type="text"
                        id="title"
                        placeholder="Enter the address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                 
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="files">Upload document</Label>
                      <Input
                        type="file"
                        id="files"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  </div>
                </form>
                {isUploading && (
                  <div className="progress-bar">
                    <div className="bg-blue-500 h-2" style={{ width: "50%" }}></div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={closeModal} >
                  Cancel
                </Button>
                <Button type="submit" form="updateForm" disabled={loading || isUploading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}



      
    </div>
  );
};

export default AdminUpload;
