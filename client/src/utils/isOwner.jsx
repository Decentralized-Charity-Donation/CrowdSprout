const CheckIfOwner = async (signer) => {
      try {
        const address = await signer.getAddress(); // await the Promise to get the actual address
        return address === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"  ;
      } catch (error) {
        console.error("Error retrieving address:", error);
        return false;
      }
    };
    
    export default CheckIfOwner;
    

  