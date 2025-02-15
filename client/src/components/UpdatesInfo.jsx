import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useContract } from "@/ContractContext/ContractContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PinataSDK } from "pinata-web3";

const UpdatesInfo = ({ closeModal, campaignId ,setLoad}) => {
  const { contract } = useContract();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const pinata = new PinataSDK({
    pinataJwt:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0MWYxMDA4ZC0zZmYwLTRjYzQtODI1MC0xN2JkNGU4MGJhZTgiLCJlbWFpbCI6InZpbmF5YWdhbmdhZGhhcjIwMDRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjRmNDc0ZTYxNzBmMGJhNGZlNTllIiwic2NvcGVkS2V5U2VjcmV0IjoiMWMzOTIyOGJjMGM5YzNlYWY2ODM1MDcxZDc3ZGRlNTU0OTZkYzI3OWQ0NWJkODZkNzk3ODg1Y2NlZGE4MWViNiIsImV4cCI6MTc2NTE4NzIwMH0.t52SfjIcD9n-Qs0exomJhEfuTP2mojXUNV8D2vuoTO8",
    pinataGateway:"fuchsia-late-magpie-847.mypinata.cloud",
  });

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const uploadToPinata = async (files) => {
    try {
      setIsUploading(true);
      const uploadPromises = files.map(async (file) => {
        const fileContent = await file.arrayBuffer();
        const fileBlob = new Blob([fileContent], { type: file.type });
        const fileToUpload = new File([fileBlob], file.name, { type: file.type });
        const response = await pinata.upload.file(fileToUpload);
        return response?.IpfsHash; 
      });
      const cids = await Promise.all(uploadPromises);
      console.log(cids)
      setIsUploading(false);
      return cids;
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading files to Pinata:", error);
      setError("Failed to upload images. Please try again.");
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
   
    if (!title.trim() || !description.trim() || files.length === 0) {
      setError("All fields are required.");
      return;
    }

    const imageCids = await uploadToPinata(files);
    console.log(imageCids);

    if (!imageCids.length) {
      setError("Image upload failed.");
      return;
    }

    if (!contract) {
      setError("Contract not found.");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.addUpdate(
        BigInt(campaignId),
        title.trim(),
        description.trim(),
        imageCids
      );
      await tx.wait();
      closeModal();
      setLoad(true)
    } catch (error) {
      console.error("Error adding update to contract:", error);
      setError("Failed to add update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Update Details</CardTitle>
          <CardDescription>Enter the details for your update.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500">{error}</div>}
          <form onSubmit={handleSubmit} id="updateForm">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Enter the title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <textarea
                  className="border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                  rows="4"
                  id="description"
                  placeholder="Enter the description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="files">Upload Images</Label>
                <Input
                  type="file"
                  id="files"
                  accept="image/*"
                  multiple
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
          <Button variant="outline" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="updateForm" disabled={loading || isUploading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpdatesInfo;
