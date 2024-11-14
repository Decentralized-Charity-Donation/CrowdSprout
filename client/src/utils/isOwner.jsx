const CheckIfOwner = async (signer) => {
      try {
        const address = await signer.getAddress(); // await the Promise to get the actual address
        return address === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" ||
               address === "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
      } catch (error) {
        console.error("Error retrieving address:", error);
        return false;
      }
    };
    
    export default CheckIfOwner;
    