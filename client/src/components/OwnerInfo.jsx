import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useContract } from '@/ContractContext/ContractContext';
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

const OwnerInfo = ({ closeModal, onSubmit }) => {
  const { contract } = useContract();
  const [ownerName, setOwnerName] = useState("");

  const handleSubmit = async (e) => {
  
    if (!contract) {
      console.log("Contract not found");
      return;
    }
  
    try {
      const a=await contract.addOwner(ownerName)
      await a.wait()
      console.log("Transaction mined successfully");
      onSubmit(); 
      
      
    } catch (error) {
      console.error("Error adding owner:", error);
    }
  };

  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Owner Details</CardTitle>
          <CardDescription>Enter your Details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>  
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                 type="text"
                  id="ownerName"
                  placeholder="Enter your name"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={closeModal}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} form="ownerForm">Submit</Button> 
        </CardFooter>
      </Card>
    </div>
  );
};

export default OwnerInfo;
