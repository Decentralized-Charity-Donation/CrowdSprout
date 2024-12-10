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
import axios from "axios";

const UpdatesInfo = ({ closeModal, campaignId, onSubmit }) => {
  const { contract } = useContract();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState([]);

  const pinataApiKey = "4f474e6170f0ba4fe59e";
  const pinataApiSecret =
    "1c39228bc0c9c3eaf6835071d77dde55496dc279d45bd86d797885cceda81eb6";

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataApiSecret,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          setUploadProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        }
      },
    };

    try {
      const response = await axios.post(url, formData, config);
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Error uploading file to Pinata:", error);
      setError("Error uploading image. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || imageFiles.length === 0) {
      setError("All fields are required.");
      return;
    }

    const uploadedCids = [];
    for (const file of imageFiles) {
      const cid = await handleFileUpload(file);
      if (cid) {
        uploadedCids.push(cid);
      }
    }

    if (uploadedCids.length === 0) {
      setError("No images uploaded successfully.");
      return;
    }

    if (!contract) {
      setError("Contract not found.");
      return;
    }

    setLoading(true);
    console.log( title, description, uploadedCids)
    try {
      const tx = await contract.addUpdate(
        campaignId,
        title.trim(),
        description.trim(),
        uploadedCids
      );
      await tx.wait();
      onSubmit(false);
      closeModal();
    } catch (error) {
      console.error("Error adding update:", error);
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
          {error && <div className="error-message">{error}</div>}
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
                <Label htmlFor="image">Add Images</Label>
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImageFiles([...e.target.files])}
                  required
                />
              </div>
            </div>
          </form>
          {uploadProgress > 0 && (
            <div className="progress-bar">
              <div style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="updateForm" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpdatesInfo;
