const CONTRACT_ADDRESS = "0x0CC88dd26F8b14300DD69bBe7e5E7a74FbC3beBd"
const META_DATA_URL = "ipfs://bafyreihp45mqoc5edcaf76rkek4zlu5mz7lpxg43uu57fafqric3n4buyi/metadata.json"

async function mintNFT(contractAddress, metaDataURL) {
   const CtRNFT = await ethers.getContractFactory("CtRNFT")
   const [owner] = await ethers.getSigners()
   await CtRNFT.attach(contractAddress).mintNFT(owner.address, metaDataURL)
   console.log("NFT minted to: ", owner.address)
}

mintNFT(CONTRACT_ADDRESS, META_DATA_URL)
   .then(() => process.exit(0))
   .catch((error) => {
       console.error(error);
       process.exit(1);
   });